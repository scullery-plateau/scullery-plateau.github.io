# Harvester Notes

Let's make the following additions to the harvester:

* for each character, create a "calculatedWidth" as "Math.max(actualWidth, Math.ceil(width))", then, for each size, calculate the average "calculatedWidth" and the max "calculatedWidth"
* for each size, calculate the max "ascent" and the max "descent", and then add the two together to give the "maxHeight"
* let's flag any font size for any font where the max height is greater than the font size.

once completed, lets create a document with a table for each font with the following columns: "Font Size", "Max Height", "Average Width", "Max Width"