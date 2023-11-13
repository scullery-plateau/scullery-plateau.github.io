namespace("sp.purview.PlayerView",{
  'sp.common.Point':'Point'
},({ Point }) => {
  const template = function({ dataURL, frame, img, gridRows, gridColumns, squareSize, fogOfWar }) {
    fogOfWar = fogOfWar || {};
    console.log({ gridRows, gridColumns, squareSize, fogOfWar });
    return `<svg width="100%" height="100%" viewbox="${frame.x} ${frame.y} ${frame.width} ${frame.height}" style="max-width: 100%; max-height: 100%; width: auto; height: auto;">
      <image href="${dataURL}" width="${img.width}" height="${img.height}"/>
      ${Array(gridRows).fill("").reduce((acc, _, rowIndex) => {
        return Array(gridColumns).fill("").reduce((outval, _, columnIndex) => {
          const coordId = (new Point([columnIndex, rowIndex])).getCoordinateId();
          if (fogOfWar[coordId]) {
            return [].concat(outval, [ `<rect x="${columnIndex * squareSize}" y="${rowIndex * squareSize}" width="${squareSize}" height="${squareSize}" fill="black"/>` ]);
          }
          return outval;
        }, acc);
      }, []).join("\n")}
    </svg>`;
  }
  return function() {
    const state = {};
    this.open = function(onResize) {
      state.sidecar = window.open("", "_blank");
      state.sidecar.addEventListener("resize", onResize);
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
  }
});