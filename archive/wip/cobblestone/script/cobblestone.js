(function(){
  window[registryName].apply('Cobblestone',
  ['PaletteUI','PixelCanvas','GridTransformer','PixelPainter','TileParser'],
  function(PaletteUI,PixelCanvas,GridTransformer,PixelPainter,TileParser){
    var tileParser = new TileParser(16,16);
    return function(instanceName,dlButtonId,tileListId,tileCanvasId,paletteListId,
    paletteId,tfTileListId,tfPaletteListId,tfCanvasId,tfWarningId,tfLabelId,addTfId,
    listedTransformsId,transformListId) {
      var paletteUI = new PaletteUI(instanceName,paletteId,"colorSelect","color");
      var pixelCanvas = new PixelCanvas(instanceName,tileCanvasId,16,16,6);
      var pixelPainter = new PixelPainter(10,false);
      var gridTf = new GridTransformer(16,16);
      var ui = {};
      var data = {
        tiles:{},
        palettes:{},
        transforms:{}
      };
      var me = this;
      this.init = function() {
        ui.dlBtn = document.getElementById(dlButtonId);
        ui.tileList = document.getElementById(tileListId);
        ui.tileCanvas = document.getElementById(tileCanvasId);
        ui.paletteList = document.getElementById(paletteListId);
        ui.palette = document.getElementById(paletteId);
        ui.tfTileList = document.getElementById(tfTileListId);
        ui.tfPaletteList = document.getElementById(tfPaletteListId);
        ui.tfCanvas = document.getElementById(tfCanvasId);
        ui.tfWarning = document.getElementById(tfWarningId);
        ui.tfLabel = document.getElementById(tfLabelId);
        ui.addTf = document.getElementById(addTfId);
        ui.listedTransforms = document.getElementById(listedTransformsId);
        ui.transformList = document.getElementById(transformListId);
        
        pixelPainter.setCanvas(ui.tfCanvas);
      };
      var parseTile = function() {}
      this.loadData = function(input) {
        loadFile(input,function(result){
          var temp = JSON.parse(result);
          if (Array.isArray(temp)) {
            temp = {
              tiles:temp[0],
              palettes:temp[1],
              transforms:temp[2]
            }
          }
          data.palettes = temp.palettes;
          data.transforms = temp.transforms;
          data.tiles = Object.keys(temp.tiles).reduce(function(out, tileName) {
            var tile = temp.tiles[tileName];
            if ("string" == (typeof tile)) {
              out[tileName] = tileParser.parse(tile);
            } else {
              out[tileName] = tile;
            }
            return out;
          }, {})
        });
      }
      var applyTile = function(name) {
        pixelCanvas.applyGrid(data.tiles[name]);
        var palette = data.palettes[ui.paletteList.value];
        if (!palette) {
          alert("Please select a palette to display grid");
        } else {
          pixelCanvas.init(palette);
        }
      }
      this.selectTile = function(selector) {
        applyTile(selector.value);
      }
      var pickName = function(colName,label) {
        var name = prompt("Enter the name of the new " + label + ".");
        if (name) {
          if (data[colName][name]) {
            return pickName(colName,label);
          } else {
            return name;
          }
        } else {
          return pickName(colName,label);
        }
      }
      var makeList = function(uiList,colName,name) {
        uiList.innerHTML = Object.keys(data[colName]).map(function(itemName) {
          var selected = (itemName == name)?' selected="true"':"";
          return '<option' + selected + ' value="' + itemName + '">' + itemName + '</option>';
        }).join("");
      }
      var listTiles = function(name) {
        makeList(ui.tileList,"tiles",name);
        me.selectTile(ui.tileList);
        makeList(ui.tfTileList,"tiles",ui.tfTileList.value);
      }
      var listPalettes = function(name) {
        makeList(ui.paletteList,"palettes",name);
        me.selectPalette(ui.paletteList);
        makeList(ui.tfPaletteList,"palettes",ui.tfPaletteList.value);
      }
      this.addNewTile = function() {
        var name = pickName("tiles","tile");
        data.tiles[name] = {};
        listTiles(name);
        applyTile(name);
      }
      this.removeCurrentTile = function() {
        delete data.tiles[ui.tileList.value];
        listTiles();
      }
      this.transform = function(tfType) {
        pixelCanvas.transform(tfType);
        data.tiles[ui.tileList.value] = pixelCanvas.getGrid();
      }
      var applyPalette = function(name) {
        paletteUI.init();
        paletteUI.applyPalette(data.palettes[name]);
        var tile = data.tiles[ui.tileList.value];
        if (!tile) {
          alert("Please select a tile to display grid");
        } else {
          pixelCanvas.applyGrid(tile);
          pixelCanvas.init(data.palettes[name]);
        }
      }
      this.selectPalette = function(selector) {
        applyPalette(selector.value);
      }
      this.addNewPalette = function() {
        var name = pickName("palettes","palette");
        data.palettes[name] = ["#ffffff"];
        listPalettes(name);
        applyPalette(name);
      }
      this.removeCurrentPalette = function() {
        delete data.palettes[ui.paletteList.value];
        listPalettes();
        paletteUI.applyPalette(data.palettes[ui.paletteList.value]);
      }
      this.activate = function(value) {
        paletteUI.activate(value);
      }
      this.updateColor = function(value,index) {
        data.palettes[ui.paletteList.value][index] = value;
        paletteUI.updateColor(value, index);
        pixelCanvas.redraw(paletteUI.getPalette());
      }
      this.addColor = function() {
        paletteUI.addColor();
      }
      this.setColor = function(x, y) {
        var color = paletteUI.getActiveIndex();
        pixelCanvas.setColor(x,y,color);
        data.tiles[ui.tileList.value] = pixelCanvas.getGrid();
        pixelCanvas.redraw(paletteUI.getPalette());
      }
      this.transform = function(tfType) {
        pixelCanvas.transform(tfType);
        data.tiles[ui.tileList.value] = pixelCanvas.getGrid();
        pixelCanvas.redraw(paletteUI.getPalette());
      }
      var buildLabel = function() {
        var tfs = Array.from(document.getElementsByName("applyTf"))
        .filter((e) => e.checked)
        .map((e) => e.value);
        var tile = ui.tfTileList.value;
        var palette = ui.tfPaletteList.value
        var label = tile + "|" + palette + "|" + tfs.join("|");
        return label;
      }
      var drawTransform = function(label) {
        tfLabel.innerHTML = label;
        if (data.transforms[label]) {
          tfWarning.style.display = "block";
          addTf.disabled = true;
        } else {
          tfWarning.style.display = "none";
          addTf.disabled = true;
        }
        var tfs = label.split("|");
        var tile = tfs.shift();
        var palette = tfs.shift();
        var grid = tfs.reduce((out,tf) => gridTf.transformGrid(tf,out), 
          data.tiles[tile]);
        pixelPainter.paint(16,16,grid,data.palettes[palette]);
      }
      this.selectTfTile = function() {
        drawTransform(buildLabel());
      }
      this.selectTfPalette = function() {
        drawTransform(buildLabel());
      }
      this.applyTransform = function() {
        drawTransform(buildLabel());
      }
      this.addTransform = function() {
        var label = tfLabel.innerHTML;
        data.transforms[label] = true;
        makeList(ui.transformList,"transforms");
        ui.listedTransforms.innerHTML = Object.keys(data.transforms).map(function(key) {
          return '<li><input type="radio" name="tfListItem" onChange="' + instanceName + '.selectTransform(this.value)" value="' + label + '">' + label + '</input></li>';
        });
      }
      this.selectTransform = function(value) {
        drawTransform(value);
      }
    }
  })
})()