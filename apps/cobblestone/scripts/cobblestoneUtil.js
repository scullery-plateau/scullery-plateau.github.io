namespace("sp.cobblestone.CobblestoneUtil",{},() => {
  const radix = 32;
  const getCoordinateId = function (x, y) {
    return [x, y].map((i) => i.toString(radix).toUpperCase()).join('x');
  };
  const parseCoordinateId = function (id) {
    let [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y };
  };
  return { getCoordinateId, parseCoordinateId };
});