(function(){
  window[registryName].apply('PaletteUI',[],function() {
    return function(instanceName,paletteId,colorSelectPrefix,colorPrefix) {
    
      var state = {
        palette:["#ffffff"],
        activeColor:0
      };
      
      var displayPalette = function() {
        state.paletteUI.innerHTML = [{
          tag:"input",
          attrs:{
            type:"radio",
            name:"colors",
            id:"colorSelect0",
            value:0,
            checked:true,
            onChange:instanceName + ".activate(this.value)"
          }
        },{
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
                tag:"input",
                attrs:{
                  type:"radio",
                  name:"colors",
                  id:colorSelect,
                  value:index,
                  checked:true,
                  onChange:instanceName + ".activate(this.value)"
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
              },{
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
              }]
            };
          })
        }].map(JSON.toXML).join("");
      }
      
      this.init = function(){
        state.paletteUI = document.getElementById(paletteId);
        displayPalette();
      }
      
      this.activate = function(index) {
        state.activeColor = parseInt("" + index);
      }
      
      this.removeColor = function(index) {
        state.palette.splice(index,1);
        displayPalette();
      }
      
      this.updateColor = function(color, index) {
        state.palette[index] = color;
      }
      
      this.addColor = function() {
        state.activeColor = state.palette.length;
        state.palette.push("#ffffff");
        displayPalette();
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