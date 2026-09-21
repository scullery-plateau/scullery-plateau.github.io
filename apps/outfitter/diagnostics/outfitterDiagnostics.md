# Outfitter Dignostics

There are some issues with both patterns and shading being misaligned. To that end, we need to create a manual diagnostic application.

Using the existing SVG rendering for outfitter, we need a separate web app that will allow me to select data set just as you do with outfitter, but then we'll load not only the data set but also a pre-configured diagnostic layer set specifically created for diagnosing these issues. The interface will provide to the user controls to select a background pattern and adjust the x and y position of the pattern. The interface will also allow the user to toggle on and off a black outline around the body of the pattern. It will allow the user to toggle on and off whether or not the pattern repeats itself and it will allow the user to toggle on and off a large. Let's say 20 pixel diameter Red dot Positioned at the origin position of the pattern.

The application should track the position adjustment data for each pattern and allow the user to download that data.

We should be following all standard structural conventions that exist with its gallery plateau, but let's put all of this in the outfitter/diagnostics folder.
