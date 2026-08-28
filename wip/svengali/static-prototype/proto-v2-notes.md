# Prototype v1 notes

## Menu bar

rpg-box for menu bar should only be as wide as it needs to be for the buttons, doesn't need to be full width of the page.

## Main panel

for this static demo, each version of the main panel (template editor, schema, data, etc), should be separate rpg box panels

## Tabs

the inactive tabs should be light on a dark background to distinguish the clickable area from the rpg box background and make them more readable

## Template Editor

separate Text or Image specific properties with a horizontal rule

Layer controls should be directly under the Layer dropdown.

Layer controls are not as specified - revisit `plan-v6` and `ui-design`

there is no `color` property - there's `Background Color` for both and `Font-color` for Text. They don't need a label, as the label text is in the button

Frame properties should be first, then Text or Image

the inputs are still **not** in-line with the labels

## Data Management

Card preview looks good, but the data entry form is still all wrong

column labels shouldn't be inputs themselves

they cant be added and removed

where is the data row dropdown?

`static-ui-proto.html` was more correct - revisit and reintegrate

## Schema Management

sample column id doesn't conform to column id specs.

Column Id is in the right place, but is too dark to read: us bootstrap info color

Inputs should be in-line with labels

lets put a little more padding between the columns

## Image Management

Column headers are still not present

still missing columns per `plan-v6`

## font pool

Shouldn't have a font preview section

Available fonts should be in the left column, a separate list of just the selected fonts on the right

each font button should include the preview text

`static-ui-proto.html` was more correct - revisit and reintegrate

## Modals

### Create New Template

example cards should be twice as big

## Alert & Confirm

These are perfect. Change nothing moving forward.

## Full Image Preview

instruction text should be Title and Alt and otherwise not present

less padding around image