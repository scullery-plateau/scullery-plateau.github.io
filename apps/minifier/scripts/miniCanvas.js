namespace("sp.minifier.MiniCanvas",{ 
  'sp.common.CanvasUtil':'CanvasUtil',
  'sp.common.Utilities':'util',
},({ CanvasUtil, util }) => {
  const initState = function(dataURL,filename,count) {
    return {
      dataURL,
      filename,
      count,
      scale: 400,
      xOffset: 0,
      yOffset: 0
    }
  }
  const dim = 0.1;
  const drawCanvasURL = function(img, mini, size) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext('2d');
    const dimObj = CanvasUtil.getConstants(dim);
    c.width = dimObj.width;
    c.height = dimObj.height;

    // img math
    const imgDim = Math.max(img.width,img.height);
    const imgScale = imgDim / (dimObj.d * mini.scale);
    const [iw, ih] = [img.width,img.height].map((d) => (d * imgScale));
    const [icx, icy] = [iw, ih].map((d) => (d / 2));
    const [ix, iy] = [dimObj.cx + mini.xOffset - icx, dimObj.cy + mini.yOffset - icy]

    CanvasUtil.drawImage(ctx, dimObj, img, ix, iy, iw, ih, util.merge(mini, size));

    // closePath is useless here
    //ctx.closePath();
    return c.toDataURL();
  }
  return { initState, drawCanvasURL };
});