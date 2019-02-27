(function(){
  window[registryName].apply('PaletteBar',[],function() {
    return function(instanceName,paletteId,paletteBarId,colorSelectPrefix,colorPrefix) {
    
      var state = {
        palette:["#ffffff"],
        activeColor:0
      };
      
      var displayPalette = function() {
        state.paletteUI.innerHTML = [{
          tag:"label",
          attrs:{
            for:"colorSelect0"
          },
          content:[" Background Color: "]
        },{
          tag:"input",
          attrs:{
            type:"color",
            name:"palette",
            id:"color0",
            value:state.palette[0],
            onChange:instanceName + ".updateColor(this.value,0)"
          }
        },{
          tag:"ol",
          content:state.palette.slice(1).map(function(c,i){
            var index = i + 1;
            var colorSelect = colorSelectPrefix + index;
            var colorId = colorPrefix + index;
            return {
              tag:"li",
              content:[{
                tag:"label",
                attrs: {for:colorSelect},
                content:[" Color " + index + ": "]
              },{
                tag:"input",
                attrs:{
                  type:"color",
                  name:"palette",
                  id:colorId,
                  value:c,
                  onChange:instanceName + ".updateColor(this.value," + index + ")"
                }
              },{
                tag:"button",
                attrs:{onClick:instanceName+".removeColor("+index+")"},
                content:[{
                  tag:"svg",
                  attrs:{
                    width:"15px",
                    height:"15px",
                    viewBox:"0 0 30 30"
                  },
                  content:[{
                    tag:"rect",
                    attrs:{
                      width:30,
                      height:30,
                      "stroke-width":6,
                      stroke:"red",
                      fill:"none"
                    }
                  },{
                    tag:"line",
                    attrs:{
                      x1:0,
                      y1:0,
                      x2:30,
                      y2:30,
                      "stroke-width":3,
                      stroke:"red",
                      fill:"none"
                    }
                  },{
                    tag:"line",
                    attrs:{
                      x1:0,
                      y1:30,
                      x2:30,
                      y2:0,
                      "stroke-width":3,
                      stroke:"red",
                      fill:"none"
                    }
                  }]
                }]
              }]
            };
          })
        }].map(JSON.toXML).join("");
      }
      
      var displayBar = function() {
        state.paletteBar.innerHTML = Array.from(state.palette).map(function(color, index) {
          return JSON.toXML({
            tag:"button",
            attrs:{
              class:"paletteBar",
              onclick:instanceName + ".activate(" + index + ")"
            },
            content:[{
              tag:"svg",
              attrs:{
                width:"4em",
                height:"2em",
                viewBox:"0 0 20 10"
              },
              content:[{
                tag:"rect",
                attrs:{
                  width:20,
                  height:10,
                  fill:color,
                  stroke:"black",
                  "stroke-width":1
                }
              }]
            }]
          });
        }).join("");
      }
      
      this.init = function(){
        state.paletteUI = document.getElementById(paletteId);
        state.paletteBar = document.getElementById(paletteBarId);
        displayPalette();
        displayBar();
      }
      
      this.activate = function(index) {
        state.activeColor = parseInt("" + index);
      }
      
      this.removeColor = function(index) {
        state.palette.splice(index,1);
        displayPalette();
        displayBar();
      }
      
      this.updateColor = function(color, index) {
        state.palette[index] = color;
        displayBar();
      }
      
      this.addColor = function() {
        state.activeColor = state.palette.length;
        state.palette.push("#ffffff");
        displayPalette();
        displayBar();
      }
      
      this.getActiveIndex = function() {
        return state.activeColor;
      }
      
      this.getActiveColor = function() {
        return state.palette[state.activeColor];
      }
      
      this.getColor = function(index) {
        return state.palette[index];
      }
      
      this.colorCount = function() {
        return state.palette.length;
      }
      
      this.getPalette = function() {
        return Array.from(state.palette).map((c) => c);
      }
      
      this.applyPalette = function(palette) {
        state.palette = Array.from(palette).map((c) => c);
        displayPalette();
      }
    }
  })
})()