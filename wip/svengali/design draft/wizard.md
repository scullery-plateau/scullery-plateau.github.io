# Svengali Wizard

The next phase of svengali is to create a wizard app that will present the user with a sequential file loader. This will instruct the user to first load their layout file. Once the layout file has been validated and processed, the wizard will then generate a json schema for the data file based on the property bindings in the layout.

Once the user loads their data file or multiple data files if they so choose, Svengali will then validate the data file against the generated json schema, and review the data for any references to external resources, namely icons.

The wizard will then display for the user a list of those icons referenced by the data so that the user will know which icons to load. The wizard will also display a file load button for the user to load as many icon map files as are needed.

Once all of the icons have been accounted for, no, the wizard will present the user with a publish button.
