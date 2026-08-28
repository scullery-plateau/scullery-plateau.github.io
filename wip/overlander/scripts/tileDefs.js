namespace('sp.overlander.TileDefs',{},() => {
  return function({ tiles }) {
    return <svg key="tiledefs" width={0} height={0}>
      <defs>
        { tiles.map((tile) => tile.drawDef()) }
      </defs>
    </svg>;
  }
});
