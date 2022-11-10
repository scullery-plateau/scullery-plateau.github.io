namespace('sp.spritely.SpritelyUtil', () => {
  const getPaletteId = function (index) {
    return 'palette' + index;
  };
  const getPaletteButtonId = function (index) {
    return 'paletteBtn' + index;
  };
  const radix = 32;
  const getPixelId = function (x, y) {
    return [x, y].map((i) => i.toString(radix).toUpperCase()).join('x');
  };
  const parsePixelId = function (id) {
    let [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y };
  };
  return { getPaletteId, getPaletteButtonId, getPixelId, parsePixelId };
});
