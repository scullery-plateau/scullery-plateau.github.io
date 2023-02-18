namespace('sp.common.GridUtilities',{

}, ({}) => {
  const radix = 32;
  const getCoordinateId = ((x, y) => [x, y].map((i) => i.toString(radix).toUpperCase()).join('x'));
  const parseCoordinateId = function (id) {
    const [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y };
  };
  const getBlankCellId = (() => 'blankCell');
  const getEmptyCellId = (() => 'emptyCell');
  const getWidth = ((size, orientation) => (orientation === 'portrait')?size.min:size.max);
  const getHeight = ((size, orientation) => (orientation === 'portrait')?size.max:size.min);
  return { getCoordinateId, parseCoordinateId, getBlankCellId, getEmptyCellId, getWidth, getHeight };
});