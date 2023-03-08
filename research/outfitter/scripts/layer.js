namespace('sp.outfitter.LayerSVG',{},() => {
  const getLayerMinMax = function(layer) {
    return {
      min:[0-layer.xOff,0-layer.yOff],
      max:[layer.width-layer.xOff,layer.height-layer.yOff]
    }
  }
  const LayerSVG = function({ layer, imageIndex, isSelected, onClick }) {
    const {min:[minX,minY],max:[maxX,maxY]} = getLayerMinMax(layer);
    const [width, height] = [maxX-minX,maxY-minY]
    return (<div className="rpg-box m-2 p-2 d-flex flex-column">
      <p>{imageIndex}</p>
      <button className={`btn layer ${isSelected()?"btn-outline-success border-5" : ""}`} onClick={onClick}>
        <svg viewBox={`${minX} ${minY} ${width} ${height}`}>
          <rect x={minX} y={minY} width={width} height={height} fill="#ffff00"/>
          <g id={layer.id}
             fill="#0000ff"
             stroke="#ff0000"
             dangerouslySetInnerHTML={{__html: layer.paths}}></g>
          <defs dangerouslySetInnerHTML={{__html: layer.defs}}></defs>
        </svg>
      </button>
    </div>);
  }
  LayerSVG.getLayerMinMax = getLayerMinMax;
  return LayerSVG;
});