namespace("sp.tokenizer.TokenCanvas",{
  'sp.common.CanvasUtil':'CanvasUtil'
},({ CanvasUtil }) => {
  const initState = function(url,filename,copyCount) {
      return {
        url,
        filename,
        copyCount,
        frameColor: '#FF0000',
        backgroundColor: '#000000',
        isTransparent: true,
        scale: 1,
        frameWidth: 1,
        sideCount: 2,
        xOffset: 0,
        yOffset: 0
      }
  }
  const applyDrawType = function(token) {
    const n = token.sideCount;
    if (n > 2 && n < 50) {
      token.drawType = "poly";
    } else {
      token.drawType = "circle";
    }
  }
  const dim = 500;
  const drawCanvasURL = function(img,token) {
    applyDrawType(token);
    const c = document.getElementById("canvas");
    const ctx = c.getContext('2d');
    const dimObj = CanvasUtil.getConstants(dim);
    c.width = dimObj.width;
    c.height = dimObj.height;

    // img math
    const imgDim = Math.max(img.width,img.height);
    const imgScale = token.scale * dim / imgDim;
    const [iw, ih] = [img.width,img.height].map((d) => (d * imgScale));
    const [icx, icy] = [iw, ih].map((d) => (d / 2));
    const [ix, iy] = [dimObj.cx + token.xOffset - icx, dimObj.cy + token.yOffset - icy]

    // default gCO is source-over
    if (!token.isTransparent) {
      CanvasUtil.fillShape(ctx, dimObj, token);
    }

    CanvasUtil.drawImage(ctx, img, ix, iy, iw, ih, token);

    CanvasUtil.strokeShape(ctx, dimObj, token);

    // closePath is useless here
    //ctx.closePath();
    return c.toDataURL();
  }
  return { initState, drawCanvasURL };
});