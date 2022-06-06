(function () {
  initKeyEventWrapper();
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
    return [x, y].map((i) => i.toString(16).toUpperCase()).join('x');
  };
  let setColorButtonColor = function (button, color) {
    button.setAttribute('style', `color:${color};background-color:${color};`);
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
    imgDlDisplayId,
    fileLoaderId,
    colorPickerTplId,
    hexColorInputId,
    hexPaletteTableId,
    colorByNameSelectorId,
    redColorInputId,
    greenColorInputId,
    blueColorInputId,
    hexColorDisplayId
  ) {
    initTemplate('colorPickerTpl', colorPickerTplId);
    initTemplate('canvasTemplate', imgDlDisplayId);
    initTemplate('imgLinkTemplate', imgDlLinkId);
    initTemplate('imageDownloadPopup', imageDownloadPopupId);
    setColorButtonColor(document.getElementById(bgColorId), defaultColor);
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
    let initColorPicker = function (color, callback) {
      setUpOneTimeEvent(document, 'ModalShown', () => {
        loadColorPicker(
          hexColorInputId,
          hexPaletteTableId,
          colorByNameSelectorId,
          redColorInputId,
          greenColorInputId,
          blueColorInputId,
          hexColorDisplayId,
          color
        );
      });
      initPopup(localStorage.getItem('colorPickerTpl'), [
        {
          label: 'Color Selected',
          class: 'success',
          handler: () => {
            callback(document.getElementById(hexColorInputId).value);
            drawPalette();
            paintCanvas();
          },
        },
      ]);
    };
    let initColorPicker2 = function (color, callback) {
      let colorInput = document.getElementById(paletteColorInputId);
      colorInput.value = color;
      setUpOneTimeEvent(colorInput, 'change', () => {
        callback(colorInput.value);
        drawPalette();
        paintCanvas();
      });
      colorInput.click();
    };
    let setPaletteColor = function (index) {
      selectColor(index);
      initColorPicker(data.palette[selectedColorIndex], (newColor) => {
        data.palette[selectedColorIndex] = newColor;
      });
    };
    let buildPaletteButton = function (color, index) {
      let button = document.createElement('button');
      button.innerHTML = '----';
      button.setAttribute('id', getPaletteButtonId(index));
      button.setAttribute(
        'class',
        'palette-color rounded-pill mr-2 ml-2' +
          (index == selectedColorIndex ? ' selected-color' : '')
      );
      button.setAttribute(
        'title',
        'click to select, double click or right click to change this color'
      );
      setColorButtonColor(button, color);
      button.addEventListener('click', () => {
        selectColor(index);
      });
      button.addEventListener('dblclick', () => {
        setPaletteColor(index);
      });
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        setPaletteColor(index);
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
      document.getElementById(fileLoaderId).click();
    };
    let validateLoadFileJson = function (data) {
      // todo - call validation
    };
    let loadFileResultsAsJsonData = function (results, filename) {
      let jsonData = JSON.parse(results);
      let error = validateLoadFileJson(jsonData);
      if (error) {
        throw error;
      }
      ['palette', 'pixels', 'backgroundColor', 'isTransparent'].forEach(
        (field) => {
          delete data[field];
        }
      );
      data.palette = jsonData.palette;
      data.pixels = jsonData.pixels;
      data.backgroundColor = jsonData.backgroundColor;
      data.isTransparent = !('backgroundColor' in jsonData);
      drawPalette();
      paintCanvas();
    };
    let processFileLoadError = function (filename, error) {
      // todo -
    };
    window.loadFiles = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'text',
        loadFileResultsAsJsonData,
        processFileLoadError
      );
    };
    window.downloadFile = function (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
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
      setUpOneTimeEvent(document, 'ModalShown', repaintImage);
      initPopup(localStorage.getItem('imageDownloadPopup'));
    };
    window.addColor = function (e) {
      if (e) {
        e.preventDefault();
        document.dispatchEvent(new Event('CloseMenus'));
      }
      data.palette.push(defaultColor);
      drawPalette();
      setPaletteColor(data.palette.length - 1);
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
    window.setBackgroundColor = function (bgButton) {
      initColorPicker(data.backgroundColor, (newColor) => {
        data.backgroundColor = newColor;
        setColorButtonColor(document.getElementById(bgColorId), newColor);
      });
    };
    window.makeTransparent = function (checkbox) {
      data.isTransparent = document.getElementById(makeTransparentId).checked;
      drawPalette();
      paintCanvas();
    };
    let transforms = {
      turnLeft: (x, y) => {
        return getPixelId(y, 15 - x);
      },
      turnRight: (x, y) => {
        return getPixelId(15 - y, x);
      },
      flipOver: (x, y) => {
        return getPixelId(15 - x, y);
      },
      flipDown: (x, y) => {
        return getPixelId(x, 15 - y);
      },
      shiftRight: (x, y) => {
        return getPixelId(x + 1, y);
      },
      shiftLeft: (x, y) => {
        return getPixelId(x - 1, y);
      },
      shiftUp: (x, y) => {
        return getPixelId(x, y - 1);
      },
      shiftDown: (x, y) => {
        return getPixelId(x, y + 1);
      },
    };
    window.transform = function (tfType, e) {
      if (e) {
        e.preventDefault();
        document.dispatchEvent(new Event('CloseMenus'));
      }
      let transformFn = transforms[tfType];
      let newPixels = {};
      let commonKeys = [];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          let currentKey = getPixelId(x, y);
          commonKeys.push(currentKey);
          if (currentKey in data.pixels) {
            newPixels[transformFn(x, y)] = data.pixels[currentKey];
          }
        }
      }
      Object.keys(newPixels).forEach((k) => {
        if (commonKeys.indexOf(k) < 0) {
          delete newPixels[k];
        }
      });
      data.pixels = newPixels;
      drawPalette();
      paintCanvas();
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
      data.palette[selectedColorIndex] = input.value;
      drawPalette();
      paintCanvas();
    };
    let drawImageInCanvas = function (canvasElem, scale, imgDim) {
      let ctx = canvasElem.getContext('2d');
      if (!data.isTransparent) {
        ctx.fillStyle = data.backgroundColor;
        ctx.fillRect(0, 0, imgDim, imgDim);
      }
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          let pixelId = getPixelId(x, y);
          if (pixelId in data.pixels) {
            ctx.fillStyle = data.palette[data.pixels[pixelId]];
            ctx.fillRect(scale * x, scale * y, scale, scale);
          }
        }
      }
      return canvasElem.toDataURL('image/png');
    };
    window.repaintImage = function () {
      let scale = document.getElementById(imgDlScaleId).value;
      let imgDim = dim * scale;
      let filename = normalizeFilename(
        document.getElementById(imgDlFileNameId).value,
        '.png',
        'spritely'
      );
      let canvasTpl = localStorage.getItem('canvasTemplate');
      document.getElementById(imgDlDisplayId).innerHTML = eval(
        '`' + canvasTpl + '`'
      );
      let canvasElem = document.getElementById(imgDlCanvasId);
      let dataURL = drawImageInCanvas(canvasElem, scale, imgDim);
      let downloadTpl = localStorage.getItem('imgLinkTemplate');
      document.getElementById(imgDlLinkId).innerHTML = eval(
        '`' + downloadTpl + '`'
      );
    };
    let arrowTriggerEvents = {
      ctrlarrowlefthold: 'turnLeft',
      ctrlarrowrighthold: 'turnRight',
      ctrlarrowuphold: 'flipOver',
      ctrlarrowdownhold: 'flipDown',
      shiftarrowlefthold: 'shiftLeft',
      shiftarrowrighthold: 'shiftRight',
      shiftarrowuphold: 'shiftUp',
      shiftarrowdownhold: 'shiftDown',
    };
    let arrowTrigger = function (e) {
      console.log(e);
      let event =
        (e.detail.ctrlKey ? 'ctrl' : '') +
        (e.detail.shiftKey ? 'shift' : '') +
        e.type;
      let tf = arrowTriggerEvents[event];
      if (tf) {
        transform(tf);
      }
    };
    paintCanvas();
    document.addEventListener('arrowlefthold', arrowTrigger);
    document.addEventListener('arrowrighthold', arrowTrigger);
    document.addEventListener('arrowuphold', arrowTrigger);
    document.addEventListener('arrowdownhold', arrowTrigger);
  };
})();
