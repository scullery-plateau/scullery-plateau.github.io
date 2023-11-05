namespace('sp.purview.PurviewCanvas',{
  'sp.common.CanvasUtil':'CanvasUtil'
},({ CanvasUtil }) => {
  const drawCanvasURL = function(canvasId, img, details) {
    const c = document.getElementById(canvasId);
    const ctx = c.getContext('2d');
    details.drawType = "rect";
    CanvasUtil.drawImage(ctx, img, details.frameX, details.frameY, details.frameWidth, details.frameHeight, details);
  }
  return { drawCanvasURL };
})