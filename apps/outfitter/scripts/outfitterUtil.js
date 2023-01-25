namespace('sp.outfitter.OutfitterUtil',{},() => {
  const convertSVGtoBase64 = function({width,height,viewBox,content}) {
    return `data:image/svg+xml, ${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${content}</svg>`)}`;
  }
  return { convertSVGtoBase64 };
});
