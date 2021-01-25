<table align="center">
<tr>
<td>
<h1 align="center">
⚠️ Please migrate to <a href="https://github.com/ExperienceLovelace/ha-floorplan"><b>ha-floorplan</b></a> ⚠️ 
</h1>
<p align="center">
ha-floorplan has been replaced with <a href="https://github.com/ExperienceLovelace/ha-floorplan"><b>ha-floorplan</b></a>.<br><br>Please check out the new solution, and let us know what you think.<br><br>
</p>
</td>
</tr>
</table>

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
www/custom_ui/floorplan/lib/jquery-3.2.1.min.js
www/custom_ui/floorplan/lib/moment.min.js
www/custom_ui/floorplan/lib/svg-pan-zoom.min.js
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

To allow the above file to be served by Home Assistant, add it to the `frontend` section of your Home Assistant configuration:

```
frontend:
  extra_html_url:
    - /local/custom_ui/state-card-floorplan.html
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
      custom_ui_state_card: state-card-floorplan
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

If you want the floorplan to display any warnings (i.e. SVG file does not contain required elements), add the following:

```
      warnings:
```

If you want to support panning and zooming within your SVG file, add the following:

```
      pan_zoom:
```

If you want to hide the main application toolbar and display the floorplan in true fullscreen mode (when used as a custom panel), add the following:

```
      hide_app_toolbar:
```

To set the date format displayed in the hover-over text, add the following:

```
      date_format: DD-MMM-YYYY
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

If you've already created some Home Assistant entity groups, you can actually include those groups in two different ways:

- single - the group will be represented as a single entity (`group.pantry_lights` in the example below). These sorts of Home Assistant entity groups get added beneath `entities:`).

- exploded - the group will be exploded into separate entities (`group.living_area_lights` in the example below). These sorts of Home Assistant entity groups get added beneath `groups:`).

```
        - name: Lights
          entities:
             - light.kitchen
             - group.pantry_lights
          groups:
             - group.living_area_lights
```

In addition to monitoring your entities in real time, you can also trigger actions when your entities are clicked. Below is an example of such an action. Whenever one of the lights in the group is clicked, an action is triggered that calls the Home Assistant 'toggle' service. See the [appendix](#triggering-actions) for more information.

```
        - name: Lights
          entities:
             - light.kitchen
             - group.pantry_lights
          groups:
             - group.living_area_lights
          action:
            service: toggle
```

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

Below is an example of using dynamic images which are swapped out at runtime, based on the sensor's current state. In the example below, the `sensor.home_dark_sky_icon` entitiy is mapped to a `<rect>` in the SVG file with the same id (which simply acts as a placeholder). Whenever the temperature sensor changes state, the `image_template` is evaluated to determine which SVG image should be emebedded within the bounds of the `<rect>`. Also you need to make sure that the placeholder is placed directly within the svg (e.g. not in a layer in inkscape) or else the calculated coordinates will be wrong.

```
      groups:

        - name: Dark Sky Sensors
          entities:
            - sensor.home_dark_sky_icon
          image_template: '
            var imageName = "";

            switch (entity.state) {
              case "clear-day":
                imageName = "day";
                break;

              case "clear-night":
                imageName = "night";
                break;

              case "partly-cloudy-day":
                imageName = "cloudy-day-1";
                break;

              case "partly-cloudy-night":
                imageName = "cloudy-night-1";
                break;

              case "cloudy":
                imageName = "cloudy";
                break;

              case "rain":
                imageName = "rainy-1";
                break;

              case "snow":
                imageName = "snowy-1";
                break;
            }

            return "/local/custom_ui/floorplan/images/weather/" + imageName + ".svg";
            '
```

#### Switches

Below is an example of a 'Switches' group, showing how to add switches to your floorplan. The appearance of each switch is styled using the appropriate CSS class, based on its current state.

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
            domain: switch
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

#### Toggling the visibility of entities

If you'd like to control the visibility of your entities, you can create a layer in your SVG file (using the `<g>` element) that contains the entities you want show/hide, along with a button (using `<rect>`, for example) that is actually used to toggle the visiblity. Below is an example of a button `media_players_button` that toggles the visibility of all media players in the floorplan (i.e. those that are contained within the `media_players_layer` layer). The floorplan toggles between the two CSS classes whenever the button is clicked.

```
        - name: Media Players
          elements:
            - media_players_button
          action:
            domain: class
            service: toggle
            data:
              elements:
                - media_players_layer
              classes:
                - layer-visible
                - layer-hidden
              default_class: layer-hidden
```

## Appendix

### Creating a floorplan SVG file

[Inkscape](https://inkscape.org/en/develop/about-svg/) is a free application that lets you create vector images. You can make your floorplan as simple or as detailed as you want. The only requirement is that you create an element (i.e. `rect`, `path`, `text`, etc.) for each entity ( i.e. binary sensor, switch, camera, etc.) you want to display on your floorplan. Each of these elements needs to have its `id` set to the corresponding entity name in Home Assistant.

For example, below is what the SVG element looks like for a Front Hallway binary sensor. The `id` of the shape is set to the entity name `binary_sensor.front_hallway`. This allows the shape to automatically get hooked up to the right entity when the floorplan is displayed.

```html
<path id="binary_sensor.front_hallway" d="M650 396 c0 -30 4 -34 31 -40 17 -3 107 -6 200 -6 l169 0 0 40 0 40
-200 0 -200 0 0 -34z"/>
```

If you need a good source of SVG files for icons or images, you can check out the following resources :
[Material Design Icons](https://materialdesignicons.com/), [Noun Project](https://thenounproject.com/) and [Flat Icon](http://flaticon.com)

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

The settings `text_template`, `class_template`, and `action_template` allow you to inject your own expressions and code using JavaScript [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals). Within these template literals, you have full access to the entity's state object, which allows you to access other properties such as `last_changed`, `attributes.friendly_name`, etc. The full set of objects available to your template literals is shown below:

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

### Triggering actions

Within each group, you can define an `action` that triggers a call to the specified Home Assistant service when an entity is clicked. The `domain` is optional, and defaults to either the domain of the entity being clicked (for regular entities, i.e. 'light'), or to 'homeassistant' (for Home Assistant group entities).

In its simplest form, an `action` can be used to toggle an enity (or a group of entities, in the case of a Home assistant group).

```
           action:
            service: toggle
```

You can also explictly set the `domain` if you want to call a service from a particular domain.

```
          action:
            domain: homeassistant
            service: toggle
```
The ability to specify a domain means you can kick off just about any service available in Home Assistant (scripts, automations, notifcations, shell commands, TTS, etc.).

```
          action:
            domain: script
            service: sound_frontdoor_chime
```

For services that support additional data, you can include that as well. Below is an example of setting the transition and brightness when switching on a light.

```
          action:
            domain: light
            service: turn_on
            data:
              transition: 50
              brightness: 75
```

When an entity is clicked, it can actually trigger an action on another entity. The example below shows how clicking on a light triggers a different light to be switched on, by supplying the other's light's `entity_id` as part of the action.

```
          action:
            domain: light
            service: turn_on
            data:
              entity_id: light.some_other_light
              transition: 50
              brightness: 75
```

For more flexibility, you can use the `data_template` to dynamically generate data required for your `action`. The example below shows how a JSON object is dynamically created and populated with data. Thanks to template literals, you can inject code to evaluate expressions at runtime. Just for the purposes of illustration, the example shows the use of the JavaScript Math.min() function being used in conjunction with another entity's current state.

 ```
          action:
            domain: light
            service: turn_on
            data_template: '
              {
                "entity_id": "light.some_other_light",
                "brightness": ${Math.min(entities["zone.home"].attributes.radius, 50)}
              }
              '
 ```

## Troubleshooting

First of all, check the indentation of the floorplan config. All the examples above show the correct level of indentantion, so make sure that's done before proceedeing further.

The recommended web browser to use is Google Chrome. Pressing F12 displays the Developer Tools. When you press F5 to reload your floorplan page, the Console pane will show any errors that may have occurred. Also check the Network tab to see if any of the scripts failed to load. Ad-blockers have been known to prevent some scripts from loading.

If you're not seeing latest changes that you've made, try clearing the web browser cache. This can also be done in the Chrome Developer Tools. Select the Network tab, right click and select Clear browser cache.

If you're not able to access the floorplan in your web browswer at all, it could be that you've been locked out of Home Assistant due to too many failed login attempts. Check the file `ip_bans.yaml` in the root Home Assistant config directory and remove your IP address if it's in there.

If you encounter any issues with your entities not appearing, or not correctly showing state changes, firstly make sure that `warnings:` is added to your floorplan config. It will report any SVG elements that are missing, misspelt, etc.

If you're adding your own CSS classes for styling your entities, make sure you escape the dot character in the id, by prefixing it with a backlash:

```
#light\.hallway:hover {
}
```

## Resources

Check out Patrik's tutorial on [how to create a custom floorplan SVG](own-floorplan-svg-file-tutorial.md)

## More information

For discussions and more information, check out the [thread](https://community.home-assistant.io/t/floorplan-for-home-assistant) on the Home Assistant forums.
