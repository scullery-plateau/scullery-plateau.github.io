namespace("sp.outfitter.Dataset", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax",
  "gizmo-atheneum.namespaces.Point": "XY",
  "sp.common.Utilities": "util"
}, ({ Ajax, XY, util }) => {

        const baseURL = "https://scullery-plateau.github.io/apps/outfitter/datasets/";


  const latestVersion = "0.0.1";
  const defaultVersion = "0.0.1";
  const getLatestVersion = function() {
    return latestVersion;
  }
  const getDefaultVersion = function() {
    return defaultVersion;
  }
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
    const [defaultX, defaultY] = defaultPoint.toJSON();
    const [xVal,yVal] = [xField,yField].map((field) => layer[field]);
    return new XY([isNaN(xVal)?defaultX:xVal,isNaN(yVal)?defaultY:yVal]);
  }
  const getBodyScaleAndHeadShift = function(schematic) {
    const bodyScale = new XY(SCALES[schematic.bodyScale] || [1.0, 1.0]);
    const bodyScaleY = bodyScale.toJSON()[1];
    const headShift = new XY([
      0.0,
      TORSO_TOPS[schematic.bodyType] * 0.99 * (1 - bodyScaleY),
    ]);
    return { bodyScale, headShift };
  }
  const getFlipMove = function(layer,headShift,bodyScale) {
    const resize = getPoint(layer,'resizeX','resizeY',XY.identityMultiplier());
    const flip = resize.times([layer.flip ? -1.0 : 1.0, 1.0]);
    const move = getPoint(layer,'moveX','moveY',XY.origin());
    if (HEAD_PARTS[layer.part]) {
      return { flip, move: move.plus(headShift.toJSON()) };
    } else {
      return { move, flip: flip.times(bodyScale.toJSON()) };
    }
  }
  const updateMinMax = function(part, flip, move, minmax) {
    let partMin = new XY(part.min).times(flip.toJSON()).plus(move.toJSON());
    let partMax = new XY(part.max).times(flip.toJSON()).plus(move.toJSON());
    const [partMinX, partMinY] = partMin.min(partMax.toJSON()).toJSON();
    const [partMaxX, partMaxY] = partMin.max(partMax.toJSON()).toJSON();
    const minX = Math.min(partMinX, partMaxX);
    const maxX = Math.max(partMinX, partMaxX);
    partMin = new XY([minX, partMinY]);
    partMax = new XY([maxX, partMaxY]);
    minmax.min = minmax.min.min(partMin.toJSON());
    minmax.max = minmax.max.max(partMax.toJSON());
    return partMin.midpoint(partMax.toJSON());
  }
  const getImgDim = function(minmax, percentOfScreenWidth, percentOfScreenHeight) {
    let [minX, minY] = minmax.min.toJSON();
    let [maxX, maxY] = minmax.max.toJSON();
    const halfWidth = Math.max(Math.abs(maxX), Math.abs(minX));
    minmax.min = new XY([-1 * halfWidth, minY]);
    minmax.max = new XY([halfWidth, maxY]);
    const padding = [10, 10];
    minmax.min = minmax.min.minus(padding);
    minmax.max = minmax.max.plus(padding);
    [minX, minY] = minmax.min.toJSON();
    [maxX, maxY] = minmax.max.toJSON();
    const width = maxX - minX;
    const height = maxY - minY;
    let frameHeight = getScreenHeight() * percentOfScreenHeight;
    let frameWidth = getScreenWidth() * percentOfScreenWidth;
    [ frameWidth, frameHeight ] = [ Math.min(frameWidth, frameHeight * width / height), Math.min(frameHeight, frameWidth * height / width) ];
    return { minX, minY, width, height, frameWidth, frameHeight };
  }
  const getPatternId = function(patternIndex) {
    return patternIndex >= 0 && `patterns-${ patternIndex >= 10 ? '' : '0' }${ patternIndex }`;
  }
  const getShadingId = function(shadingIndex) {
    return shadingIndex >= 0 && `shading-${ shadingIndex >= 10 ? '' : '0' }${ shadingIndex }`;
  }
  const appendDefs = function(meta) {
    return function(out, id) {
      out.push(meta[id]);
      return out;
    };
  };
  const buildDefs = function(meta,{layers,patterns,shading}) {
    const out = Array.from(layers);
    Object.keys(patterns).reduce(appendDefs(meta.patterns),out);
    Object.keys(shading).reduce(appendDefs(meta.shadings),out);
    return out.join('');
  };
  const versions = {
    "fit":["0.0.1"],
    "hulk":["0.0.1"],
    "superman":["0.0.1"],
    "woman":["0.0.1"]
  };
  const colorValidator = (color) => (typeof color === "string") // todo
  const minMaxValidator = function(minFn, maxFn) {
    // todo
    // return (value, dataset, layer) => (value >= minFn(dataset,layer) && )
  }
  const schematicFields = "bodyType,version,bgPattern,bgColor,bodyScale,layers".split(",");
  const layerFields = "part,index,base,detail,outline,pattern,shading,opacity,rotate,resizeX,resizeY,moveX,moveY".split(",");
  const layerValidators = {
    part: (part, dataset) => (part in dataset.parts),
    index: (index, dataset, layer) => (index >= 0 && index < dataset.parts[layer.part].length),
    base: colorValidator,
    detail: colorValidator,
    pattern: (pattern, dataset) => (pattern >= 0 && pattern < dataset.patternCount)
    // todo
  };
    const buildSVGComponents = function(meta, schematic, options) {
    const { percentOfScreenWidth, percentOfScreenHeight, clickName, getLayerLabel } = options || {};
    const minmax = {
      min:new XY([0, 0]),
      max:new XY([0, 0])
    };
    const defs = {
      layers:[],
      patterns:{},
      shading:{}
    };
    defs.patterns[getPatternId(schematic.bgPattern)] = true;
    const { bodyScale, headShift } = getBodyScaleAndHeadShift(schematic);
    const svgLayers = schematic.layers.map((layer, index) => {
      const part = meta.parts[layer.part][layer.index];
      defs.layers.push(part.defs);
      const { flip, move } = getFlipMove(layer,headShift,bodyScale);
      const [ flipX, flipY ] = flip.toJSON();
      const [ moveX, moveY ] = move.toJSON();
      const [cx, cy] = updateMinMax(part,flip,move,minmax).toJSON();
      const group = [];
      if (part.layers.base) {
        group.push(`<use href="#${ part.layers.base }" fill="${ layer.base || 'white'}" stroke="none"/>`);
      }
      if (part.layers.detail) {
        group.push(`<use href="#${ part.layers.detail }" fill="${ layer.detail || 'white'}"  stroke="none"/>`);
      }
      if (isNumber(layer.pattern) && layer.pattern >= 0 && (part.layers.base || part.layers.detail)) {
        const patternId = getPatternId(layer.pattern);
        defs.patterns[patternId] = true;
        const pattern = [];
        if (part.layers.base) {
          pattern.push(`<use href="#${part.layers.base}" fill="url(#${patternId})" stroke="none"/>`);
        }
        if (part.layers.detail) {
          pattern.push(`<use href="#${part.layers.detail}" fill="url(#${patternId})" stroke="none"/>`);
        }
        group.push(pattern.join(''));
      }
      if (isNumber(layer.shading) && layer.shading >= 0 && (part.layers.base || part.layers.detail)) {
        const shadingId = getShadingId(layer.shading);
        defs.shading[shadingId] = true;
        const shading = [];
        if (part.layers.base) {
          shading.push(`<use href="#${part.layers.base}" fill="url(#${shadingId})" stroke="none"/>`);
        }
        if (part.layers.detail) {
          shading.push(`<use href="#${part.layers.detail}" fill="url(#${shadingId})" stroke="none"/>`);
        }
        group.push(shading.join(''));
      }
      if (part.layers.outline) {
        group.push(`<use href="#${part.layers.outline }" fill="none" stroke="${ layer.outline || 'black'}" stroke-width="1"/>`);
      }
      if (part.layers.shadow) {
        group.push(`<use href="#${part.layers.shadow }" stroke="none"/>`);
      }
      const content = `<g opacity="${layer.opacity || 1.0}" transform="rotate(${layer.rotate || 0}, ${cx}, ${cy}) matrix(${flipX},0.0,0.0,${flipY},${moveX},${moveY})">${group.join('')}</g>`;
      return clickName ? `<a href="#" onclick="${clickName}(event, ${index})"><title>${getLayerLabel(index, layer)}</title>${content}</a>` : content;
    });
    const { minX, minY, width, height, frameWidth, frameHeight } = getImgDim(minmax, percentOfScreenWidth || 0.25, percentOfScreenHeight || 0.75);
    const background = [];
    if (schematic.bgColor) {
      background.push(`<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${schematic.bgColor}" stroke="none"/>`)
    }
    if (isNumber(schematic.bgPattern)) {
      background.push(`<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="url(#${ getPatternId(schematic.bgPattern) })" stroke="none"/>`);
    }
    return { 
      dim: [ minX, minY, width, height ],
      defs: buildDefs(meta,defs), 
      frameWidth,
      frameHeight,
      background, 
      svgLayers 
    };
  }
  const drawSVG = function(dataset, schematic, options) {
    const { dim, defs, background, svgLayers, frameWidth, frameHeight } = buildSVGComponents(dataset, schematic, options);
    const viewBox = dim.join(" ");
    const content = `<defs>${ defs }</defs><g>${ background.join('') }</g>${ svgLayers.join('') }`;
    return {
      viewBox,
      content,
      width: frameWidth,
      height: frameHeight,
      full: `<svg width="${frameWidth}" height="${frameHeight}" viewBox="${viewBox}">${content}</svg>`
    }
  }
  const Dataset = function(dataset, percentOfScreenWidth, percentOfScreenHeight) {
    this.buildSVGComponents = function(schematic, options) {
      return buildSVGComponents(dataset, schematic, util.merge(options || {}, { percentOfScreenWidth, percentOfScreenHeight }));
    };
    this.drawSVG = function(schematic, options) {
      return drawSVG(dataset, schematic, util.merge(options || {}, { percentOfScreenWidth, percentOfScreenHeight }));
    };

    this.getPart = function(part) {
      return dataset.parts[part];
    }
    this.getPatternCount = function() {
      return dataset.patternCount;
    }
    this.getShadingCount = function() {
      return dataset.shadingCount;
    }
  };
  const getBodyScales = function() {
    return Array.from(Object.keys(SCALES));
  }
  const getVersions = function() {
    return Object.entries(versions).reduce((acc, [k,v]) => {
      acc[k] = Array.from(v);
      return acc;
    }, {});
  }
  const load = function(bodyType, version, percentOfScreenWidth, percentOfScreenHeight, onSuccess, onFail, onStateChange) {
    if(!(bodyType in versions)) {
      throw `"${bodyType}" is not a valid dataset name`;
    }
    if(versions[bodyType].indexOf(version) < 0) {
      throw `"${version}" is not a valid version of "${bodyType}"`;
    }
    const filepath = `${baseURL}${bodyType}.${version}.json`
    Ajax.get(filepath,{
      failure: onFail,
      stateChange: onStateChange,
      success: (responseText) => {
        try {
          const metadata = JSON.parse(responseText);
          metadata.patternCount = Object.keys(metadata.patterns).length;
          metadata.shadingCount = Object.keys(metadata.shadings).length;
          onSuccess(new Dataset(metadata, percentOfScreenWidth, percentOfScreenHeight));
        } catch (e) {
          onFail({ 
            requestedFile: filepath,
            statusText: e.message,
            responseText: responseText,
          })
        }
      }
    });
  }
  return { getBodyScales, getVersions, getLatestVersion, getDefaultVersion, load };
});