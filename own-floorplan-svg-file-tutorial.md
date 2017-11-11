# Creating your own custom floorplan-file from scratch #

This is a short guide to creating your own floorplan-file, based on your own home.

Recommended resources:
- [Inkscape](https://inkscape.org/en/) for editing your floorplan
- [the Noun Project](https://thenounproject.com/) for neat looking custom icons

## 1. Get started
Download, install and open [Inkscape](https://inkscape.org/en/).

_(Note: Inkscape runs on [XQuartz](http://xquartz.macosforge.org/).  If you are running OSX and you do not yet have this installed, you will need it. **There is a bug that affects Inkscape in dual monitor environments**  If your displays are side by side with the primary display on the left, you should be ok.  If you stack your monitors on top of each other, Inkscape will be running, but you won't see the window as it will be positioned off-screen.  Adjust your display position settings so the primary display is on the left and you'll see the Inkscape window.  There is an app called [Stay](https://cordlessdog.com/stay/) that will record and store various display layouts that you can quickly switch between.)_

## 1.1 Set the size of the work area
I've set the size of my floorplan-file to match the resolution of a full-screen iPad Air (1024x768).
- Click File > Document Properties
- Ensure the top right corner says "px" as display units. There is another one under "Custom size" that should also read "px".
- Set the width and height of Orientation/custom size to 1024 by 768.
- Make sure scale = 1
- Set view box x, y, width and height to: 0, 0, 1024, 768.
- Close the document properties and save the file as floorplan.svg

![floorplan](https://github.com/ggravlingen/ha-floorplan/blob/master/tutorial_images/workearea_size.PNG)


## 1.2 Draw your building
Start drawing your house/apartment using rectangles. Add two placeholders for lights using the circle tool (or download and insert more classy looking ones from the Noun Project). Also add a text string that we will be using for showing the temperature. These steps have been taken in the image below.

![floorplan](https://github.com/ggravlingen/ha-floorplan/blob/master/tutorial_images/simple_plan.PNG)

## 1.3 Link the items to entities in Home Assistant
To link an object in the floorplan-file to Home Assistant, you first set its object id to the name of the entity in Home Assistant. There are two lights: ```light.hall_1``` and ```light.hall_2``` as well as a temperature sensor ```sensor.forecastio_apparent_temperature```.
- To link an entity, right click one of the circles and select "Object properties". You will see something along "ID: xzyy3212".
- Set the ID to light.hall_1 as shown in the image below. Click "Set".
- Click outside of the circle and click inside it again and make sure Inkscape hasn't added "_" to the end of the ID.
- Do the same for the other light and also with the text.

![floorplan](https://github.com/ggravlingen/ha-floorplan/blob/master/tutorial_images/object_properties.PNG)

## 1.4 Add the necessary config to your floorplan.yaml-file
Add the following lines to your floorplan.yaml file:

```
    - name: temp_forecastio
      entities:
        - sensor.forecastio_apparent_temperature
      text_template: '${entity.state ? Math.ceil(entity.state) + "°": "undefined"}'
      class_template: 'return "static-temp";'

  - name: Lights
    entities:
      - light.hall_1
      - light.hall_2
    states:
      - state: 'on'
        class: 'light-on'
      - state: 'off'
        class: 'light-off'
```

## 1.5 Upload your floorplan
Upload and overwrite the floorplan.svg file with your own, customized, file.

## 1.6 Restart Home Assistant
You need to do this in order to pick up the changes you made to the floorplan.yaml-file.
