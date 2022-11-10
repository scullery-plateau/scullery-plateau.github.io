namespace('sp.spritely.Constants', () => {
  const constants = {
    bgColorPixelId: 'bgColorPixel',
    clearedPixelId: 'clearedPixel',
    defaultColor: '#999999',
    defaultFilename: 'spritely',
    pixelDim: 10,
  };
  return Object.entries(constants).reduce((out, [k, v]) => {
    out[k] = () => v;
    return out;
  }, {});
});
