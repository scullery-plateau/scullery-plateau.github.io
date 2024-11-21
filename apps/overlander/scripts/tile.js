namespace("sp.overlander.Tile",{
  'sp.common.Utilities':'util'
},({ util }) => {
  const columnWidth = 75;
  const tileHeight = 86.6;
  const extraWidth = 25;
  const tileWidth = columnWidth + extraWidth;
  const columnOffset = 43.3
  const hexPoints = [[25, 0], [75, 0], [100, 43.3], [75, 86.6], [25, 86.6], [0, 43.3]];
  const tileFields = [ "imageURL", "filename", "frameColor", "backgroundColor", "scale", "xOffset", "yOffset", "label" ];
  const Tile = function(filename, imageURL, baseImage) {
    const baseData = {
      imageURL,
      filename,
      frameColor: '#000000',
      backgroundColor: undefined,
      scale: 1,
      xOffset: 0,
      yOffset: 0,
      label: ""
    };
    // todo
    this.drawDef = function() {
      // todo
      return <></>;
    }
    this.update = function(field,value) {
      const updates = {};
      if (typeof field === 'object') {
        tileFields.filter((f) => (f in field)).forEach((f) => {
          updates[f] = field[f];
        });
      } else {
        updates[field] = value;
      }
      Object.assign(baseData, updates);
    }
    this.copy = function() {
      const copied = new Tile(filename, imageURL, baseImage);
      copied.update(this.toJSON());
      return copied;
    }
    this.toJSON = function() {
      return baseData;
    }
  }
  Tile.loadTile = ((filename,imageURL,callback) => {
    util.initImageObj(imageURL,(baseImg) => {
      callback(new Tile(filename, imageURL, baseImg));
    })
  });
  Tile.getConstants = (() => {
    return { columnWidth, tileHeight, extraWidth, tileWidth, columnOffset };
  });
  return Tile;
});