(function () {
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
  window.initCobblestone = function () {
    let data = {
      images: [],
      tiles: [],
      placements: [],
    };
    window.loadFile = function (e) {
      arbitrateEvent(e);
      alert('Load File is not yet implemented');
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
      alert('Add Image is not yet implemented');
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
    window.setOrientation = function (radioButton) {};
  };
})();
