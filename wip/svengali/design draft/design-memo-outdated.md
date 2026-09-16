Step 1 confirm object model

Svengali templates are made up of a  series of layers. Each layer is a frame. Every frame has an x coordinate a y coordinate a width and a height. There are three kinds of frames. Simple frames merely have a background color and an outline color and a corner radius. Text frames have a body of text in markdown along with a font size and font family. Image frames have an image body along with and x coordinate o y coordinate a width and a height. The XY width height of an image frame is separate from the standard frame XY width height. The frame width height describes part of the image is being cropped. The order of the layers starts with the furthest back or bottom layer and ends with the foremost or top layer. Each property in the data model can be linked to a given column in the data table whose data type matches that property. Those data types are as follows: number, markdown, image file, font size, font family. Each data type has its own validation font size and font family are both enum sets, markdown is plain text, and image file is a name of a file that exists in the the list of loaded images. Number is the most obvious and has no constraints.

Templates also contain a single additional property outside of the list of layers: that of orientation which can be either landscape or portrait (see Printer)

Step 1A design image list UI 

The image list modal contains a scrollable table with four columns. It will display a list of all file names, both of images that have been loaded and images that appear in the data table. First column of the image table is the file name. The second column is whether or not that image has been loaded. Third column is whether or not that file name appears in the data table and the fourth column is whether or not the file name appears in the template. This way we can see which loaded images have not been used as well as which file names in the data file have not been loaded. As an added note, images can only be used by the template if they've already been loaded. The image model will also have a button at the top center to load more images along with two buttons at the bottom right : update and cancel. If update is pressed then any files that were added when the modal was open will added to the current state of the application. If cancel is pressed then no new files will be added to the current state of the application

Step 2 design template interface POC

Template interface design should more or less match the design of outfitter as the principles are somewhat similar. Well actually being more simple. The layer controls should be mostly identical to that of outfitter being able to change the order of layers and add new ones and remove existing ones should be copied over from outfitter. New layers will default to a simple layer with a drop down giving the user the option to change layer types. The standard frame properties will always appear below the layer controls with the type option appearing below that. Below the type option will be the type specific properties: font size, font, family, and image will all be drop downs containing the possible values and the markdown of the text frame will be a text area. The header for each property will also contain a toggling link of two words fixed and data fixed being the default it's selected. If data is selected then the field input is swapped out for a drop down listing the appropriate columns in the data table. The link will only be available if the data table has appropriate columns. 

The form of the template will take up the left half of the screen while the display of the card image appear on the other half. Clicking on any particular layer will select that layer in the layer dropdown. Right clicking the card will download the image.

Step 3 implement for single card 

Step 4 add download of card as image

Step 5 add upload and download Of the template

Step 6 design printer layout

Cards can be oriented as either portrait or landscape but the card layout is constant. Cards are a ratio of 2 and 1/2 in to 3 and 1/2 in when printed. Landscape cards are laid out on a sheet of letter paper oriented in a portrait orientation. The cards themselves are laid out in four rows of two, making it eight cards per sheet. Rotate the cards. You rotate the sheet and the layout: portrait cards are there for laid out on a sheet of letter paper in the landscape orientation and our two rows of four cards each. 

When printing cards from a data table, one copy of each card will be added to the layout. More than eight cards means more than one page. 

When printing a single card, that card will be done on page in all eight slots making for a single page of eight copies of the exact same card

Step 7 design data table interface 

Step 8 add download and upload of data table as CSV

Step 9 design ability to substitute template Fields with table values

Step 10 add bulk download of cards as images 