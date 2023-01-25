namespace('sp.outfitter.OutfitterUtil',{},() => {
  const convertSVGtoBase64 = function({width,height,viewBox,content},callback) {
    const imageURL = `data:image/svg+xml, ${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${content}</svg>`)}`;
    const baseImg = new Image();
    baseImg.onload = (() => {
      const c = document.getElementById("canvas");
      const ctx = c.getContext('2d');
      c.width = width;
      c.height = height;
      ctx.drawImage(baseImg, 0, 0, width, height);
      callback(c.toDataURL());
    });
    baseImg.src = imageURL;
  }
  return { convertSVGtoBase64 };
});
