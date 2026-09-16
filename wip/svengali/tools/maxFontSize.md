# Max Font Size Algorithm

## The "Paragraph" Problem

We have a layout and we have a data table to populate that layout. That data table may contain paragraph data. But rendering that paragraph in SVG is difficult because that paragraph data will vary in size from row to row, which means the cards that we render using the layout need to calculate the number of rows, carriage return position, and font size for each card being rendered.

However, to make the process more efficient, we need an algorithm to give us a maximum font size.

```
(frameWidth, frameHeight, characterCount, fontRatio)

frameArea = frameWidth * frameHeight

initialMaxRowHeight = frameArea / (characterCount * fontRatio)

rowCount = Math.ceil(frameHeight / initialMaxRowHeight) + 1 // adding 1 for overflow

maxFontSize = frameHeight / rowCount

```

this will allow us to iterate down thru font sizes to find one that will fit our layout

```
(frameWidth, frameHeight, paragraph, fontRatio, fontSize)

avgCharWidth = fontSize/fontRatio

maxCharsPerRow = Math.floor(frameWidth / avgCharWidth)

totalMaxChars = maxCharsPerRow * rowCount

// totalMaxChars must be greater than paragraph.length

```

Then we need to break the paragraph up into rows, each with a trim length less than or equal to the "maxCharsPerRow", but only breaking at "\s" characters.
