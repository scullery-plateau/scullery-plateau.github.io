namespace('sp.outfitter.Composite',{
  'sp.outfitter.LayerSVG':'LayerSVG'
},({ LayerSVG }) => {
  const colorPattern = new RegExp("#[0-9a-fA-F]{6}")
  return function({ metadata, record, colors }) {
    const layers = ['base','detail','outline'].map((layerName) => {
      return [layerName,record[layerName]];
    }).filter(([layerName, index]) => {
      return index && index.length > 0;
    }).map(([layerName, index]) => {
      return [layerName, metadata[index]];
    }).filter(([layerName, layer]) => {
      return layer;
    });
    const accFields = {
      minX:(arr) => Math.min.apply(null,arr),
      minY:(arr) => Math.min.apply(null,arr),
      maxX:(arr) => Math.max.apply(null,arr),
      maxY:(arr) => Math.max.apply(null,arr),
      defs:(arr) => arr.join('')
    }
    const acc = layers.reduce((out, [layerName, layer]) => {
      const {min:[minX,minY],max:[maxX,maxY]} = LayerSVG.getLayerMinMax(layer);
      const args = {minX,minY,maxX,maxY,defs:layer.defs};
      return Object.keys(accFields).reduce((result,field) => {
        result[field].push(args[field]);
        return result;
      }, out);
    }, Object.keys(accFields).reduce((out,field) => {
      out[field] = [];
      return out;
    }, {}));
    Object.entries(accFields).forEach(([field,accFn]) => {
      acc[field] = accFn(acc[field]);
    })
    const { minX, maxX, minY, maxY, defs } = acc;
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
});