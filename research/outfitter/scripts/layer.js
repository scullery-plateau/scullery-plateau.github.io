namespace('sp.outfitter.LayerSVG',{},() => {
  return function({ layer }) {
    return <svg viewBox={`0 0 ${layer.width} ${layer.height}`}>
      <g transform={`matrix(1,0,0,1,${layer.xOff},${layer.yOff})`}
         dangerouslySetInnerHTML={{__html: layer.paths}}></g>
      <defs dangerouslySetInnerHTML={{__html: layer.defs}}></defs>
    </svg>;
  }
});