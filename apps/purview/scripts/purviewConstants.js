namespace('sp.purview.Constants',{"sp.common.Utilities":"util"},({util}) => {
  const spriteTransforms = {
    turnLeft: ((squareSize, { r, c, cols, rows }) => `rotate(-90, ${ squareSize * ( c + (cols / 2)) }, ${ squareSize * ( r + (rows / 2)) })`),
    turnRight: ((squareSize, { r, c, cols, rows }) => `rotate(90, ${ squareSize * ( c + (cols / 2)) }, ${ squareSize * ( r + (rows / 2)) })`),
    flipDown: ((squareSize, { r, rows }) => `matrix(1 0 0 -1 0 ${ squareSize * ((r * 2) + rows) })`),
    flipOver: ((squareSize, { c, cols }) => `matrix(-1 0 0 1 ${ squareSize * ((c * 2) + cols) } 0)`),
  };
  const Constants = util.buildImmutable({
    maxSquareCount: 10000,
  });
  Constants.getSpriteTransform = function(transforms) {
    transforms = transforms || '';
    const keys = Object.keys(spriteTransforms).filter((key) => transforms.indexOf(key)>=0);
    return (squareSize, sprite) => {
      return keys.map((key) => spriteTransforms[key](squareSize, sprite)).join(" ")
    }
  }
  return Constants;
});