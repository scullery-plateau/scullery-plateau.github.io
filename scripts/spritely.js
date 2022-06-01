(function () {
  let dim = 16;
  let pixelDim = 10;
  let defaultColor = '#999999';
  let bgColorPixelId = 'bgColorPixel';
  let applyNode = function (parent, childSpec, attrs) {
    attrs = attrs || {};
    let node = document.createElement(childSpec.tag);
    Object.entries(childSpec.attrs).forEach((entry) => {
      node.setAttribute(entry[0], entry[1]);
    });
    Object.entries(attrs).forEach((entry) => {
      node.setAttribute(entry[0], entry[1]);
    });
    parent.appendChild(node);
    return node;
  };
  let getPaletteId = function (index) {
    return 'palette' + index;
  };
  let getPaletteButtonId = function (index) {
    return 'paletteBtn' + index;
  };
  let getPixelId = function (x, y) {
    return x + 'x' + y;
  };
  window.init = function (
    transparentColorId,
    bgColorId,
    makeTransparentId,
    paletteId,
    paletteDefsId,
    paletteColorInputId,
    canvasId,
    aboutId,
    imageDownloadPopupId,
    imgDlScaleId,
    imgDlCanvasId,
    imgDlFileNameId,
    imgDlLinkId,
    imgDlDisplayId
  ) {
    document.getElementById(bgColorId).value = defaultColor;
    document.getElementById(paletteColorInputId).value = defaultColor;
    let data = {
      palette: [],
      pixels: {},
      backgroundColor: defaultColor,
      isTransparent: true,
    };
    let selectedColorIndex = 0;
    let selectColor = function (index) {
      document
        .getElementById(getPaletteButtonId(selectedColorIndex))
        ?.classList.remove('selected-color');
      selectedColorIndex = index;
      document
        .getElementById(getPaletteButtonId(selectedColorIndex))
        .classList.add('selected-color');
    };
    let setColor = function (index) {
      selectColor(index);
      document.getElementById(paletteColorInputId).value =
        data.palette[selectedColorIndex];
      document.getElementById(paletteColorInputId).click();
    };
    let buildPaletteButton = function (color, index) {
      let button = document.createElement('button');
      button.innerHTML = '<p>----</p>';
      button.setAttribute('id', getPaletteButtonId(index));
      button.setAttribute(
        'class',
        'palette-color rounded-circle m-2' +
          (index == selectedColorIndex ? ' selected-color' : '')
      );
      button.setAttribute(
        'title',
        'click to select, double click or right click to change this color'
      );
      button.setAttribute('style', `color:${color};background-color:${color};`);
      button.addEventListener('click', () => {
        selectColor(index);
      });
      button.addEventListener('dblclick', () => {
        setColor(index);
      });
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        setColor(index);
      });
      return button;
    };
    let setPaletteButtonColor = function (color) {
      document
        .getElementById(getPaletteButtonId(selectedColorIndex))
        .setAttribute('style', `color:${color};background-color:${color};`);
    };
    let drawPaletteButtons = function () {
      let paletteButtons = document.getElementById(paletteId);
      paletteButtons.innerHTML = '';
      data.palette.forEach((c, i) => {
        paletteButtons.appendChild(buildPaletteButton(c, i));
      });
    };
    let drawPaletteDef = function (color) {
      return `<rect id="${color.id}" width="10" height="10" stroke-width="1" stroke="black" fill="${color.color}"/>`;
    };
    let drawPaletteDefs = function () {
      let content = [
        {
          color: data.backgroundColor,
          id: bgColorPixelId,
        },
      ]
        .concat(
          data.palette.map((c, i) => {
            return {
              color: c,
              id: getPaletteId(i),
            };
          })
        )
        .map(drawPaletteDef)
        .join('');
      let svg = `<svg width="0" height="0"><defs>${content}</defs></svg>`;
      document.getElementById(paletteDefsId).innerHTML = svg;
    };
    let drawPalette = function () {
      drawPaletteButtons();
      drawPaletteDefs();
    };
    let drawPixel = function (x, y, paletteOption) {
      return `<a href="#" onclick="toggleColor(event,${x},${y})"><use id="${getPixelId(
        x,
        y
      )}" x="${x * pixelDim}" y="${
        y * pixelDim
      }" href="${paletteOption}"/></a>`;
    };
    let getColorId = function (pixelId, isTransparent) {
      if (isNaN(data.pixels[pixelId])) {
        return '#' + (isTransparent ? transparentColorId : bgColorPixelId);
      } else {
        return '#' + getPaletteId(data.pixels[pixelId]);
      }
    };
    let paintCanvas = function () {
      let content = [];
      for (let x = 0; x < dim; x++) {
        for (let y = 0; y < dim; y++) {
          content.push(
            drawPixel(x, y, getColorId(getPixelId(x, y), data.isTransparent))
          );
        }
      }
      document.getElementById(
        canvasId
      ).innerHTML = `<svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet" viewBox="0 0 ${
        dim * pixelDim
      } ${dim * pixelDim}">${content.join('')}</svg>`;
    };
    window.loadFile = function (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      console.log('called loadFile');
      alert("'loadFile' not yet implemented");
      // todo
    };
    window.downloadFile = function (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      console.log('called downloadFile');
      let jsonData = {
        palette: data.palette,
        pixels: data.pixels,
      };
      if (!data.isTransparent) {
        jsonData.backgroundColor = data.backgroundColor;
      }
      initDownloadJsonPopup('spritelyFileDownload', 'spritely', jsonData);
    };
    window.showImageDownload = function (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      initPopup(document.getElementById(imageDownloadPopupId).innerHTML);
    };
    window.addColor = function (e) {
      if (e) {
        e.preventDefault();
        document.dispatchEvent(new Event('CloseMenus'));
      }
      data.palette.push(defaultColor);
      drawPalette();
      setColor(data.palette.length - 1);
    };
    window.removeColor = function (e) {
      if (e) {
        e.preventDefault();
        document.dispatchEvent(new Event('CloseMenus'));
      }
      data.palette.splice(selectedColorIndex, 1);
      Object.entries(data.pixels)
        .filter(([key, value]) => value >= data.palette.length)
        .reduce((out, [key, value]) => {
          delete out[key];
          return out;
        }, data.pixels);
      drawPalette();
      paintCanvas();
    };
    window.setBackgroundColor = function (colorInput) {
      data.backgroundColor = colorInput.value;
      drawPalette();
      paintCanvas();
    };
    window.makeTransparent = function (checkbox) {
      data.isTransparent = document.getElementById(makeTransparentId).checked;
      drawPalette();
      paintCanvas();
    };
    window.transform = function (e, tfType) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      console.log('called transform');
      alert("'transform' not yet implemented");
      //todo
    };
    window.showAbout = function (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      initPopup(document.getElementById(aboutId).innerHTML);
    };
    window.toggleColor = function (e, x, y) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
      console.log('toggle color');
      let pixelId = getPixelId(x, y);
      if (isNaN(data.pixels[pixelId])) {
        if (data.palette.length == 0) {
          addColor();
        }
        data.pixels[pixelId] = selectedColorIndex;
      } else {
        delete data.pixels[pixelId];
      }
      paintCanvas();
    };
    window.updateColor = function (input) {
      console.log('updateColor');
      data.palette[selectedColorIndex] = input.value;
      drawPalette();
      paintCanvas();
    };
    let drawImageInCanvas = function (canvasElem, scale, imgDim) {
      var ctx = canvas.getContext('2d');
      if (!data.isTransparent) {
        ctx.fillStyle(data.backgroundColor);
        ctx.fillRect(0, 0, imgDim, imgDim);
      }
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          let pixelId = getPixelId(x, y);
          if (pixelId in data.pixels) {
            ctx.fillStyle(data.palette[data.pixels[pixelId]]);
            ctx.fillRect(scale * x, scale * y, scale, scale);
          }
        }
      }
      return canvasElem.toDataUrl('image/png');
    };
    window.repaintImage = function () {
      let scale = document.getElmentById(imgDlScaleId).value;
      let imgDim = dim * scale;
      let fileName = normalizeFilename(
        document.getElementById(imgDlFileNameId),
        '.png',
        'spritely'
      );
      let canvasElem = document.getElementById(imgDlCanvasId);
      canvasElem.setAttribute('height', imgDim);
      canvasElem.setAttribute('width', imgDim);
      let imgUrl = drawImageInCanvas(canvasElem, scale, imgDim);
      let link = document.getElementById(imgDlLinkId);
      link.setAttribute('download', fileName);
      link.setAttribute('href', imgUrl);
      let img = document.getElementById(imgDlDisplayId);
      img.setAttribute('src', imgUrl);
      img.setAttribute('style', `width: ${imgDim}; height: ${imgDim};`);
    };
    paintCanvas();
  };
})();
