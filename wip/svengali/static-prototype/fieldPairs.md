The template form is blowing out the vertical height of the page and we appear to be wasting a lot of horizontal space on each line by having a single field per line in the form. We've already reduced the vertical real estate required by having the labels and inputs on the same line, but the combination of the two is still leaving more than half the width of the form column with empty space. So let's look to double up some of the fields on each line with the following pairs: 
• Frame x and y 
• frame, width and height 
• font, family and font color 
• background color and frame color 
• image center x and y 
• image magnification and rotation 

A further note, the card body looks awfully small in the card preview column. Let's use percentages for the width and height to magnify the card, but keep to the specified width and height in the view box of 225x350 

Finally, for the options type on the schema tab, instead of inputting the options in a text area, the way that the UI is currently doing, let's break it out into more explicit UI where we have one text input per item with a delete button after it and then at the bottom of the list we have a ad option button. For this prototype, let's have four options listed for our example. 

At some point we need to review plan V6 for other explicitly called out modals,

Also need to work out the interface for toggling value and column: for this, let's do like the flip button in in outfitter or the transparent/opaque button - we'll have two colors (Let's say info and secondary). for the value mode, we will have one color for the button and the other color for the text and then for column mode we will flip the colors. 

Minor adjustment to this; instead of the full word value and column, let's have it. Use the font awesome icons for VNC and do a small button. Let's have the title and ALT have descriptive text around value and column and which is active. That way with the small single icon buttons we should still be able to double up Fields per row 
Let's put the VC button between the label and the input. Reminder that the VC button is only available when there are relevant columns available to use for that value. 