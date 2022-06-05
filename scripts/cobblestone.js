(function () {
  let tileDim = 30;
  let tileTransforms = {
    flipDown: `matrix(1 0 0 -1 0 ${tileDim})`,
    flipOver: `matrix(-1 0 0 1 ${tileDim} 0)`,
    turnLeft: `rotate(-90,${tileDim / 2},${tileDim / 2})`,
    turnRight: `rotate(90,${tileDim / 2},${tileDim / 2})`,
  };
  let tileTransformExcludes = {
    turnLeft: 'turnRight',
    turnRight: 'turnLeft',
  };
  let dimensionsByOrientation = {
    portrait: {
      width: 8,
      height: 10,
    },
    landscape: {
      width: 10,
      height: 8,
    },
  };
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
  window.initCobblestone = function (
    portraitRadioId,
    landscapeRadioId,
    tileSetId,
    canvasId,
    tileImageDefsId,
    fileLoadInputId,
    imageLoadInputId,
    aboutId,
    imageDownloadPopupId,
    imgDlScaleId,
    imgDlCanvasId,
    imgDlFileNameId,
    imgDlLinkId,
    imgDlDisplayId
  ) {
    let data = {
      images: {},
      tiles: {},
      placements: {},
      orientation: 'portrait',
    };
    let selectedTile = [];
    let getTileID = function (filename, tf) {
      return [filename].concat(tf.split(',')).join('.');
    };
    let svgTF = function (tf) {
      return tileTransforms[tf];
    };
    let drawTileTFDef = function (filename, tf) {
      let tfs = tf.split(',').map(svgTF);
      let transform = '';
      if (tfs.length > 0) {
        transform = `transform="${tfs.join(' ')}"`;
      }
      return `<image id="${getTileID(filename, tf)}" xlink:href="${
        data.images[filename]
      }" width="${tileDim}" height="${tileDim}" ${transform}/>`;
    };
    let drawTileDef = function ([filename, transforms]) {
      console.log('drawTileDef');
      return Object.keys(transforms)
        .map((tf) => {
          return drawTileTFDef(filename, tf);
        })
        .join('');
    };
    let drawTileDefs = function () {
      console.log('drawTileDefs');
      let content = Object.entries(data.tiles).map(drawTileDef).join('');
      console.log('drawTileDefs drawing svg');
      let svg = `<svg width="0" height="0"><defs>${content}</defs></svg>`;
      document.getElementById(tileImageDefsId).innerHTML = svg;
    };
    let selectTile = function (filename, tf) {
      if (selectedTile.length == 2) {
        console.log(selectedTile);
        document
          .getElementById(`btn.${getTileID(selectedTile[0], selectedTile[1])}`)
          .classList.remove('selected-tile');
      }
      selectedTile = [filename, tf];
      document
        .getElementById(`btn.${getTileID(filename, tf)}`)
        .classList.add('selected-tile');
    };
    let editTile = function (filename, tf) {
      // todo
    };
    let buildTileButton = function (filename, tf) {
      let button = document.createElement('button');
      button.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${tileDim} ${tileDim}"><use href="#${getTileID(
        filename,
        tf
      )}"></svg>`;
      button.setAttribute('id', `btn.${getTileID(filename, tf)}`);
      button.setAttribute(
        'class',
        'tile m-2 p-0' +
          (selectedTile[0] == filename && selectedTile[1] == tf
            ? ' selected-tile'
            : '')
      );
      button.setAttribute(
        'title',
        'click to select, double click or right click to edit'
      );
      button.addEventListener('click', () => {
        selectTile(filename, tf);
      });
      button.addEventListener('dblclick', () => {
        editTile(filename, tf);
      });
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        editTile(filename, tf);
      });
      return button;
    };
    let drawTileButtons = function () {
      console.log('drawTileButtons');
      let tileButtons = document.getElementById(tileSetId);
      tileButtons.innerHTML = '';
      Object.entries(data.tiles).forEach(([filename, transforms]) => {
        Object.keys(transforms).forEach((tf) => {
          tileButtons.appendChild(buildTileButton(filename, tf));
        });
      });
    };
    let drawTiles = function () {
      console.log({
        images: data.images,
        tiles: data.tiles,
      });
      drawTileDefs();
      drawTileButtons();
      console.log('completed drawing tiles');
    };
    let paintCanvas = function () {
      console.log({
        placements: data.placements,
        orientation: data.orientation,
      });
      // todo -
    };
    let validateLoadFileJson = function (data) {
      // todo - call validation
    };
    let loadFileResultsAsJsonData = function (results, filename) {
      let jsonData = JSON.parse(results);
      let error = validateLoadFileJson(jsonData);
      if (error) {
        throw error;
      }
      ['images', 'tiles', 'placements', 'orientation'].forEach((field) => {
        data[field] = jsonData[field];
      });
      drawTiles();
      paintCanvas();
    };
    let loadImageAsDataURL = function (results, filename) {
      data.images[filename] = results;
      data.tiles[filename] = { '': true };
      drawTiles();
      selectTile(filename, '');
      paintCanvas();
    };
    let processFileLoadError = function (filename, error) {
      // todo -
    };
    window.loadFile = function (e) {
      arbitrateEvent(e);
      document.getElementById(fileLoadInputId).click();
    };
    window.loadFiles = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'text',
        loadFileResultsAsJsonData,
        processFileLoadError
      );
    };
    window.downloadFile = function (e) {
      arbitrateEvent(e);
      alert('Download File is not yet implemented');
    };
    window.showImageDownload = function (e) {
      arbitrateEvent(e);
      alert('Download Image is not yet implemented');
    };
    window.showPrintable = function (e) {
      arbitrateEvent(e);
      alert('Publish Printable is not yet implemented');
    };
    window.addImage = function (e) {
      arbitrateEvent(e);
      document.getElementById(imageLoadInputId).click();
    };
    window.loadImages = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'dataURL',
        loadImageAsDataURL,
        processFileLoadError
      );
    };
    window.showTileTransform = function (e) {
      arbitrateEvent(e);
      alert('Transform Tile is not yet implemented');
    };
    window.removeTile = function (e) {
      arbitrateEvent(e);
      alert('Remove Selected Tile is not yet implemented');
    };
    window.showAbout = function (e) {
      arbitrateEvent(e);
      alert('About is not yet implemented');
    };
    window.setOrientation = function (radioButton) {
      data.orientation = radioButton.value;
      drawTiles();
      paintCanvas();
    };
  };
})();
