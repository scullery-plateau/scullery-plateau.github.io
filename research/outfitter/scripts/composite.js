namespace('sp.outfitter.Composite',{},() => {
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
    const accFields = ['width','height','xOff','yOff','defs'];
    const acc = layers.reduce((out, [layerName, layer]) => {
      return accFields.reduce((result,field) => {
        result[field].push(layer[field]);
        return result;
      }, out);
    }, accFields.reduce((out,field) => {
      out[field] = [];
      return out;
    }, {}));
    acc.defs = acc.defs.join('');
    ['width','height','xOff','yOff'].forEach((field) => {
      acc[field] = Math.max.apply(null, acc[field]);
    })
    const { width, height, xOff, yOff, defs } = acc;
    return <div className="rpg-box m-2 p-2 d-flex flex-column">
      <p>{record.part}</p>
      <button className="btn layer" onClick={() => {}}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <rect width={width} height={height} fill="#ffffff" stroke="#000000" strokeWidth={2}/>
          { layers.map(([layerName, { paths }]) => {
            return <g transform={`matrix(1,0,0,1,${xOff},${yOff})`}
                      dangerouslySetInnerHTML={{__html: paths.replaceAll("#000000",colors[layerName])}}></g>
          }) }
          <defs dangerouslySetInnerHTML={{__html: defs}}></defs>
        </svg>
      </button>
    </div>;
  }
});