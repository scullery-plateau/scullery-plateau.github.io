namespace('sp.mondrian.MondrianSVG',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const shapes = {
    rect:{
      args:{},
      init:function(defaults) {
        return {};
      },
      render:function(layer) {
        return <></>;
      },
      draw:function(ctx,layer) {

      }
    },
    circle:{
      args:{},
      init:function(defaults) {
        return {};
      },
      render:function(layer) {
        return <></>;
      },
      draw:function(ctx,layer) {
        
      }
    },
    ellipse:{
      args:{},
      init:function(defaults) {
        return {};
      },
      render:function(layer) {
        return <></>;
      },
      draw:function(ctx,layer) {

      }
    },
    polygon:{
      args:{},
      init:function(defaults) {
        return {};
      },
      render:function(layer) {
        return <></>;
      },
      draw:function(ctx,layer) {

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
