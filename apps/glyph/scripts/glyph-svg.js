namespace('sp.glyph.GlyphSVG',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const layerDefaults = { strokeWidth: 0 };
  const canRotate = function(layer) {
    return layer.rotate && !isNaN(layer.rotateAngle) && layer.rotateAngle !== 0;
  }
  const rotateContext = function(ctx, cx, cy, a) {
    ctx.translate(cx,cy);
    ctx.rotate(a * Math.PI / 180);
    ctx.translate(-cx,-cy);
  }
  const svgRotate = function(layer,getCenter) {
    const center = getCenter(layer);
    if (canRotate(layer) && Array.isArray(center)) {
      const [cx, cy] = center;
      return `rotate(${layer.rotateAngle} ${cx} ${cy})`;
    }
  }
  const shapes = {
    rect:{
      init:function(defaults) {
        return util.merge(defaults,{type:"rect"});
      },
      render:function(layer,getCenter) {
        return <rect x={layer.rectX} y={layer.rectY} width={layer.rectWidth} height={layer.rectHeight}
                     fill={layer.fill || 'none'} stroke={layer.stroke || 'none'}
                     strokeWidth={layer.strokeWidth || 0} transform={ svgRotate(layer,getCenter) }></rect>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.rect(layer.rectX || 0,layer.rectY || 0,layer.rectWidth || 0,layer.rectHeight || 0);
        return path;
      },
      getCenter:function(layer) {
        return [ layer.rectX + layer.rectWidth / 2, layer.rectY + layer.rectHeight / 2 ];
      }
    },
    circle:{
      init:function(defaults) {
        return util.merge(defaults,{type:"circle",circleCX:0,circleCY:0,circleR:20});
      },
      render:function(layer,getCenter) {
        return <circle cx={layer.circleCX} cy={layer.circleCY} r={layer.circleR}
                       fill={layer.fill || 'none'} stroke={layer.stroke || 'none'}
                       strokeWidth={layer.strokeWidth || 0}></circle>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.arc(layer.circleCX || 0,layer.circleCY || 0,layer.circleR || 0, 0, 2 * Math.PI);
        path.closePath();
        return path;
      },
      getCenter:function(layer) {}
    },
    ellipse:{
      init:function(defaults) {
        return util.merge(defaults,{type:"ellipse"});
      },
      render:function(layer,getCenter) {
        return <ellipse
          cx={layer.ellipseCX} cy={layer.ellipseCY} rx={layer.ellipseRX} ry={layer.ellipseRY}
          fill={layer.fill || 'none'} stroke={layer.stroke || 'none'}
          strokeWidth={layer.strokeWidth || 0} transform={ svgRotate(layer,getCenter) }></ellipse>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.ellipse(layer.ellipseCX || 0, layer.ellipseCY || 0, layer.ellipseRX || 0, layer.ellipseRY || 0, 0, 0, 2 * Math.PI);
        return path;
      },
      getCenter:function(layer) {
        return [ layer.ellipseCX, layer.ellipseCY ];
      }
    },
    poly:{
      init:function(defaults) {
        return util.merge(defaults,{ type:"poly", polyPoints: [] });
      },
      render:function(layer,getCenter) {
        if(Array.isArray(layer.polyPoints) && layer.polyPoints.length >= 3) {
          return <polygon points={layer.polyPoints.map((p) => p.join(',')).join(' ')}
                          fill={layer.fill || 'none'} stroke={layer.stroke || 'none'}
                          strokeWidth={layer.strokeWidth || 0} transform={ svgRotate(layer,getCenter) }></polygon>;
        }
      },
      draw:function(layer) {
        const path = new Path2D();
        const [firstX,firstY] = layer.polyPoints[0];
        const rest = layer.polyPoints.slice(1);
        path.moveTo(firstX || 0, firstY || 0);
        rest.forEach(([x,y]) => {
          path.lineTo(x || 0, y || 0);
        })
        path.closePath();
        return path;
      },
      getCenter:function(layer) {
        if ( layer.polyPoints.length > 0 ) {
          const count = layer.polyPoints.length;
          const [ xs, ys ] = layer.polyPoints.reduce(([ xs, ys ],[ x, y ]) => {
            xs.push(x);
            ys.push(y);
            return [ xs, ys ];
          }, [ [], [] ]);
          const [ minX, minY ] = [ xs, ys ].map((ns) => Math.min.apply(null, ns));
          const [ maxX, maxY ] = [ xs, ys ].map((ns) => Math.max.apply(null, ns));
          return [ (minX + maxX) / 2, (minY + maxY) / 2 ];
        } else {
          return [ 0, 0 ];
        }
      }
    }
  }
  const render = function(layer) {
    const shape = shapes[layer.type];
    if (shape) {
      return shape.render(layer, shape.getCenter);
    }
  }
  const draw = function(ctx,layer) {
    const shape = shapes[layer.type];
    if (shape) {
      console.log({ msg: `draw ${layer.type}`, layer});
      const center = shape.getCenter(layer);
      if (canRotate(layer) && Array.isArray(center)) {
        const [cx, cy] = center;
        rotateContext(ctx, cx, cy, layer);
      }
      ctx.fillStyle = layer.fill;
      ctx.strokeStyle = layer.stroke;
      ctx.lineWidth = layer.strokeWidth || 0;
      const path = shape.draw(layer);
      if (layer.fill) {
        ctx.fill(path);
      }
      if (layer.stroke && layer.strokeWidth > 0) {
        ctx.stroke(path);
      }
    }
  }
  const newSchematic = function() {
    return {
      size: {
        minX: 0, minY: 0, maxX: 100, maxY:100,
      },
      layers:[],
      grid:{
        size:10,
        lineWidth:1,
        style:"solid"
      }
    };
  }
  const newLayer = function(type) {
    const shape = shapes[type];
    if (shape) {
      return shape.init(layerDefaults);
    } else {
      return util.merge(layerDefaults);
    }
  }
  const getDim = function(schematic) {
    return {
      width: schematic.size.maxX - schematic.size.minX,
      height: schematic.size.maxY - schematic.size.minY
    };
  };
  const GlyphSVG = function({ schematic, selectLayer }) {
    const { width, height } = getDim(schematic);
    return <svg width="100%" height="80%" viewBox={`${schematic.size.minX} ${schematic.size.minY} ${width} ${height}`}>
      <rect x={schematic.size.minX} y={schematic.size.minY} width={width} height={height} fill="#999999" stroke="none"/>
      { schematic.layers.map((layer,layerIndex) => {
        return <a href="#" onClick={(e) => {
          e.preventDefault();
          selectLayer(layerIndex);
        }}>{ render(layer) }</a>;
      })}
      <rect x={schematic.size.minX} y={schematic.size.minY} width={width} height={height} fill="none" stroke="black" strokeWidth={2}/>
    </svg>;
  }
  GlyphSVG.drawCanvasBase64 = function(schematic,callback) {
    const { width, height } = getDim(schematic);
    const { ctx, canvas } = util.getCanvasAndContext("canvas");
    canvas.width = width;
    canvas.height = height;
    schematic.layers.forEach((layer) => {
      draw(ctx,layer);
    });
    callback(canvas.toDataURL());
  }
  GlyphSVG.newSchematic = newSchematic;
  GlyphSVG.newLayer = newLayer;
  return GlyphSVG;
});
