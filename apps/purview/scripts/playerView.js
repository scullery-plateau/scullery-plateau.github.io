namespace("sp.purview.PlayerView",{},({}) => {
  const template = function({ map }) {
    return `<img style="max-width: 100%; max-height: 100%; width: auto; height: auto;" src="${map}"/>`;
  }
  return function() {
    const state = {};
    this.open = function() {
      state.sidecar = window.open();
      console.log(this.getDimensions());
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
      if (state.sidecar) {
        const { innerHeight, innerWidth, outerHeight, outerWidth } = state.sidecar;
        console.log({ innerHeight, innerWidth, outerHeight, outerWidth });
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