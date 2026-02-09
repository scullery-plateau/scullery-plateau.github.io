namespace('sp.spritely-harvester.SpritelyDisplay', {
  'sp.spritely-harvester.Constants': 'Constants,',
  "sp.common.GridUtilities": "Grid",
  'sp.common.Utilities': 'Utilities',
}, ({ Constants, Grid, Utilities }) => {
  const drawRect = function ({ palette, pixels }, color, id, x, y) {
    const pixelId = Grid.getCoordinateId(x, y);
    const pixel = pixels[pixelId];
    const color = isNaN(pixel)?`url(#${Constants.clearedPixelId()})`:`${palette[pixel]}`;
    return (
      <rect
        key={id}
        id={id}
        x={x * Constants.pixelDim()}
        y={y * Constants.pixelDim()}
        width={Constants.pixelDim()}
        height={Constants.pixelDim()}
        strokeWidth="1"
        stroke="black"
        fill={color}
      />
    );
  };
  return function(props) {
    return <svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet"
          viewBox={`0 0 ${props.spec.size * Constants.pixelDim()} ${props.spec.size * Constants.pixelDim()}`}>
      { Utilities.range(props.spec.size).map((y) => {
        return Utilities.range(props.spec.size).map((x) => {
          return drawRect(props.spec, color, pixelId, x, y);
        });
      })}
    </svg>
  }
});