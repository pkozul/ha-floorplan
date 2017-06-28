# Floorplan for Home Assistant

![floorplan](https://user-images.githubusercontent.com/2073827/27056482-911f2e14-500b-11e7-90f0-44a344c39f85.png)

## Background

Out of the box, the Home Assistant [front end](https://home-assistant.io/docs/frontend/) provides a great way of viewing and interacting with your entities. This project builds on top of that, allowing you to extend the user interface by adding your own visuals.

With Floorplan for Home Assistant, you can:

- Integrate with Home Assistant as either a state card or a custom panel
- Display any number of entities (i.e. binary sensors, lights, cameras, etc.)
- Style each entity's states using CSS
- Gradually transition between states using color gradients
- Display the last triggered binary sensor using CSS
- Display hover-over text for each entity
- Call a service or display a popup dialog when an entity is clicked

Despite its title, Floorplan for Home Assistant can be used as a general purpose user interface for just about anything you want to present in a visual way.

The concept is quite simple. You create an SVG file and simply add shapes/images to represent your Home Assistant entities. As long as the ids match up, your SVG comes to life and displays your entities' states in real time. Your entities also become clickable, so they act as shortcuts to opening the built-in 'more info' popups that are normally displayed by Home Assistant. This means clicking on a camera icon, for example, opens the Home Assistant 'more info' popup that displays the live camera feed. Hovering over the entitiy displays a tooltip showing all the information related to the entity.

Although using it as a floorplan is the most common use case, you can go even further and create visuals of real world components. Some examples are:

- An SVG image of a remote control with each button click triggering a service in Home Assistant
- An SVG image of a Ring doorbell with the sensor and camera mapped to sensors in Home Assistant
- An SVG image of a Logitech Squeezebox media player with the screen text mapped to the state, current song, etc. in Home Assistant

## Usage

To get started, copy the following files from this repo to your Home Assistant directory:

```
www/custom_ui/floorplan/ha-floorplan.html
www/custom_ui/floorplan/floorplan.svg
www/custom_ui/floorplan/floorplan.css
```

Although a sample floorplan SVG file is included in this repo, you will want to create your own. See the [appendix](#creating-a-floorplan-svg-file) for more information.

You then have two options for how you want to the floorplan to appear in Home Assistant:

- custom state card
- custom panel

Of course, you can choose to have it displayed in both places. If you have several floorplans to display (i.e. different levels of a house), that is supported too.

### Option 1: Floorplan custom state card

![image](https://user-images.githubusercontent.com/2073827/27063035-97aa2a6e-5032-11e7-8e8e-79935a19aebf.png)

To display the floorplan as a custom state card, copy the following file from this repo to your Home Assistant directory:

```
www/custom_ui/state-card-floorplan.html
```

Since Home Assistant requires a single entity to be used as the target for a state card, create a virtual entity to represent the overall floorplan. You can choose any type of entity for this, such as the MQTT binary sensor. Add the following to your Home Assistant configuration:

```
binary_sensor:
  - platform: mqtt
    state_topic: dummy/floorplan/sensor
    name: Floorplan
```

Then, add the following to get Home Assistant to display this new virtual entity using the floorplan custom state card:

```
homeassistant:
  customize:    
    binary_sensor.floorplan:
      custom_ui_state_card: floorplan
      config: !include floorplan.yaml
```

To actually display the floorplan custom state card in the front end, add the virtual entity to one of your groups:

```
group:
  zones:
    name: Zones
    entities:
      - binary_sensor.floorplan
```

You can also add a 'last motion' entity to keep track of which binary sensor was triggered last. See the [appendix](#adding-a-last-motion-entity-to-your-floorplan) for more information.

### Option 2: Floorplan custom panel

![image](https://user-images.githubusercontent.com/2073827/27063110-08d3fd82-5033-11e7-85b6-671722608394.png)

To display the floorplan as a custom panel, copy the following file from this repo to your Home Assistant directory:

```
panels/floorplan.html
```

Then, add the following to your Home Assistant configuration:

```
panel_custom: 
  - name: floorplan
    sidebar_title: Floorplan
    sidebar_icon: mdi:home
    url_path: floorplan
    config: !include floorplan.yaml
```

### Configure the floorplan

Whether your floorplan is being displayed as a custom state card or as a custom panel, the same configuration file `floorplan.yaml` is used. This is where you tell Home Assistant which entities you want to display on your floorplan.

The example `floorplan.yaml` included in this repo shows how to add various entities to your floorplan and style their appearance based on their states.

At the top of the file, you provide a name for the floorplan, as well as the location of the SVG and CSS files:

```
      name: Demo Floorplan
      image: /local/custom_ui/floorplan/floorplan.svg
      stylesheet: /local/custom_ui/floorplan/floorplan.css
```

If you want to support panning and zooming within your SVG file, add the following:

```
      pan_zoom:
```

If you want the floorplan to display any warnings (i.e. SVG file does not contain required elements), add the following:

```
      warnings:
```

If you want to display a 'last motion' entity, you can include that in the next section of the file. You specify the name of the entity, as well as the CSS class used to style its appearance:

```
      last_motion_entity: sensor.template_last_motion
      last_motion_class: last-motion
```

The remainder of the file is where you add your floorplan groups. These floorplan groups are not to be confused with [Home Assistant entity groups](https://home-assistant.io/components/group) that are used to combine multiple entities into one.

```
      groups:
```

You need to place each of your entities into a floorplan group, since configuration is performed at a floorplan group level. The floorplan groups can be given any name, and have no purpose other than to allow for configuration of multiple items in one place.

If you've already created some Home Assistant entity groups, you can actually include those groups (i.e. `group.kitchen_lights`) in the flooorplan group, rather than explicity including each entity individually.

Below are some examples of groups, showing how to configure different types of entities in the floorplan.

#### Sensors

Below is an example of a 'Sensors' group, showing how to add a temperature sensor (as text) to your floorplan. in the screenshot above, this can be seen as an SVG text element displaying the current temperature (i.e. '9.0°').

The sensor's state is displayed using a `text_template`. As you can see, it contains some embedded code that determines which actual text to display.

The sensor's CSS class is determined dynamically using a `class_template`. In the example below, the CSS class is determined based on the actual temperature value.

See the [appendix](#using-template-literals-in-your-configuration) for more information on how to use template literals in your configuration.

```
        - name: Sensors
          entities:
             - sensor.melbourne_now
             - group.major_city_temp_sensors
          text_template: '${entity.state ? entity.state : "unknown"}'
          class_template: '
            var temp = parseFloat(entity.state.replace("°", ""));
            if (temp < 10)
              return "temp-low";
            else if (temp < 30)
              return "temp-medium";
            else
              return "temp-high";
            '
```

#### Switches

Below is an example of a 'Switches' group, showing how to add switches to your floorplan. The appearance of each switch is styled using the appropriate CSS class, based on its current state. The `action` is optional, and allows you to specify which service should be called when the entity is clicked.

```
        - name: Switches
          entities:
             - switch.doorbell
          states:
            - state: 'on'
              class: 'doorbell-on'
            - state: 'off'
              class: 'doorbell-off'
          action:
            service: toggle
```

#### Lights

Below is an example of a 'Lights' group, showing how to add lights to your floorplan. The appearance of each light is styled using the appropriate CSS class, based on its current state.

```
        - name: Lights
          entities:
             - light.hallway
             - light.living_room
             - light.patio
          states:
            - state: 'on'
              class: 'light-on'
            - state: 'off'
              class: 'light-off'
```

#### Alarm Panel

Below is an example of an 'Alarm Panel' group, showing how to add an alarm panel (as text) to your floorplan. The appearance of the alarm panel is styled using the appropriate CSS class, based on its current state. In the screenshot above, this can be seen as an SVG text element displaying the current alarm status (i.e. 'disarmed').

```
       - name: Alarm Panel
          entities:
             - alarm_control_panel.alarm
          states:
            - state: 'armed_away'
              class: 'alarm-armed'
            - state: 'armed_home'
              class: 'alarm-armed'
            - state: 'disarmed'
              class: 'alarm-disarmed'
```

#### Binary Sensors

Below is an example of a 'Binary sensors' group, showing how to add binary sensors to your floorplan. The appearance of each binary sensor is styled using the appropriate CSS class, based on its current state. In the screenshot above, these can be seen as SVG paths (i.e. rooms/zones of the house).

The `state_transitions` section is optional, and allows your binary sensors to visually transition from one state to another, using the fill colors defined in the CSS classes associated with each state. You can specify the duration (in seconds) for the transition from one color to the other.

```
        - name: Binary Sensors
          entities:
            - binary_sensor.front_hallway
            - binary_sensor.kitchen
            - binary_sensor.master_bedroom
            - binary_sensor.theatre_room
          states:
            - state: 'off'
              class: 'info-background'
            - state: 'on'
              class: 'warning-background'
          state_transitions:
            - name: On to off
              from_state: 'on'
              to_state: 'off'
              duration: 10
```

#### Cameras

Below is an example of a 'Cameras' group, showing how to add cameras to your floorplan. The appearance of each camera is styled using the appropriate CSS class, based on its current state. In the screenshot above, these can be seen as camera icons, which were imported from an external SVG image.

        - name: Cameras
          entities:
            - camera.hallway
            - camera.driveway
            - camera.front_door
            - camera.backyard
          states:
            - state: 'idle'
              class: 'camera-idle'

#### Media Players

Below is an example of a 'Media Players' group, showing how to add media players to your floorplan. The appearance of each media player is styled using the appropriate CSS class, based on its current state. In the screenshot above, these can be seen as Logitech Squeezebox icons, which were imported from an external SVG image.

        - name: Media Players
          entities:
            - media_player.alfresco
            - media_player.ensuite
            - media_player.salon
          states:
            - state: 'off'
              class: 'squeezebox-off'
            - state: 'idle'
              class: 'squeezebox-off'
            - state: 'paused'
              class: 'squeezebox-off'
            - state: 'playing'
              class: 'squeezebox-on'

## Appendix

### Creating a floorplan SVG file

[Inkscape](https://inkscape.org/en/develop/about-svg/) is a free application that lets you create vector images. You can make your floorplan as simple or as detailed as you want. The only requirement is that you create an element (i.e. `rect`, `path`, `text`, etc.) for each entity ( i.e. binary sensor, switch, camera, etc.) you want to display on your floorplan. Each of these elements needs to have its `id` set to the corresponding entity name in Home Assistant.

For example, below is what the SVG element looks like for a Front Hallway binary sensor. The `id` of the shape is set to the entity name `binary_sensor.front_hallway`. This allows the shape to automatically get hooked up to the right entity when the floorplan is displayed.

```html
<path id="binary_sensor.front_hallway" d="M650 396 c0 -30 4 -34 31 -40 17 -3 107 -6 200 -6 l169 0 0 40 0 40
-200 0 -200 0 0 -34z"/>
```

If you need a good source of SVG files for icons or images, you can check out the following resources : 
[Material Design Icons](https://materialdesignicons.com/), [Noun Project](https://materialdesignicons.com/) and [Flat Icon](https//flaticon.com)

### Adding a last motion entity to your floorplan

As an optional step, you can create a 'last motion' entity to keep track of which binary sensor was triggered last. To do so, add the following:

```
sensor:
  - platform: template
    sensors:
      template_last_motion:
        friendly_name: 'Last Motion'
        value_template: >
          {%- set sensors = [states.binary_sensor.theatre_room, states.binary_sensor.back_hallway, states.binary_sensor.front_hallway, states.binary_sensor.kitchen] %}
          {% for sensor in sensors %}
            {% if as_timestamp(sensor.last_changed) == as_timestamp(sensors | map(attribute='last_changed') | max) %}
              {{ sensor.name }}
            {% endif %}
          {% endfor %}
```

To actually display the 'last motion' entity', add it to one of your groups:

```
group:
  zones:
    name: Zones
    entities:
      - sensor.template_last_motion
      - binary_sensor.floorplan
```

### Using template literals in your configuration

Both `text_template` and `class_template` allow you to inject your own expressions and code using JavaScript [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals). Within these template literals, you have full access to the entity's state object, which allows you to access other properties such as `last_changed`, `attributes.friendly_name`, etc. The full set of objects available to your template literals is shown below:

- `entity` - the state object for the current entity
- `entities` - the state objects for all entities
- `hass` - the [hass object](https://home-assistant.io/developers/development_hass_object/)
- `config` - the floorplan configuration

```
        - name: Sensors
          entities:
             - sensor.melbourne_now
          text_template: '${entity.state ? entity.state : "unknown"}'
          class_template: '
            var temp = parseFloat(entity.state.replace("°", ""));
            if (temp < 10)
              return "temp-low";
            else if (temp < 30)
              return "temp-medium";
            else
              return "temp-high";
            '
```

## More information

For discussions and more information, check out the [thread](https://community.home-assistant.io/t/floorplan-for-home-assistant) on the Home Assistant forums.
