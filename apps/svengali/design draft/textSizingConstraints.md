# Text Sizing Constraints

When the user creates a text layer, will need to provide them certain constraints prevent the layer from being too small or from overflowing the card.
But my current concern is that the remains large enough to be read when printed. Therefore, we need to ensure minimum font of 7pt. Anytime the user changes the size of the text layer, we need to calculate the maximum word length and the maximum number of rows in that block and then display that information in the UI. The you I should not be able to let the user reduce the size of the box to be so small that even a single character will not fit in the box.

Once dimensions of the box have been set then the maximum number of characters for that box is also set and that constraint should be applied to either the raw value of the text or to the column in the data table that is populating it. We also need to add a metadata field to the text layer model and UI to allow the user to set a maximum font size. This maximum font size will have to be a minimum of seven point, which is of course our minimum readable font and a maximum of whatever the calculated maximum for the box is (that maximum will need to be calculated based on a single row of characters and a single w. Maximum font size will only become a necessary field if the text or the layer is being populated from the table, and the maximum font size should be a a raw value only field and not columnable.

We also want to limit the text input for the text panel to keyboard characters only. That's uppercase letters, lowercase letters numbers, punctuation spaces, tabs carriage returns new lines. 

Future features will include internationalization and markdown

We should also create a mapping for each character in the character set to its its relative width - that is the width of a given character as a ratio to the font height. This should make it easier to pre-calculate the text layout instead of post calculating it based on searching for the right size.

Finally, before attempting to implement the usage of a given text sizing algorithm, we want to create a demonstration. This demonstration should be a series of tests of varying amounts of text (use the " Lorem ipsum ..." text ) a variety of sizes of text boxes within the bounds of a card. The generation of the text and the generation of the box should be completely agnostic to each other. In other words, have no awareness of each other. Create a set of boxes. Create a set of texts, then permeate over the combination of the two and illustrates the use of each sizing algorithm, looking at time to complete as well as accuracy. Let's build this demonstration in a separate subfolder of the project as an HTML page.
