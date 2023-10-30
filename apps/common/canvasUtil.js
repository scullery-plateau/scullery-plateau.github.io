namespace("sp.common.CanvasUtil",{},({}) => {
  const getConstants = function(dim) {
    const [width, height, cx, cy, r, d, lineWidthMult] = [dim, dim, dim / 2, dim / 2, dim / 2, dim, 5];
    return { width, height, cx, cy, r, d, lineWidthMult };
  }
  const drawCircle = function(ctx,dimObj,{ frameWidth }) {
      ctx.arc(dimObj.cx, dimObj.cy, dimObj.r - 1 - ( dimObj.lineWidthMult * frameWidth / 2 ), 0, Math.PI*2);
  }
  const drawPoly = function(ctx,dimObj,{ sideCount }) {
      const a = (Math.PI * 2) / sideCount;
      const first = a / 2;
      const points = Array(sideCount)
        .fill(0)
        .map((e, i) => {
          let ai = first + a * i;
          return [
            dimObj.cx + dimObj.r * Math.sin(ai),
            dimObj.cy + dimObj.r * Math.cos(ai),
          ];
        });
      const last = points[points.length - 1];
      ctx.moveTo(last[0],last[1]);
      points.forEach(([x,y]) => {
        ctx.lineTo(x,y);
      });
      ctx.closePath();
  }
  const drawRect = function( ctx, { cx, cy, d, lineWidthMult }, { ratioW, ratioH } ) {
    const args = {
      width: d,
      height: d
    };
    if (ratioW < ratioH) {
      args.width = args.height * ratioW / ratioH;
    } else if (ratioW > ratioH) {
      args.height = args.width * ratioH / ratioW;
    }
    args.x = cx - (args.width / 2);
    args.y = cy - (args.height / 2);
    ctx.rect(args.x, args.y, args.width, args.height);
  }
  const drawShape = function(ctx,dimObj,args) {
    switch(args.drawType) {
      case "poly":
        return drawPoly(ctx,dimObj,args);
      case "circle":
        return drawCircle(ctx,dimObj,args);
      case "rect":
        return drawRect(ctx,dimObj,args);
    }
    const n = args.sideCount;
    if (n > 2 && n < 50) {
      drawPoly(ctx,dimObj,args,n);
    } else {
      drawCircle(ctx,dimObj,args);
    }
  }
  const fillShape = function(ctx, dimObj, args) {
    ctx.fillStyle = args.backgroundColor;
    ctx.beginPath();
    drawShape(ctx,dimObj,args);
    ctx.closePath();
    ctx.fill();
  }
  const strokeShape = function(ctx, dimObj, args) {
    ctx.lineWidth = dimObj.lineWidthMult * args.frameWidth;
    ctx.strokeStyle = frameColor;
    ctx.beginPath();
    drawShape(ctx,dimObj,args);
    ctx.closePath();
    ctx.stroke();
  }
  const drawImage = function(ctx, img, x, y, w, h, args) {
    ctx.drawImage(img, x, y, w, h);
    // now we change the gCO
    ctx.globalCompositeOperation='destination-in';
    ctx.fillStyle = args.backgroundColor;
    ctx.beginPath();
    drawShape(ctx,dimObj,args);
    ctx.closePath();
    ctx.fill();
    // reset to default
    ctx.globalCompositeOperation='source-over';
  }
  return { 
    getConstants, drawShape, drawImage, fillShape, strokeShape 
  };
});