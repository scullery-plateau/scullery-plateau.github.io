namespace("sp.cobblestone.CobblestoneUtil",{},() => {
  const radix = 32;
  const getCoordinateId = ((x, y) => [x, y].map((i) => i.toString(radix).toUpperCase()).join('x'));
  const parseCoordinateId = function (id) {
    const [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y };
  };
  const tileDim = 30
  const getTileDim = (() => tileDim);
  const getEmptyCellId = (() => 'emptyCell');
  const tileTransforms = {
    flipDown: `matrix(1 0 0 -1 0 ${tileDim})`,
    flipOver: `matrix(-1 0 0 1 ${tileDim} 0)`,
    turnLeft: `rotate(-90,${tileDim / 2},${tileDim / 2})`,
    turnRight: `rotate(90,${tileDim / 2},${tileDim / 2})`,
  };
  const getTileTransform = ((tf) => tileTransforms[tf]);
  const getWidth = ((size, orientation) => (orientation === 'portrait')?size.min:size.max);
  const getHeight = ((size, orientation) => (orientation === 'portrait')?size.max:size.min);
  return { getCoordinateId, parseCoordinateId, getTileDim, getEmptyCellId,
    getTileTransform, getWidth, getHeight
  };
});