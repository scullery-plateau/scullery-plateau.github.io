namespace("sp.spritely-harvester.HarvesterUtils", {
  "sp.common.Colors": "Colors",
  "sp.common.GridUtilities": "Grid"
}, ({ Colors, Grid }) => {
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