namespace("sp.spritely-harvester.HarvesterUtils", {
  "sp.common.CanvasUtils": "CanvasUtils",
  "sp.common.Colors": "Colors",
  "sp.common.GridUtilities": "Grid",
  "sp.common.Utilities": "utils",
}, ({ CanvasUtils, Colors, Grid, utils }) => {
  const dims = [ 16, 32, 48 ]
  const shrinkImage = function(imageUrl, dimSize, callback) {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dimSize;
      canvas.height = dimSize;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, dimSize, dimSize);
      const pixels = imageData.data;
      const newPixels = {};
      const newPalette = {};
      for (let i = 0; i < pixels.length; i += 4) {
        const pixelIndex = Math.floor(i/4);
        const col = pixelIndex % canvas.width;
        const row = Math.floor(pixelIndex/canvas.width);
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const hex = Colors.hexFromRgb(red, green, blue);
        const coord = Grid.getCoordinateId(col, row);
        newPixels[coord] = hex;
        newPalette[hex] = (newPalette[hex] || []).concat([coord]);
      }
      callback({ newPixels, newPalette });
    };
    image.src = imageSrc;
  };
  const condensePalette = function(paletteWithCounts) {
    palette = Object.keys(paletteWithCounts);
    palette.sort();
    const distances = {};
    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const rgbI = Colors.rgbFromHex(palette[i]);
        const rgbJ = Colors.rgbFromHex(palette[j]);
        distances[`${palette[i]}x${palette[j]}`] = ["red", "green", "blue"].reduce((sum, color) => sum + Math.pow(rgbI[color] - rgbJ[color], 2), 0);
      }
    }
    const distanceValues = Object.values(distances);
    distanceValues.sort();
    const shortest = distanceValues[0];
    const nearestColors = Object.entries(distances).filter(([_,distance]) => distance == shortest).reduce((acc,[pair]) => {
      var [i, j] = pair.split("x");
      acc[i] = (acc[i] || []).concat([pair.replace(acc[i],"").replace("x", "")]);
      acc[j] = (acc[j] || []).concat([pair.replace(acc[j],"").replace("x", "")]);
      return acc;
    }, {});
    const pairCounts = Object.values(nearestColors).map((pairs) => pairs.length);
    pairCounts.sort();
    const highestCount = pairCounts[pairCounts.length - 1];
    const inverseMap = Object.entries(nearestColors).filter(([_, adjacentColors]) => adjacentColors.length == highestCount).reduce((acc, [color, adjacentColors]) => {
      return adjacentColors.reduce((outval, adjacentColor) => {
        outval[adjacentColor] = (outval[adjacentColor] || {});
        outval[adjacentColor][color] = paletteWithCounts[color];
        return outval;
      }, acc);
    }, {});
    return Object.entries(inverseMap).reduce((acc, [adjacentColor, targetMap]) => {
      const targetColors = Object.keys(targetMap);
      if (targetColors.length == 1) {
        return targetColors[0];
      } else {
        const pixelCounts = Object.values(targetMap);
        pixelCounts.sort();
        const maxCount = pixelCounts[pixelCounts.length - 1];
        return Object.entries(targetMap).filter(([_, pixelCount]) => pixelCount == pixelCounts).map(([targetColor]) => targetColor)[0];
      }
    }, {});
  };
  const extractPixelsFromCanvas = function(imageSrc, callback) {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const newPixels = "?".repeat(canvas.height).split("").map(_ => "?".repeat(canvas.width).split("").map(_ => {
        return {};
      }));
      const newPalette = {};

      for (let i = 0; i < pixels.length; i += 4) {
        const pixelIndex = Math.floor(i/4);
        const col = pixelIndex % canvas.width;
        const row = Math.floor(pixelIndex/canvas.width);
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const hex = Colors.hexFromRgb(red, green, blue);
        const coord = Grid.getCoordinateId(col, row);
        newPixels[row][col] = hex;
        newPalette[hex] = (newPalette[hex] || []).concat([coord]);
      }
      callback(newPixels, newPalette);
    };
  };
  return { extractPixelsFromCanvas };
});