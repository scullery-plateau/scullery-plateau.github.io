namespace('sp.outfitter.OutfitterUtil',{},() => {
  const convertSVGtoBase64 = function({width,height,viewBox,content},callback) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const svgElement = document.createElement('svg');
    svgElement.setAttribute("width",width);
    svgElement.setAttribute("height",height);
    svgElement.setAttribute("viewBox",viewBox);
    svgElement.innerHTML = content;
    const imgURL = `data:image/svg+xml; charset=utf8, ${encodeURIComponent(new XMLSerializer().serializeToString(svgElement))}`;
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(this,0,0);
      callback(canvas.toDataURL());
      document.body.removeChild(canvas);
    }
    img.src = imgURL;
  }
  return { convertSVGtoBase64 };
});
