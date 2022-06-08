(function () {
  let tileList = [
    'alternating-brick-floor',
    'brazier-half-door',
    'brick-corner',
    'brick-edge',
    'brick-wall',
    'bubble-floor',
    'cave-corner',
    'cave-edge',
    'cave-wall',
    'door',
    'double-brazier',
    'locked-door',
    'one-way-door',
    'shallow-water',
    'square-bubble-floor',
    'stairs-door',
    'stairs-down',
    'statue',
    'tile-floor',
  ];
  window.listTiles = function () {
    tileList.sort();
    return tileList;
  };
})();
