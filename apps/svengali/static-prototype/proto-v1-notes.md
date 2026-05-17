# Prototype v1 notes

the tabs should be included with the RPG box panel

the menu buttons should be in their own rpg box panel and centered just below the top of the page, not locked to the top of the page.

## template editor - image properties

layers should be a dropdown as there may be over a dozen

Show the actual image properties as specified in plan-v6. Opacity is not one of the properties

Where are the frame properties?

Where are the layer controls?

Don't separate inputs into sections

## template editor - text properties

Where are the frame properties?

Where are the layer controls?

Don't separate inputs into sections

## Data management

This is all wrong. Bares no resemblance to plan-v6 or any previous design

inside the RPG box panel should be a two-column layout with a card display on the right.

`static-ui-proto` was more correct

## Schema management

inside the rpg box should be a two-column layout with the list of columns on the right as a bulleted list

Column Id should be under Column Label, not Column Type 

Add button should be bootstrap success, not bootstrap info

`static-ui-proto` was more correct

## Image management 

Where are the column headers?

Where are the columns from the specification?

Why is there a dimensions column?

`static-ui-proto` was more correct

## Font Pool

inside the RPG box panel should be a two-column layout with display of selected fonts on the left on the right.

Preview text should be a part of each font button

This panel is the **only** exception to the local custom styles rule, as each button should be in the font in that button.

`static-ui-proto` was more correct

## Modals

Let's center the modals in the prototype

### Create New Template 

"Choose card orientation ... " text is too dark

Modal should only be as wide as it needs to be, not the full page

model cards on buttons should be fully white, not just outline, and they should be about twice as big

### Alert & Confirm

buttons should be aligned to the right

### Download options

Where did this come from?

### Load File 

doesnt need to be it's own modal. Clicking the load button will open the standard file load dialog

### Print Preview

Not a modal. the Printable version will open as a separate tab

### Fill Image View

Over-engineered. No need for a header or close button. Modal will close when clicked away from or when `esc` is pressed.