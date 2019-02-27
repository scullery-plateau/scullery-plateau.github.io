(function() {
  window[registryName].apply('Rectangle',[],function() {
    return function() {
      
      this.draw = function(ctx) {
        
      }
    }
  });

  window[registryName].apply('ShapeFactory', ['Rectangle', 'Circle'], function(Rectangle, Circle) {
    return function() {
      return {
        build:function(instruction) {
          return 
        }
      }
    }
  });

  window[registryName].apply('ImageBuilder',['ShapeFactory'],function(ShapeFactory) {
    return function(canvasId,imgId) {
      
      var ui = {};
      
      var state = {};
      
      this.init = function() {
        
        ui.img = document.getElementById(imgId);
        
        ui.canvas = document.getElementById(canvasId);
        
        ui.ctx = ui.canvas.getContext('2d');

      }
      
      this.setSize = function(width, height) {
        state.width = width;
        state.height = height;
      }
      
      this.clear = function() {
        ui.ctx.clearRect(0, 0, state.width, state.height);
      }
      
      this.draw = function(instructions) {
        instructions.forEach(function(i) {
          ShapeFactory().build(i).draw(ui.ctx);
        });
      }
    }
  });
})()