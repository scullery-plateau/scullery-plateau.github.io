## "Add New" feature / behavior

Across the whole of the app, there are a number of situations where we might be presenting the user with a list of options that may be empty:
  * Font Pool
  * Images
  * Columns

I want to develop a pattern where, if the list of options is empty, the user is instead presented with a control (maybe a button, maybe a single option in the dropdown) to "Add New". If this is engaged (button clicked, option chosen), a modal would then open up providing the user with the interactions necessary to reach the desired state.
  * The desired font is added to both the pool and the template field or data row they were attempting to populate.
  * The desired image has been loaded and is referrenced by the template field or data row they were attempting to populate.
  * A column of the appropriate type and given label and metadata is added to the schema after the user has chosen how best to populate the table:
    * use the current raw value of the field being toggled as a default value, or give a specific default value.

