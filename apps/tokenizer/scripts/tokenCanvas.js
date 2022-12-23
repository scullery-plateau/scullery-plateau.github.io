namespace("sp.tokenizer.TokenCanvas",{},() => {
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
    const initImageObj = function(url,callback) {
      const baseImg = new Image();
      baseImg.onload = (() => {
        callback(baseImg);
      });
      baseImg.src = url;
    }
    const getConstants = function(dim) {
        const [width, height, cx, cy, r, lineWidthMult] = [dim, dim, dim / 2, dim / 2, dim / 2, 5];
        return { width, height, cx, cy, r, lineWidthMult };
    }
    const drawCircle = function(ctx,dimObj,token) {
        ctx.arc(dimObj.cx, dimObj.cy, dimObj.r - 1 - ( dimObj.lineWidthMult * token.frameWidth / 2 ), 0, Math.PI*2);
    }
    const drawPoly = function(ctx,dimObj,token,n) {
        const a = (Math.PI * 2) / n;
        const first = a / 2;
        const points = Array(n)
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
    const drawShape = function(ctx,dimObj,token) {
        const n = token.sideCount;
        if (n > 2 && n < 50) {
          drawPoly(ctx,dimObj,token,n);
        } else {
          drawCircle(ctx,dimObj,token);
        }
    }
    const dim = 500;
    const drawCanvasURL = function(img,token) {
        const c = document.getElementById("canvas");
        const ctx = c.getContext('2d');
        const dimObj = getConstants(dim);
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
          ctx.fillStyle = token.backgroundColor;
          ctx.beginPath();
          drawShape(ctx,dimObj,token);
          ctx.fill();
        }

        ctx.drawImage(img, ix, iy, iw, ih);
        // now we change the gCO
        ctx.globalCompositeOperation='destination-in';
        ctx.fillStyle = token.backgroundColor;
        ctx.beginPath();
        drawShape(ctx,dimObj,token);
        ctx.fill();
        // reset to default
        ctx.globalCompositeOperation='source-over';

        ctx.lineWidth = dimObj.lineWidthMult * token.frameWidth;
        ctx.strokeStyle = token.frameColor;
        ctx.beginPath();
        drawShape(ctx,dimObj,token);
        ctx.stroke();

        // closePath is useless here
        //ctx.closePath();
        return c.toDataURL();
    }
    return { initState, initImageObj, drawCanvasURL };
});