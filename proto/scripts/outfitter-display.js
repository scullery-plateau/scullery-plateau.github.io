(function () {
  let SCALES = {
    lanky: [0.8, 1.1],
    thin: [0.8, 1.0],
    teen: [0.9, 0.9],
    stocky: [0.9, 0.8],
    petite: [0.8, 0.8],
  };
  let TORSO_TOPS = {
    fit: 106.35,
    hulk: 169.1,
    superman: 146.9,
    woman: 93.6,
  };
  let HEAD_PARTS = {
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
  let isNumber = function (n) {
    return !isNaN(n);
  };
  window.buildSVG = function (schematic, meta, defs) {
    let min = new XY([0, 0]);
    let max = new XY([0, 0]);
    let contents = [];
    let bodyScale = new XY(SCALES[schematic.bodyScale] || [1.0, 1.0]);
    let bodyScaleY = bodyScale.toJSON()[1];
    let headShift = new XY([
      0.0,
      TORSO_TOPS[schematic.bodyType] * 0.99 * (1 - bodyScaleY),
    ]);
    schematic.layers.forEach((layer, index) => {
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
      let group = [];
      if (part.layers.base) {
        group.push(
          SVG.use('#' + part.layers.base, { fill: layer.base || 'white' })
        );
      }
      if (part.layers.detail) {
        group.push(
          SVG.use('#' + part.layers.detail, { fill: layer.detail || 'white' })
        );
      }
      if (isNumber(layer.pattern) && layer.pattern >= 0) {
        let pattern = [];
        if (part.layers.base) {
          pattern.push(SVG.use('#' + part.layers.base, {}));
        }
        if (part.layers.detail) {
          pattern.push(SVG.use('#' + part.layers.detail, {}));
        }
        if (pattern.length > 0) {
          group.push(
            SVG.group(
              {
                fill: `url(#patterns-${layer.pattern >= 10 ? '' : '0'}${
                  layer.pattern
                })`,
              },
              pattern
            )
          );
        }
      }
      if (isNumber(layer.shading) && layer.shading >= 0) {
        let shading = [];
        if (part.layers.base) {
          shading.push(SVG.use('#' + part.layers.base, {}));
        }
        if (part.layers.detail) {
          shading.push(SVG.use('#' + part.layers.detail, {}));
        }
        if (shading.length > 0) {
          group.push(
            SVG.group(
              {
                fill: `url(#shading-${layer.shading >= 10 ? '' : '0'}${
                  layer.shading
                })`,
              },
              shading
            )
          );
        }
      }
      if (part.layers.outline) {
        group.push(
          SVG.use('#' + part.layers.outline, {
            stroke: layer.outline || 'black',
          })
        );
      }
      if (part.layers.shadow) {
        group.push(SVG.use('#' + part.layers.shadow, {}));
      }
      let [flipX, flipY] = flip.toJSON();
      let [moveX, moveY] = move.toJSON();
      let elem = SVG.group(
        {
          transform: `matrix(${flipX},0.0,0.0,${flipY},${moveX},${moveY})`,
          opacity: `${layer.opacity || 1.0}`,
        },
        group
      );
      let anchor = SVG.anchor(
        `#`,
        {
          onclick: `selectOutfitterLayer(event,'selectedLayer',${index})`,
        },
        [elem]
      );
      contents.push(anchor);
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
    let frame = [defs];
    if (schematic.bgColor) {
      frame.push(
        SVG.rect(minX, minY, width, height, {
          stroke: 'none',
          fill: schematic.bgColor,
        })
      );
    }
    if (schematic.bgPattern) {
      frame.push(
        SVG.rect(minX, minY, width, height, {
          stroke: 'none',
          fill: `url(#patterns-${schematic.bgPattern >= 10 ? '' : '0'}${
            schematic.bgPattern
          })`,
        })
      );
    }
    frame.push(
      SVG.rect(minX, minY, width, height, {
        stroke: 'black',
        'stroke-width': '2',
        fill: 'none',
      })
    );
    frame.push(SVG.group({}, contents));
    return SVG.svg(
      '' + 1.5 * width,
      '' + 1.5 * height,
      {
        viewBox: [minX, minY, width, height].join(' '),
      },
      frame
    );
  };
})();
