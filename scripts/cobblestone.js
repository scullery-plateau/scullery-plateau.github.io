(function () {
  let tileTransforms = ['flipOver','flipDown','turnLeft','turnRight'];
  let tileTransformExcludes = {
    'turnLeft':'turnRight',
    'turnRight':'turnLeft'
  };
  let dimensionsByOrientation = {
    portrait:{
      width:8,
      height:10
    },
    landscape:{
      width:10,
      height:8
    }
  }
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
  window.initCobblestone = function () {
    let data = {
      images: {},
      tiles: {},
      placements: {},
      orientation: 'portrait',
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
      ['images','tiles','placements','orientation'].forEach(
        (field) => {
          data[field] = jsonData[field];
        }
      );
      // todo - re-draw tiles and canvas
    }
    let loadImageAsDataURL = function (results, filename) {
      data.images[filename] = results;
      data.tiles[filename] = {"":true};
      // todo - re-draw tiles and canvas
    }
    let processFileLoadError = function (filename, error) {
      // todo - 
    };
    window.loadFile = function (e) {
      arbitrateEvent(e);
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
      // todo - re-draw tiles and canvas
    };
  };
})();
