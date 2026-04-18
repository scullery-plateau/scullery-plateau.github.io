# "Initialize Schema" wizard

When a user has a raw template (a template where all columnable fields in all layers contain raw values) and there is no established schema or data, I want to present the users with an experience allowing them to iterate through all the commonable Fields for every layer and easily select which ones to make into columns. 

Before this experience can be created. We'll need to add an input on the layer so that the user can define a human readable but unique identifier for each layer much the way they create a human readable identifier for the individual columns in the schema. 

We can then use these identifiers in our selection wizard as well as using them to generate names for the new columns in the schema. 

```
generated column name => {layer name} {layer type} {field name}
```

The way the wizard should work is this: 
  1. The user is starting from a raw template and prompts the interface for the initialize schema wizard. 
  2. The wizard opens as a modal that presents the user with a list of columnable Fields for each layer for them to select to become columns in the schema. 
  3. Once the user selects all their desired columns and clicks the "Next" button, the modal will then show the newly generated schema in the style of the display from the schema tab with generated names for each column, and and buttons labeled "confirm", "back" and "cancel". 
     1. Clicking cancel will leave the wizard. 
     2. Clicking back will return to the previous screen for column selection. 
     3. Clicking confirm will 
        1. create the schema, 
        2. take the raw values from the template to generate a first data record, 
        3. switch the appropriate Fields in the template to column and point them at the correct column. 

It will be up to the user to apply additional metadata to each column once the wizard has done its job.