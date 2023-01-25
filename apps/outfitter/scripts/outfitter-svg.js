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
  const getScreenHeight = (() => {
    if( typeof( window.innerHeight ) == 'number' ) {
      //Non-IE
      return window.innerHeight;
    } else if( document.documentElement && document.documentElement.clientHeight ) {
      //IE 6+ in 'standards compliant mode'
      return document.documentElement.clientHeight;
    } else if( document.body && document.body.clientHeight ) {
      //IE 4 compatible
      return document.body.clientHeight;
    }
  });
  const getScreenWidth = (() => {
    if( typeof( window.innerWidth ) == 'number' ) {
      //Non-IE
      return window.innerWidth;
    } else if( document.documentElement && document.documentElement.clientWidth ) {
      //IE 6+ in 'standards compliant mode'
      return document.documentElement.clientWidth;
    } else if( document.body && document.body.clientWidth ) {
      //IE 4 compatible
      return document.body.clientWidth;
    }
  });
  const getPoint = function(layer,xField,yField,defaultPoint) {
    let [defaultX, defaultY] = defaultPoint.toJSON();
    let [xVal,yVal] = [xField,yField].map((field) => layer[field]);
    return new XY([isNaN(xVal)?defaultX:xVal,isNaN(yVal)?defaultY:yVal]);
  }
  const buildSVG = function(schematic, meta, defs) {
    let min = new XY([0, 0]);
    let max = new XY([0, 0]);
    const bodyScale = new XY(SCALES[schematic.bodyScale] || [1.0, 1.0]);
    const bodyScaleY = bodyScale.toJSON()[1];
    const headShift = new XY([0.0, TORSO_TOPS[schematic.bodyType] * 0.99 * (1 - bodyScaleY)]);
    const contents = schematic.layers.map((layer,index) => {
      let part = meta.parts[layer.part][layer.index];
      let resize = getPoint(layer,'resizeX','resizeY',XY.identityMultiplier());
      let flip = resize.times([layer.flip ? -1.0 : 1.0, 1.0]);
      let move = getPoint(layer,'moveX','moveY',XY.origin());
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
      let group = []
      if (part.layers.base) {
        group.push(`<use href="#${ part.layers.base }" fill="${ layer.base || 'white'}" stroke="none"/>`);
      }
      if (part.layers.detail) {
        group.push(`<use href={ '#' + part.layers.detail } fill={ layer.detail || 'white'}  stroke="none"/>`);
      }
      if (isNumber(layer.pattern) && layer.pattern >= 0 && (part.layers.base || part.layers.detail)) {
        let pattern = [];
        if (part.layers.base) {
          pattern.push(`<use href="#${part.layers.base}" fill="url(#patterns-${layer.pattern >= 10 ? '' : '0'}${ layer.pattern })" stroke="none"/>`);
        }
        if (part.layers.detail) {
          pattern.push(`<use href="#${part.layers.detail}" fill="url(#patterns-${layer.pattern >= 10 ? '' : '0'}${ layer.pattern })" stroke="none"/>`);
        }
        group.push(pattern.join(''));
      }
      if (isNumber(layer.shading) && layer.shading >= 0 && (part.layers.base || part.layers.detail)) {
        let shading = [];
        if (part.layers.base) {
          shading.push(`<use href="#${part.layers.base}" fill="url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })" stroke="none"/>`);
        }
        if (part.layers.detail) {
          shading.push(`<use href="#${part.layers.detail}" fill="url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })" stroke="none"/>`);
        }
        group.push(shading.join(''));
      }
      if (part.layers.outline) {
        group.push(`<use href="#${part.layers.outline }" fill="none" stroke="${ layer.outline || 'black'}" stroke-width="1"/>`);
      }
      if (part.layers.shadow) {
        group.push(`<use href="#${part.layers.shadow }" stroke="none"/>`);
      }
      return `<g opacity="${layer.opacity || 1.0}" transform="matrix(${flipX},0.0,0.0,${flipY},${moveX},${moveY})">${group.join('')}</g>`
    });
    let [minX, minY] = min.toJSON();
    let [maxX, maxY] = max.toJSON();
    let halfWidth = Math.max(Math.abs(maxX), Math.abs(minX));
    min = new XY([-1 * halfWidth, minY]);
    max = new XY([halfWidth, maxY]);
    const padding = [10, 10];
    min = min.minus(padding);
    max = max.plus(padding);
    [minX, minY] = min.toJSON();
    [maxX, maxY] = max.toJSON();
    const width = maxX - minX;
    const height = maxY - minY;
    let frameHeight = getScreenHeight() * 0.75;
    let frameWidth = getScreenWidth() * 0.25;
    [frameWidth, frameHeight] = [Math.min(frameWidth,frameHeight * width / height),Math.min(frameHeight,frameWidth * height / width)];
    let viewBox = `${minX} ${minY} ${width} ${height}`;
    let content = [`<defs>${defs}</defs>`]
    if (schematic.bgColor) {
      content.push(`<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${schematic.bgColor}" stroke="none"/>`)
    }
    if (isNumber(schematic.bgPattern)) {
      content.push(`<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="url(#patterns-${schematic.bgPattern >= 10 ? '' : '0'}${schematic.bgPattern})" stroke="none"/>`);
    }
    content.push(`<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="2"/>`)
    content.push(`<g>${contents.join('')}</g>`)
    return { width: frameWidth, height: frameHeight, viewBox, content: content.join('') };
  }
  const OutfitterSVG = function({ schematic, meta, defs }) {
    let min = new XY([0, 0]);
    let max = new XY([0, 0]);
    const bodyScale = new XY(SCALES[schematic.bodyScale] || [1.0, 1.0]);
    const bodyScaleY = bodyScale.toJSON()[1];
    const headShift = new XY([
      0.0,
      TORSO_TOPS[schematic.bodyType] * 0.99 * (1 - bodyScaleY),
    ]);
    const contents = schematic.layers.map((layer,index) => {
      let part = meta.parts[layer.part][layer.index];
      let resize = getPoint(layer,'resizeX','resizeY',XY.identityMultiplier());
      let flip = resize.times([layer.flip ? -1.0 : 1.0, 1.0]);
      let move = getPoint(layer,'moveX','moveY',XY.origin());
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
        { part.layers.base && <use href={ '#' + part.layers.base } fill={ layer.base || 'white'} stroke="none"/>}
        { part.layers.detail && <use href={ '#' + part.layers.detail } fill={ layer.detail || 'white'}  stroke="none"/>}
        { isNumber(layer.pattern) && layer.pattern >= 0 && (part.layers.base || part.layers.detail) &&
          <>
            { part.layers.base && <use href={ '#' + part.layers.base} fill={`url(#patterns-${layer.pattern >= 10 ? '' : '0'}${ layer.pattern })`} stroke="none"/>}
            { part.layers.detail && <use href={ '#' + part.layers.detail} fill={`url(#patterns-${layer.pattern >= 10 ? '' : '0'}${ layer.pattern })`} stroke="none"/>}
          </>}
        { isNumber(layer.shading) && layer.shading >= 0 && (part.layers.base || part.layers.detail) &&
          <>
            { part.layers.base && <use href={ '#' + part.layers.base} fill={`url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })`} stroke="none"/>}
            { part.layers.detail && <use href={ '#' + part.layers.detail} fill={`url(#shading-${layer.shading >= 10 ? '' : '0'}${ layer.shading })`} stroke="none"/>}
          </>}
        { part.layers.outline && <use href={ '#' + part.layers.outline } fill="none" stroke={ layer.outline || 'black'} strokeWidth="1"/>}
        { part.layers.shadow && <use href={ '#' + part.layers.shadow } stroke="none"/> }
      </g>
    });
    let [minX, minY] = min.toJSON();
    let [maxX, maxY] = max.toJSON();
    let halfWidth = Math.max(Math.abs(maxX), Math.abs(minX));
    min = new XY([-1 * halfWidth, minY]);
    max = new XY([halfWidth, maxY]);
    const padding = [10, 10];
    min = min.minus(padding);
    max = max.plus(padding);
    [minX, minY] = min.toJSON();
    [maxX, maxY] = max.toJSON();
    const width = maxX - minX;
    const height = maxY - minY;
    let frameHeight = getScreenHeight() * 0.75;
    let frameWidth = getScreenWidth() * 0.25;
    [frameWidth, frameHeight] = [Math.min(frameWidth,frameHeight * width / height),Math.min(frameHeight,frameWidth * height / width)];
    return <svg width={ frameWidth } height={ frameHeight } viewBox={`${minX} ${minY} ${width} ${height}`}>
      <defs dangerouslySetInnerHTML={{ __html: defs }}></defs>
      { schematic.bgColor &&
        <rect x={minX} y={minY} width={width} height={height} fill={schematic.bgColor} stroke="none"/>
      }
      { isNumber(schematic.bgPattern) &&
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
  OutfitterSVG.buildSVG = buildSVG;
  OutfitterSVG.getBodyScales = function() {
    return Array.from(Object.keys(SCALES));
  }
  return OutfitterSVG;
});