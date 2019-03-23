(function(){
  var lineItem = function(color) {
    if (color) {
      return `<span style="color:${color};background-color:${color};">___</span>`;
    } else {
      return `<span>___</span>`;
    }
  }
  var paletteOption = function(option,paletteName) {
    option.text = paletteName;
    option.value = paletteName;
  }
  var colorOption = function(option,color,index) {
    if (color) {
      option.value = index;
      option.text = color;
    } else {
      option.value = index;
      option.text = "Transparent";
    }
  }
  registry.apply("Palette",[
    "Selector"
  ],function(Selector){
    return function(palettes,ui){
      var updateColorSelector = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette) {
          Selector.loadSelector(ui.colorSelector,palettes[selectedPalette],"Choose a color to change:",colorOption);
          Selector.selectLast(ui.colorSelector);
          ui.paletteDisplay.innerHTML = Object.entries(palettes).map(function(entry) {
            var paletteName = entry[0];
            var palette = entry[1].map(lineItem).join(" ");
            return `<li>${paletteName}: ${palette}</li>`;
          }).join("");
        }
      }
      var updatePaletteLists = function() {
        Selector.loadSelector(ui.paletteSelector,Object.keys(palettes),"Choose a palette to edit:",paletteOption);
        Selector.selectLast(ui.paletteSelector);
        Selector.loadSelector(ui.tilePaletteSelector,Object.keys(palettes),"Choose a palette:",paletteOption);
        Selector.loadSelector(ui.paletteForMapSelector,Object.keys(palettes),"Choose a palette:",paletteOption);
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
        if (selectedPalette) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex) {
            ui.colorPicker.value = palettes[selectedPalette][selectedPaletteIndex];
          } else {
            ui.colorPicker.value = undefined;
          }
        }
      }
      this.addColor = function() {
        console.log("clicked");
        console.log(ui.colorPicker.value);
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette) {
          console.log("adding color to palette.")
          palettes[selectedPalette].push(ui.colorPicker.value);
          updateColorSelector();
        }
      }
      this.updateColor = function() {
        console.log("clicked");
        console.log(ui.colorPicker.value);
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex) {
            console.log("changing color in palette: " + selectedPaletteIndex);
            palettes[selectedPalette][selectedPaletteIndex] = ui.colorPicker.value;
            updateColorSelector();
          }
        }
      }
      this.makeColorTransparent = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex) {
            palettes[selectedPalette][selectedPaletteIndex] = null;
            updateColorSelector();
          }
        }
      }
      this.removeSelectedColorFromPalette = function() {
        var selectedPalette = Selector.selectedValue(ui.paletteSelector);
        if (selectedPalette) {
          var selectedPaletteIndex = Selector.selectedValue(ui.colorSelector);
          if (selectedPaletteIndex) {
            palettes[selectedPalette].splice(selectedPaletteIndex,1);
            updateColorSelector();
          }
        }
      }
    };
  });
})();
