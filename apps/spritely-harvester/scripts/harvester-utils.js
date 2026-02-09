namespace("sp.spritely-harvester.HarvesterUtils", {
  "sp.common.Colors": "Colors",
  "sp.common.GridUtilities": "Grid",
}, ({ Colors, Grid }) => {
  const dims = [ 16, 32, 48 ];
  const drawImage = function(ctx, image, rows, columns) {
    const { width, height } = image;
    const offset = { y: 0, x: 0 };
    const dim = {
      width: columns,
      height: rows
    }
    if ((width/height) < (columns/rows)) {
      dim.width = (width*rows/height);
      offset.x = Math.floor((columns - dim.width)/2);

    } else if((width/height) > (columns/rows)) {
      dim.height = (columns*height/width)
      offset.y = Math.floor((rows - dim.height)/2);
    } 
    ctx.drawImage(image, 0, 0, width, height, offset.x, offset.y, dim.width, dim.height);
  }
  const getImageData = function(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const newPixels = {};
    const newPalette = {};
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha > 0) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const hex = Colors.hexFromRGB(red, green, blue);
        const pixelIndex = Math.floor(i/4);
        const col = pixelIndex % canvas.width;
        const row = Math.floor(pixelIndex/canvas.width);
        const coord = Grid.getCoordinateId(col, row);
        newPixels[coord] = hex;
        newPalette[hex] = (newPalette[hex] || []).concat([coord]);
      }
    }
    const colorsByCount = Object.entries(newPalette).map(([hex,coords]) => { 
      return { hex, count: coords.length }; 
    });
    colorsByCount.sort((a,b) => b.count - a.count);
    const palette = colorsByCount.map(({ hex }) => hex);
    Object.keys(newPixels).forEach((coord) => {
      newPixels[coord] = palette.indexOf(newPixels[coord]);
    });
    return { pixels: newPixels, palette };
  }
  const pixelizeImage = function(imageUrl, size, callback) {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      drawImage(context, image, size, size);
      const spec = getImageData(canvas, context);
      spec.size = size;
      const dataURL = canvas.toDataURL();
      callback({ dataURL, spec });
    }
    image.src = imageUrl;
  }
  const colorDistance = (rgbI,rgbJ) => ["red", "green", "blue"].reduce((sum, color) => sum + Math.pow(rgbI[color] - rgbJ[color], 2), 0);
  const colorDistanceAvg = (rgbI,rgbJ) => ["red", "green", "blue"].reduce((sum, color) => sum + (rgbI[color] - rgbJ[color]), 0)/3;
  const initCondense = function({ palette, pixels, size }, toPalette) {
    const paletteWithCounts = Object.values(pixels).reduce((acc, pixel) => {
      const hex = palette[pixel];
      acc[hex] = (acc[hex] || 0) + 1;
      return acc;
    }, {});
    const { mapping, newPaletteSet } = palette.reduce(({ mapping, newPaletteSet }, oldColor) => {
      const oldRGB = Colors.rgbFromHex(oldColor);
      const { toColor } = toPalette.reduce(({ toColor, average, distance }, newColor) => {
        const newRGB = Colors.rgbFromHex(newColor);
        const newDistance = colorDistance(oldRGB, newRGB);
        const newAverage = colorDistanceAvg(oldRGB, newRGB)
        if (isNaN(distance) || distance > newDistance || (distance == newDistance && average > newAverage)) {
          return {
            toColor: newColor,
            average: newAverage,
            distance: newDistance
          }
        } else {
          return { toColor, average, distance };
        }
      }, {});
      mapping[oldColor] = toColor;
      newPaletteSet[toColor] = true;
      return { mapping, newPaletteSet };
    }, { mapping: {}, newPaletteSet: {} });
    const newPalette = Object.keys(newPaletteSet);
    const sortedOld = Array.from(palette);
    sortedOld.sort();
    const sortedNew = Array.from(newPalette);
    sortedNew.sort();
    if (sortedOld.join() == sortedNew.join()) {
      throw "No change";
    }
    const indexMapping = newPalette.map((color,i) => [color,i]).reduce((acc, [color, i]) => {
      acc[color] = i;
      return acc;
    }, {});
    const newPixels = Object.entries(pixels).reduce((acc, [coord, oldIndex]) => {
      const oldColor = palette[oldIndex];
      const newColor = mapping[oldColor];
      const newIndex = indexMapping[newColor];
      acc[coord] = newIndex;
      return acc;
    }, {});
    return {
      pixels: newPixels,
      palette: newPalette,
      size
    };
  }
  return { pixelizeImage, initCondense };
});