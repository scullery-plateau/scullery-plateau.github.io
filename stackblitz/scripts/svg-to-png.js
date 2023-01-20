function svgToPng(svgId, onRendered) {
  let svgElement = document.getElementById(svgId);
  let { width, height } = svgElement.getBBox();
  let clonedSvgElement = svgElement.cloneNode(true);
  // true for deep clone
  let outerHTML = clonedSvgElement.outerHTML,
    blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  let URL = window.URL || window.webkitURL || window;
  let blobURL = URL.createObjectURL(blob);
  let image = new Image();
  image.onload = () => {
    let canvas = document.createElement('canvas');

    canvas.widht = width;

    canvas.height = height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    onRendered(canvas.toDataURL());
  };
  image.src = blobURL;
}
