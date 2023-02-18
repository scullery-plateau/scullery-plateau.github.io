namespace('sp.overlander.TileCanvas',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const points = [[26,2], [74,2], [98,43.3], [74,84.6], [26,84.6], [2,43.3]];
  const drawHex = function() {
    const path = new Path2D();
    const [firstX,firstY] = points[0];
    const rest = points.slice(1);
    path.moveTo(firstX || 0, firstY || 0);
    rest.forEach(([x,y]) => {
      path.lineTo(x || 0, y || 0);
    })
    path.closePath();
    return path;
  }
  const initState = function(url,filename) {
    return {
      url,
      filename,
      frameColor: '#000000',
      backgroundColor: undefined,
      scale: 1,
      xOffset: 0,
      yOffset: 0,
      label: ""
    }
  }
  const drawCanvasURL = function(img,tile) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext('2d');

  }
  return { initState, drawCanvasURL };
});