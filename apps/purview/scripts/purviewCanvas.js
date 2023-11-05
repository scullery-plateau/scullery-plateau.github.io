namespace('sp.purview.PurviewCanvas',{
  'sp.common.CanvasUtil':'CanvasUtil'
},({ CanvasUtil }) => {
  const drawCanvasURL = function(canvasId, img, details, frame) {
    console.log({ canvasId, img, details, frame });
    const dimObj = CanvasUtil.getConstants(Math.max(frame.ratioW, frame.ratioH));
    const c = document.getElementById(canvasId);
    const ctx = c.getContext('2d');
    details.drawType = "rect";
    CanvasUtil.drawImage(ctx, dimObj, img, details.frameX, details.frameY, details.frameWidth, details.frameHeight, frame);
  }
  return { drawCanvasURL };
})