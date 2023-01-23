namespace('sp.outfitter.OutfitterSVG',{
  'sp.common.Point':'XY'
},({ XY }) => {
  const SCALES = {
    lanky: [0.8, 1.1],
    thin: [0.8, 1.0],
    teen: [0.9, 0.9],
    stocky: [0.9, 0.8],
    petite: [0.8, 0.8],
  };
  const TORSO_TOPS = {
    fit: 106.35,
    hulk: 169.1,
    superman: 146.9,
    woman: 93.6,
  };
  const HEAD_PARTS = {
    beard: true,
    ears: true,
    eyebrows: true,
    eyes: true,
    hair: true,
    hat: true,
    head: true,
    mask: true,
    mouth: true,
    nose: true,
  };
  const isNumber = function (n) {
    return !isNaN(n);
  };

  return function({ schematic, meta, defs }) {
    console.log(meta);
    let min = new XY([0, 0]);
    let max = new XY([0, 0]);
    const bodyScale = new XY(SCALES[schematic.bodyScale] || [1.0, 1.0]);
    const bodyScaleY = bodyScale.toJSON()[1];
    const headShift = new XY([
      0.0,
      TORSO_TOPS[schematic.bodyType] * 0.99 * (1 - bodyScaleY),
    ]);
    const contents = schematic.layers.map((layer,index) => {
      console.log(layer);
      let part = meta.parts[layer.part][layer.index];
      layer.resize = layer.resize || XY.identityMultiplier();
      let flip = layer.resize.times([layer.flip ? -1.0 : 1.0, 1.0]);
      let move = layer.move || XY.origin();
      if (HEAD_PARTS[layer.part]) {
        move = move.plus(headShift.toJSON());
      } else {
        flip = flip.times(bodyScale.toJSON());
      }
      let partMin = new XY(part.min).times(flip.toJSON()).plus(move.toJSON());
      let partMax = new XY(part.max).times(flip.toJSON()).plus(move.toJSON());
      let [partMinX, partMinY] = partMin.toJSON();
      let [partMaxX, partMaxY] = partMax.toJSON();
      let minX = Math.min(partMinX, partMaxX);
      let maxX = Math.max(partMinX, partMaxX);
      partMin = new XY([minX, partMinY]);
      partMax = new XY([maxX, partMaxY]);
      min = min.min(partMin.toJSON());
      max = max.max(partMax.toJSON());
      let [flipX, flipY] = flip.toJSON();
      let [moveX, moveY] = move.toJSON();
      return <g key={`group-${index}`} opacity={layer.opacity || 1.0} transform={`matrix(${flipX},0.0,0.0,${flipY},${moveX},${moveY})`}>
        { part.layers.base && <use href={ '#' + part.layers.base } fill={ layer.base || 'white'}/>}
        { part.layers.detail && <use href={ '#' + part.layers.detail } stroke={ layer.detail || 'white'}/>}
        { isNumber(layer.pattern) && layer.pattern >= 0 && (part.layers.base || part.layers.detail) &&
          <group fill={`url(#pattern-${layer.pattern >= 10 ? '' : '0'}${ layer.pattern })`}>
            { part.layers.base && <use href={ '#' + part.layers.base}/>}
            { part.layers.detail && <use href={ '#' + part.layers.detail}/>}
          </group>}
        { isNumber(layer.shading) && layer.shading >= 0 && (part.layers.base || part.layers.detail) &&
          <>
            { part.layers.base && <use href={ '#' + part.layers.base} fill={`url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })`}/>}
            { part.layers.detail && <use href={ '#' + part.layers.detail} fill={`url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })`}/>}
          </>}
        { part.layers.outline && <use href={ '#' + part.layers.outline } fill="none" stroke={ layer.outline || 'black'} strokeWidth="1"/>}
        { part.layers.shadow && <use href={ '#' + part.layers.shadow }/> }
      </g>
    });
    let [minX, minY] = min.toJSON();
    let [maxX, maxY] = max.toJSON();
    let halfWidth = Math.max(Math.abs(maxX), Math.abs(minX));
    min = new XY([-1 * halfWidth, minY]);
    max = new XY([halfWidth, maxY]);
    [minX, minY] = min.toJSON();
    [maxX, maxY] = max.toJSON();
    let padding = [10, 10];
    min = min.minus(padding);
    max = max.plus(padding);
    [minX, minY] = min.toJSON();
    [maxX, maxY] = max.toJSON();
    let width = maxX - minX;
    let height = maxY - minY;
    return <svg width={1.5 * width} height={1.5 * height} viewBox={`${minX} ${minY} ${width} ${height}`}>
      <defs dangerouslySetInnerHTML={{ __html: defs }}></defs>
      { schematic.bgColor &&
        <rect x={minX} y={minY} width={width} height={height} fill={schematic.bgColor} stroke="none"/>
      }
      { schematic.bgPattern &&
        <rect x={minX} y={minY} width={width} height={height} fill={
          `url(#patterns-${schematic.bgPattern >= 10 ? '' : '0'}${ schematic.bgPattern })`
        } stroke="none"/>
      }
      <rect x={minX} y={minY} width={width} height={height} fill="none" stroke="black" strokeWidth="2"/>
      <g>
        { contents }
      </g>
    </svg>;
  }
});