namespace("sp.purview.PlayerView",{},({}) => {
  const template = function({ dataURL, frame, img }) {
    return `<svg width="100%" height="100%" viewbox="${frame.x} ${frame.y} ${frame.width} ${frame.height}" style="max-width: 100%; max-height: 100%; width: auto; height: auto;">
      <image href="${dataURL}" width="${img.width}" height="${img.height}"/>
    </svg>`;
  }
  return function() {
    const state = {};
    this.open = function() {
      state.sidecar = window.open("", "_blank");
    }
    this.update = function(detail) {
      if (state.sidecar) {
        state.detail = detail;
        state.sidecar.document.body.innerHTML = template(detail);
        state.sidecar.document.body.style.margin = 0;
        state.sidecar.document.body.style.padding = 0;
        state.sidecar.document.body.style.textAlign = "center";
      }
    }
    this.setBackgroundColor = function(color) {
      if (state.sidecar) {
        state.sidecar.document.body.style.backgroundColor = color;
      }
    }
    this.getDimensions = function() {
      if (state.sidecar) {
        const { innerHeight, innerWidth, outerHeight, outerWidth } = state.sidecar;
        return { innerHeight, innerWidth, outerHeight, outerWidth };
      }
    }
    this.setOnResize = function(onResize) {
      if (state.sidecar) {
        state.sidecar.addEventListener("resize", onResize);
      }
    }
  }
});