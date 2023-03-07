namespace('sp.outfitter.LayerSVG',{},() => {
  return function({ layer, imageIndex, isSelected, onClick }) {
    return (<div className="rpg-box m-2 p-2 d-flex flex-column">
      <p>{imageIndex}</p>
      <button className={`btn layer ${isSelected()?"btn-outline-success border-5" : ""}`} onClick={onClick}>
        <svg viewBox={`0 0 ${layer.width} ${layer.height}`}>
          <rect width={layer.width} height={layer.height} fill="#ffff00"/>
          <g id={layer.id}
             transform={`matrix(1,0,0,1,${layer.xOff},${layer.yOff})`}
             dangerouslySetInnerHTML={{__html: layer.paths}}></g>
          <defs dangerouslySetInnerHTML={{__html: layer.defs}}></defs>
        </svg>
      </button>
    </div>);
  }
});