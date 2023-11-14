namespace("sp.common.GridHighlighter",{}, ({}) => {
  const radix = 32;
  const getPixelId = function(x, y) {
    return [x, y].map((i) => i.toString(radix).toUpperCase()).join('x');
  }
  const parsePixelId = function(id){
    let [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y }
  }
  const minMaxStartEnd = function(startId, endId) {
    const { x: startX, y: startY } = parsePixelId(startId);
    const { x: endX, y: endY } = parsePixelId(endId);
    const minX = Math.min(startX, endX); 
    const minY = Math.min(startY, endY); 
    const maxX = Math.max(startX, endX); 
    const maxY = Math.max(startY, endY); 
    return { minX, minY, maxX, maxY };
  }
  const highlight = function(squareSize, highlighterFrameId, outlineColor, outlineWidth, startId, endId) {
    const { minX: minColumn, minY: minRow, maxX: maxColumn, maxY: maxRow } = minMaxStartEnd(startId, endId);
    const rowCount = (1 + maxRow - minRow);
    const columnCount = (1 + maxColumn - minColumn);
    const [ x, y, width, height ] = [ minColumn, minRow, columnCount, rowCount ].map((n) => n * squareSize);
    document.getElementById(highlighterFrameId).innerHTML = `<rect x="${x}" y="${y}" width="${width}" height="${height}" droptarget="true" fill="none" stroke="${outlineColor}" stroke-width="${outlineWidth}"/>`;
  }
  const togglePerStart = function(startId, endId, onDrop) {
    const { minX, minY, maxX, maxY } = minMaxStartEnd(startId, endId);
    const ids = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const id = getPixelId(x,y);
        if (id != startId) {
          ids.push(id);
        }
      }
    }
    onDrop(startId, ids);
  }
  const hasAttribute = function(target, attrVal) {
    return (target.attributes.getNamedItem(attrVal))?true:false;
  }
  const isDraggable = function(target) {
    return hasAttribute(target, "draggable");
  }
  const isDropTarget = function(target) {
    return hasAttribute(target, "droptarget");
  }
  return { 
    init: function({squareSize, highlighterFrameId, outlineColor, outlineWidth, allowDragEvents, onDrop, onOutOfBounds}) {
      const dragState = {};
      document.addEventListener("mousedown",(e) => {
        if (allowDragEvents() && isDraggable(e.target)) {
          delete dragState.endId;
          dragState.drag = true;
          dragState.startId = e.target.id;
        }
      });
      document.addEventListener("mousemove",(e) => {
        if (allowDragEvents() && dragState.drag) {
          const endId = (e.target.id === ''?dragState.endId:e.target.id);
          if (dragState.endId != endId && dragState.startId != endId) {
            dragState.endId = endId;
            highlight(squareSize, highlighterFrameId, outlineColor, outlineWidth, dragState.startId, dragState.endId);
          }
        }
      });
      document.addEventListener("mouseup",(e) => {
        if(allowDragEvents() && dragState.drag && dragState.endId && dragState.endId != dragState.startId) {
          togglePerStart(dragState.startId, dragState.endId, onDrop);
        }
        delete dragState.drag;
        delete dragState.startId;
        delete dragState.endId;
        document.getElementById(highlighterFrameId).innerHTML = "";
      });
      document.addEventListener("mouseout",(e) => {
        if (allowDragEvents() && dragState.drag && isDropTarget(e.target) && !isDropTarget(e.relatedTarget)) {
          onOutOfBounds();
          delete dragState.drag;
          delete dragState.startId;
          delete dragState.endId;
          document.getElementById(highlighterFrameId).innerHTML = "";
        }
      });
    }
  };
})