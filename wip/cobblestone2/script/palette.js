(function(){
  var lineItem = function(color,instanceName) {
    return `<li><a href="#" onclick="${instanceName}.removeColor()" style="display:block;background-color:${color};">${color}</a></li>`;
  }
  var paletteOption = function(option,paletteName) {
    option.text = paletteName;
    option.value = paletteName;
  }
  var colorOption = function(option,color,index) {
    if (color.length) {
      option.value = index;
      option.text = "_";
      option.style.backgroundColor = color;
    } else {
      option.value = index;
      option.text = "Transparent";
      option.style.backgroundColor = "none";
    }
  }
  registry.apply("Palette",[
    "Selector"
  ],function(Selector){
    return function(instanceName,palettes,ui){
      var updateColorSelector = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette.length == 0) {
          Selector.loadSelector(ui.colorSelector,palettes[selectedPalette],"Add a color!",colorOption);
          Selector.selectLast(ui.colorSelector);
        }
      }
      var updatePaletteLists = function() {
        Selector.loadSelector(ui.paletteSelector,Object.keys(palettes),"Choose a palette:",paletteOption);
        Selector.selectLast(ui.paletteSelector);
        Selector.loadSelector(ui.tilePaletteSelector,Object.keys(palettes),"Choose a palette:",paletteOption);
        Selector.selectLast(ui.tilePaletteSelector);
        Selector.loadSelector(ui.paletteForMapSelector,Object.keys(palettes),"Choose a palette:",paletteOption);
        Selector.selectLast(ui.paletteForMapSelector);
        updateColorSelector();
      }
      this.updatePaletteLists = updatePaletteLists;
      this.selectAndDrawPalette = updateColorSelector;
      this.addPalette = function() {
        var paletteName = prompt("What do you want to name this palette?");
        if (palettes[paletteName]) {
          alert("There is already a palette named '" + paletteName + "'.");
        } else {
          palettes[paletteName] = [];
          updatePaletteLists();
        }
      }
      this.selectColorForEditing = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette.length == 0) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex.length == 0) {
            ui.colorPicker.value = palettes[selectedPalette][selectedPaletteIndex];
          } else {
            ui.colorPicker.value = none;
          }
        }
      }
      this.addOrUpdateColor = function() {
        console.log("clicked");
        console.log(ui.colorPicker.value);
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette.length == 0) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex.length == 0) {
            console.log("changing color in palette: " + selectedPaletteIndex);
            palettes[selectedPalette][selectedPaletteIndex] = ui.colorPicker.value;
          } else {
            console.log("adding color to palette.")
            palettes[selectedPalette].push(ui.colorPicker.value);
          }
          updateColorSelector();
        }
      }
      this.addOrUpdateColor = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette.length == 0) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex.length == 0) {
            palettes[selectedPalette][selectedPaletteIndex] = "";
          } else {
            palettes[selectedPalette].push("");
          }
          updateColorSelector();
        }
      }
      this.removeSelectedColorFromPalette = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette.length == 0) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex.length == 0) {
            palettes[selectedPalette].splice(selectedPaletteIndex,1);
          }
          updateColorSelector();
        }
      }
    };
  });
})();
