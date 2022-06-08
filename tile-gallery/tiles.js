(function () {
  let tileList = [
    'alternating-brick-floor',
    'brazier-half-door',
    'brick-corner',
    'brick-edge',
    'brick-wall',
    'bubble-floor',
    'door',
    'double-brazier',
    'shallow-water',
    'square-bubble-floor',
    'tile-floor',
  ];
  window.listTiles = function () {
    tileList.sort();
    return tileList;
  };
})();
