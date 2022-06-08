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
    'cave-floor',
    'cave-wall',
    'cement-corner',
    'cement-edge',
    'cement-wall',
    'diamond-tile-floor',
    'door',
    'double-brazier',
    'locked-door',
    'one-way-door',
    'shallow-water',
    'sigil-floor-tile',
    'square-bubble-floor',
    'stairs-door',
    'stairs-down',
    'statue',
    'suit-of-armor',
    'tile-floor',
  ];
  window.listTiles = function () {
    tileList.sort();
    return tileList;
  };
})();
