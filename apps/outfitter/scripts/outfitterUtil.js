namespace('sp.outfitter.OutfitterUtil',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const convertSVGtoBase64 = function({width,height,viewBox,content},callback) {
    const imageURL = `data:image/svg+xml, ${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${content}</svg>`)}`;
    util.initImageObj(imageURL,(baseImg) => {
      console.log("Image loaded");
      const c = document.getElementById("canvas");
      const ctx = c.getContext('2d');
      c.width = width;
      c.height = height;
      ctx.drawImage(baseImg, 0, 0, width, height);
      console.log("calling data url");
      callback(c.toDataURL());
    });
    return imageURL;
  }
  return { convertSVGtoBase64 };
});
