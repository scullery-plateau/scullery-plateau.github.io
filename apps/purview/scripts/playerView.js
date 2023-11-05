namespace("sp.purview.PlayerView",{},({}) => {
  const template = function({ map }) {
    return `<img style="max-width: 100%; max-height: 100%; width: auto; height: auto;" src="${map}"/>`;
  }
  return function() {
    const state = {};
    this.open = function() {
      state.sidecar = window.open();
    }
    this.update = function(detail) {
      if (state.sidecar) {
        state.detail = detail;
        state.sidecar.document.write(template(detail));
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
      const { innerHeight, innerWidth, outerHeight, outerWidth } = state.sidecar;
      return { innerHeight, innerWidth, outerHeight, outerWidth };
    }
    this.setOnResize = function(onResize) {
      state.sidecar.addEventListener("resize", onResize);
    }
  }
});