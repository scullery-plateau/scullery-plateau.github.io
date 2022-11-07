(function () {
  initKeyEventWrapper();
  let pixelDim = 10;
  let defaultColor = '#999999';
  let bgColorPixelId = 'bgColorPixel';
  let colorSpec = Jval.patternMatches(/^[#][0-9a-fA-F]{6}$/);
  let dataSpec = Jval.objectOf({
    fields:{
      palette:Jval.everyIs(colorSpec),
      pixels:Jval.mapOf({
        eachKey:Jval.patternMatches(/^[0-9a-vA-V]+[x][0-9a-vA-V]+$/),
        eachValue:Jval.intOf({min:0})
      }),
      backgroundColor:colorSpec,
      isTransparent:Jval.bool(),
      size:Jval.isEnum(16,32,48)
    },
    required:['palette','pixels']
  });
  let getPaletteId = function (index) {
    return 'palette' + index;
  };
  let getPaletteButtonId = function (index) {
    return 'paletteBtn' + index;
  };
  let getPixelId = function (x, y) {
    return [x, y].map((i) => i.toString(32).toUpperCase()).join('x');
  };
  let parsePixelId = function (id) {
    let [x, y] = id.split('x').map((n) => parseInt(n, 32));
    return { x, y };
  };
  let setColorButtonColor = function (button, color) {
    button.setAttribute('style', `color:${color};background-color:${color};`);
  };
  let setBackgroundColorButtonColor = function (button, color) {
    button.setAttribute(
      'style',
      `color:${getForegroundColor(color)};background-color:${color};`
    );
  };
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
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
    trimToImageId,
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
    let setTransparentButtonState = function (isTransparent) {
      let button = document.getElementById(makeTransparentId);
      if (!isTransparent) {
        button.classList.remove('btn-outline-light');
        button.classList.add('btn-dark');
        button.innerHTML = 'Opaque';
      } else {
        button.classList.remove('btn-dark');
        button.classList.add('btn-outline-light');
        button.innerHTML = 'Transparent';
      }
    };
    setBackgroundColorButtonColor(
      document.getElementById(bgColorId),
      defaultColor
    );
    document.getElementById(paletteColorInputId).value = defaultColor;
    let data = {
      palette: [],
      pixels: {},
      backgroundColor: defaultColor,
      isTransparent: true,
      size: 16,
    };
    setTransparentButtonState(data.isTransparent);
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
    let walkCanvas = function (fn, dim) {
      let { width, height } = dim || {};
      width = width || data.size;
      height = height || data.size;
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          fn(x, y);
        }
      }
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
          (index === selectedColorIndex ? ' selected-color' : '')
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
      walkCanvas((x, y) => {
        content.push(
          drawPixel(x, y, getColorId(getPixelId(x, y), data.isTransparent))
        );
      });
      document.getElementById(
        canvasId
      ).innerHTML = `<svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet" viewBox="0 0 ${
        data.size * pixelDim
      } ${data.size * pixelDim}">${content.join('')}</svg>`;
    };
    window.loadFile = function (e) {
      arbitrateEvent(e);
      document.getElementById(fileLoaderId).click();
    };
    let validateLoadFileJson = function (data) {
      return dataSpec(data);
    };
    let processFileLoadError = function (filename, error) {
      console.log({filename,error});
      alert(filename + " failed to load. See console for error.")
    };
    let loadFileResultsAsJsonData = function (results, filename) {
      let jsonData = JSON.parse(results);
      let error = validateLoadFileJson(jsonData);
      if (error) {
        throw error;
      }
      ['palette', 'pixels', 'backgroundColor', 'isTransparent', 'size'].forEach(
        (field) => {
          delete data[field];
        }
      );
      data.palette = jsonData.palette;
      data.pixels = jsonData.pixels;
      data.backgroundColor = jsonData.backgroundColor;
      data.isTransparent = !('backgroundColor' in jsonData);
      data.size = jsonData.size || 16;
      if (data.backgroundColor) {
        setBackgroundColorButtonColor(document.getElementById(bgColorId),data.backgroundColor);
      }
      setTransparentButtonState(data.isTransparent);
      drawPalette();
      paintCanvas();
    };
    window.loadFiles = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'text',
        loadFileResultsAsJsonData,
        processFileLoadError
      );
    };
    let prepDownloadData = function () {
      let jsonData = {
        palette: data.palette,
        pixels: data.pixels,
        size: data.size,
      };
      if (!data.isTransparent) {
        jsonData.backgroundColor = data.backgroundColor;
      }
      return jsonData;
    };
    window.showImageDownload = function (e) {
      arbitrateEvent(e);
      setUpOneTimeEvent(document, 'ModalShown', repaintImage);
      initPopup(localStorage.getItem('imageDownloadPopup'), [
        {
          label: 'Download Datafile',
          class: 'success',
          handler: () => {
            triggerDownload(imgDlFileNameId, 'spritely', prepDownloadData());
          },
        },
        {
          label: 'Cancel',
          class: 'danger',
          handler: () => {},
        },
      ]);
    };
    window.addColor = function (e) {
      arbitrateEvent(e);
      data.palette.push(defaultColor);
      drawPalette();
      setPaletteColor(data.palette.length - 1);
    };
    window.removeColor = function (e) {
      arbitrateEvent(e);
      data.palette.splice(selectedColorIndex, 1);
      Object.entries(data.pixels)
        .filter(([key, value]) => value == selectedColorIndex)
        .reduce((out, [key, value]) => {
          delete out[key];
          return out;
        }, data.pixels);
      Object.entries(data.pixels)
        .filter(([key, value]) => value > selectedColorIndex)
        .reduce((out, [key, value]) => {
          out[key]--;
          return out;
        }, data.pixels);
      drawPalette();
      paintCanvas();
    };
    window.setBackgroundColor = function (bgButton) {
      initColorPicker(data.backgroundColor, (newColor) => {
        data.backgroundColor = newColor;
        setBackgroundColorButtonColor(
          document.getElementById(bgColorId),
          newColor
        );
      });
    };
    window.toggleTransparent = function (button) {
      console.log(data.isTransparent);
      data.isTransparent = !data.isTransparent;
      setTransparentButtonState(data.isTransparent);
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
      arbitrateEvent(e);
      let transformFn = transforms[tfType];
      let newPixels = {};
      let commonKeys = [];
      walkCanvas((x, y) => {
        let currentKey = getPixelId(x, y);
        commonKeys.push(currentKey);
        if (currentKey in data.pixels) {
          newPixels[transformFn(x, y)] = data.pixels[currentKey];
        }
      });
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
      arbitrateEvent(e);
      initPopup(document.getElementById(aboutId).innerHTML);
    };
    window.toggleColor = function (e, x, y) {
      arbitrateEvent(e);
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
    let drawImageInCanvas = function (canvasElem, scale, imgDim, trimToImage) {
      let ctx = canvasElem.getContext('2d');
      if (!data.isTransparent) {
        ctx.fillStyle = data.backgroundColor;
        ctx.fillRect(0, 0, imgDim, imgDim);
      }
      let { offsetX, offsetY, width, height } = calcTrimBounds(
        trimToImage,
        data.size,
        data.size,
        Object.keys(data.pixels),
        parsePixelId
      );
      walkCanvas(
        (x, y) => {
          let pixelId = getPixelId(x, y);
          if (pixelId in data.pixels) {
            ctx.fillStyle = data.palette[data.pixels[pixelId]];
            ctx.fillRect(
              scale * (x - offsetX),
              scale * (y - offsetY),
              scale,
              scale
            );
          }
        },
        { width, height }
      );
      return canvasElem.toDataURL('image/png');
    };
    window.repaintImage = function () {
      console.log("repaintImage" + Date());
      let trimToImage = document.getElementById(trimToImageId).checked;
      let scale = document.getElementById(imgDlScaleId).value;
      let imgDim = data.size * scale;
      let filename = normalizeFilename(
        document.getElementById(imgDlFileNameId).value,
        '.png',
        'spritely'
      );
      console.log({trimToImage,scale,imgDim,filename});
      let canvasTpl = localStorage.getItem('canvasTemplate');
      document.getElementById(imgDlDisplayId).innerHTML = eval(
        '`' + canvasTpl + '`'
      );
      let canvasElem = document.getElementById(imgDlCanvasId);
      let dataURL = drawImageInCanvas(canvasElem, scale, imgDim, trimToImage);
      let downloadTpl = localStorage.getItem('imgLinkTemplate');
      document.getElementById(imgDlLinkId).innerHTML = eval(
        '`' + downloadTpl + '`'
      );
    };
    window.setSize = function (size, e) {
      arbitrateEvent(e);
      let currentAnchor = document.getElementById('size' + data.size);
      currentAnchor.disabled = false;
      currentAnchor.classList.remove('disabled');
      let nextAnchor = document.getElementById('size' + size);
      nextAnchor.disabled = true;
      nextAnchor.classList.add('disabled');
      data.size = size;
      let allCoords = [];
      walkCanvas((x, y) => {
        allCoords.push(getPixelId(x, y));
      });
      Object.keys(data.pixels)
        .filter((p) => allCoords.indexOf(p) < 0)
        .forEach((p) => {
          delete data.pixels[p];
        });
      drawPalette();
      paintCanvas();
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
    let triggerTransform = function (tf) {
      return () => {
        transform(tf);
      };
    };
    paintCanvas();
    Object.entries(arrowTriggerEvents).forEach(([event, tf]) => {
      document.addEventListener(event, triggerTransform(tf));
    });
    document.addEventListener('escapehold', () => {
      document.dispatchEvent(new Event('CloseMenus'));
    });
    document.addEventListener('ctrlkeyshold', (e) => {
      e.detail.original.preventDefault();
      showImageDownload();
    });
    document.addEventListener('ctrlkeyohold', (e) => {
      e.detail.original.preventDefault();
      document.getElementById(fileLoaderId).click();
    });
  };
})();
