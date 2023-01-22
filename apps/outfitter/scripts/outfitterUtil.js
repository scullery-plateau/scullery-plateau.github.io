namespace('sp.outfitter.OutfitterUtil',{},() => {
  const convertSVGtoBase64 = function({width,height,viewBox,content}) {
    const svgElement = document.createElement('svg');
    svgElement.setAttribute("width",width);
    svgElement.setAttribute("height",height);
    svgElement.setAttribute("viewBox",viewBox);
    svgElement.innerHTML = content;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svgElement))))}`;
  }
  return {};
});