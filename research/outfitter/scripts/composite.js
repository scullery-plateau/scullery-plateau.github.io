namespace('sp.outfitter.Composite',{
  'sp.outfitter.LayerSVG':'LayerSVG',
  'sp.common.Utilities': "util"
},({ LayerSVG, util }) => {
  const accFields = {
    minX:(arr) => Math.min.apply(null,arr),
    minY:(arr) => Math.min.apply(null,arr),
    maxX:(arr) => Math.max.apply(null,arr),
    maxY:(arr) => Math.max.apply(null,arr),
    defs:(arr) => arr.join('')
  }
  const accumulate = function(layers) {
    const acc = layers.reduce((out, [layerName, layer]) => {
      const {min:[minX,minY],max:[maxX,maxY]} = LayerSVG.getLayerMinMax(layer);
      const args = {minX,minY,maxX,maxY,defs:layer.defs};
      return Object.keys(accFields).reduce((result,field) => {
        result[field].push(args[field]);
        return result;
      }, out);
    }, Object.keys(accFields).reduce((out,field) => util.assoc(out, field, []), {}));
    Object.entries(accFields).forEach(([field,accFn]) => {
      acc[field] = accFn(acc[field]);
    });
    return acc;
  }
  const filterLayers = function(metadata, record) {
    return ['base','detail','outline'].map((layerName) => {
      return [layerName,record[layerName]];
    }).filter(([layerName, index]) => {
      return index && index.length > 0;
    }).map(([layerName, index]) => {
      return [layerName, metadata[index]];
    }).filter(([layerName, layer]) => {
      return layer;
    });
  }
  const Composite = function({ metadata, record, colors }) {
    const layers = filterLayers(metadata, record);
    const { minX, maxX, minY, maxY, defs } = accumulate(layers);
    const [width, height] = [maxX-minX,maxY-minY]
    return <div className="rpg-box m-2 p-2 d-flex flex-column">
      <p>{record.part}</p>
      <button className="btn layer" onClick={() => {}}>
        <svg viewBox={`${minX} ${minY} ${width} ${height}`}>
          <rect x={minX} y={minY} width={width} height={height} fill="#ffff00"/>
          { layers.map(([layerName, { id, paths }]) => {
            return <g id={ id }
                      fill={colors[layerName]}
                      stroke={colors[layerName]}
                      dangerouslySetInnerHTML={{__html: paths}}></g>
          }) }
          <defs dangerouslySetInnerHTML={{__html: defs}}></defs>
        </svg>
      </button>
    </div>;
  }
  Composite.accumulate = accumulate;
  Composite.filterLayers = filterLayers;
  return Composite;
});