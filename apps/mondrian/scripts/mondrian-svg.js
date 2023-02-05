namespace('sp.mondrian.MondrianSVG',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const drawPoly = function(ctx,points) {
    const [firstX,firstY] = points[0];
    const rest = points.slice(1);
    ctx.moveTo(firstX,firstY);
    rest.forEach(([x,y]) => {
      ctx.lineTo(x,y);
    })
    ctx.lineTo(firstX,firstY);
  }
  const layerDefaults = {};
  const shapes = {
    rect:{
      args:{},
      init:function(defaults) {
        return util.merge(defaults,{});
      },
      render:function(layer) {
        return <rect x={layer.rectX} y={layer.rectY} width={layer.rectWidth} height={layer.rectHeight} fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></rect>;
      },
      draw:function(ctx,layer) {
        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.rect(layer.rectX,layer.rectY,layer.rectWidth,layer.rectHeight);
          ctx.fill();
        }
        if (layer.stroke && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.stroke;
          ctx.lineWidth = layer.strokeWidth
          ctx.rect(layer.rectX,layer.rectY,layer.rectWidth,layer.rectHeight);
          ctx.stroke();
        }
      }
    },
    circle:{
      args:{},
      init:function(defaults) {
        return util.merge(defaults,{});
      },
      render:function(layer) {
        return <circle cx={layer.circleCX} cy={layer.circleCY} r={layer.circleR}  fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></circle>;
      },
      draw:function(ctx,layer) {
        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.beginPath();
          ctx.arc(layer.circleCX,layer.circleCY,layer.circleR, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (layer.stroke && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.stroke;
          ctx.lineWidth = layer.strokeWidth
          ctx.beginPath();
          ctx.arc(layer.circleCX,layer.circleCY,layer.circleR, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    },
    ellipse:{
      args:{},
      init:function(defaults) {
        return util.merge(defaults,{});
      },
      render:function(layer) {
        return <ellipse cx={layer.ellipseCX} cy={layer.ellipseCY} rx={layer.ellipseRX} ry={layer.ellipseRY} fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></ellipse>;
      },
      draw:function(ctx,layer) {
        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.ellipse(layer.ellipseCX,layer.ellipseCY,layer.ellipseRX,layer.ellipseRY,0,0,2 * Math.PI);
          ctx.fill();
        }
        if (layer.stroke && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.stroke;
          ctx.lineWidth = layer.strokeWidth
          ctx.ellipse(layer.ellipseCX,layer.ellipseCY,layer.ellipseRX,layer.ellipseRY,0,0,2 * Math.PI);
          ctx.stroke();
        }
      }
    },
    polygon:{
      args:{},
      init:function(defaults) {
        return util.merge(defaults,{});
      },
      render:function(layer) {
        return <polygon points={layer.polyPoints.map((p) => p.join(',')).join(' ')}  fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></polygon>;
      },
      draw:function(ctx,layer) {
        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.beginPath();
          drawPoly(ctx,layer.polyPoints);
          ctx.fill();
        }
        if (layer.stroke && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.stroke;
          ctx.lineWidth = layer.strokeWidth
          ctx.beginPath();
          drawPoly(ctx,layer.polyPoints);
          ctx.stroke();
        }
      }
    }
  }
  const render = function(layer) {
    const shape = shapes[layer.type];
    if (shape) {
      return shape.render(layer);
    }
  }
  const draw = function(ctx,layer) {
    const shape = shapes[layer.type];
    if (shape) {
      shape.draw(ctx,layer);
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
  const MondrianSVG = function({ schematic }) {
    const { width, height } = getDim(schematic);
    return <svg width={width} height={height} viewBox={`${schematic.size.minX} ${schematic.size.minY} ${width} ${height}`}>
      { schematic.layers.map((layer) => {
        return render(layer);
      })}
    </svg>;
  }
  MondrianSVG.drawCanvasBase64 = function(schematic,callback) {
    const { width, height } = getDim(schematic);
    const { ctx, canvas } = util.getCanvasAndContext("canvas");
    canvas.width = width;
    canvas.height = height;
    schematic.layers.forEach((layer) => {
      draw(ctx,layer);
    });
    callback(canvas.toDataURL());
  }
  MondrianSVG.newSchematic = newSchematic;
  MondrianSVG.newLayer = newLayer;
  return MondrianSVG;
});
