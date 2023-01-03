(function () {
  let tileEditorHelp =
    'Click on the variation of the given tile shown below to include (green) or exclude (red) them in the main app.';
  let tileDim = 30;
  let emptyCellId = 'emptyCell';
  let tileTransforms = {
    flipDown: `matrix(1 0 0 -1 0 ${tileDim})`,
    flipOver: `matrix(-1 0 0 1 ${tileDim} 0)`,
    turnLeft: `rotate(-90,${tileDim / 2},${tileDim / 2})`,
    turnRight: `rotate(90,${tileDim / 2},${tileDim / 2})`,
  };
  let dimensionsByOrientation = {
    portrait: {
      width: 8,
      height: 10,
    },
    landscape: {
      width: 10,
      height: 8,
    },
  };
  let oppositeOrientation = {
    portrait: 'landscape',
    landscape: 'portrait',
  };
  let tileEditorRows = [
    '',
    'flipDown',
    'flipOver',
    'turnLeft',
    'turnRight',
    'flipDown,flipOver',
    'flipOver,turnLeft',
    'flipOver,turnRight',
  ];
  let arbitrateEvent = function (e) {
    if (e) {
      e.preventDefault();
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
  window.initCobblestone = function (
    tileSetId,
    canvasId,
    tileImageDefsId,
    fileLoadInputId,
    imageLoadInputId,
    aboutId,
    imageDownloadPopupId,
    imgDlScaleId,
    trimToImageId,
    imgDlFileNameId,
    imgDlLinkId,
    imgDlDisplayId,
    canvasDivId
  ) {
    initTemplate('imgLinkTemplate', imgDlLinkId);
    initTemplate('imageDownloadPopup', imageDownloadPopupId);
    let data = {
      images: {},
      tiles: {},
      placements: {},
      orientation: 'portrait',
    };
    let selectedTile = [];
    let getTileID = function (filename, tf) {
      return [filename].concat(tf.split(',')).join('.');
    };
    let svgTF = function (tf) {
      return tileTransforms[tf];
    };
    let buildTransformAttr = function (tf) {
      let tfs = tf.split(',').map((tf) => tileTransforms[tf]).join(' ');
      let transform = '';
      if (tfs.length > 0) {
        transform = `transform="${tfs}"`;
      }
      return transform;
    };
    let svgImage = function (id, href, addlAttrs) {
      return `<image id="${id}" xlink:href="${href}" width="${tileDim}" height="${tileDim}" ${addlAttrs}/>`;
    };
    let drawTileTFDef = function (filename, tf) {
      return svgImage(
        getTileID(filename, tf),
        data.images[filename],
        buildTransformAttr(tf)
      );
    };
    let drawTileDef = function ([filename, transforms]) {
      return Object.keys(transforms)
        .map((tf) => {
          return drawTileTFDef(filename, tf);
        })
        .join('');
    };
    let wrapSvgDefs = function (content) {
      return `<svg width="0" height="0"><defs>${content}</defs></svg>`;
    };
    let drawTileDefs = function () {
      let content = [
        `<rect id="${emptyCellId}" width="${tileDim}" height="${tileDim}" fill="url(#clearedGradient)"/>`,
      ]
        .concat(Object.entries(data.tiles).map(drawTileDef))
        .join('');
      document.getElementById(tileImageDefsId).innerHTML = wrapSvgDefs(content);
    };
    let selectTile = function (filename, tf) {
      if (selectedTile.length === 2) {
        document
          .getElementById(`btn.${getTileID(selectedTile[0], selectedTile[1])}`)
          .classList.remove('selected-tile');
      }
      selectedTile = [filename, tf];
      document
        .getElementById(`btn.${getTileID(filename, tf)}`)
        .classList.add('selected-tile');
    };
    let buildTileEditorButton = function (transform, isActive, buttonTile) {
      return `<div class="col-3"><button class="tile ${
        isActive ? 'active-tile' : 'inactive-tile'
      }" title="${
        transform == '' ? 'Original' : transform
      }" onclick="toggleTransform(this,'${transform}')">${buttonTile}</button></div>`;
    };
    let buildTileEditor = function (filename) {
      let dataURL = data.images[filename];
      let transforms = Object.entries(data.tiles[filename]).reduce(
        (out, [transform, isChecked]) => {
          out[transform] = isChecked;
          return out;
        },
        {}
      );
      let rows = tileEditorRows
        .map((transform) =>
          buildTileEditorButton(
            transform,
            transforms[transform],
            buildButtonTile('tileToEdit', transform, true)
          )
        )
        .join('');
      window.toggleTransform = function (button, transform) {
        let isActive = transforms[transform];
        if (isActive) {
          delete transforms[transform];
          button.classList.remove('active-tile');
          button.classList.add('inactive-tile');
        } else {
          transforms[transform] = true;
          button.classList.remove('inactive-tile');
          button.classList.add('active-tile');
        }
      };
      return [
        `${wrapSvgDefs(
          svgImage('tileToEdit', dataURL, '')
        )}<p>${tileEditorHelp}</p><div class="row w-75 justify-content-center">${rows}</div>`,

        () => {
          tileEditorRows.forEach((tf) => {
            if (transforms[tf]) {
              data.tiles[filename][tf] = true;
            } else {
              delete data.tiles[filename][tf];
            }
          });
          let activeTiles = Object.keys(data.tiles[filename]);
          activeTiles.sort();
          if (activeTiles.length > 0) {
            selectedTile = [filename, activeTiles[0]];
          } else {
            selectedTile = [];
            delete data.tiles[filename];
            delete data.images[filename];
          }
          Object.entries(data.placements).forEach(
            ([coordId, [fName, tForm]]) => {
              if (!(fName in data.tiles) || !(tForm in data.tiles[fName])) {
                delete data.placements[coordId];
              }
            }
          );
          drawTiles();
          paintCanvas();
          delete window.applyTransform;
        },

        () => {
          delete window.applyTransform;
        },
      ];
    };
    let editTile = function (filename) {
      let [html, onApply, onCancel] = buildTileEditor(filename);
      initPopup(html, [
        {
          label: 'Apply',
          class: 'success',
          handler: onApply,
        },
        {
          label: 'Cancel',
          class: 'danger',
          handler: onCancel,
        },
      ]);
    };
    let buildButtonTile = function (tileRef, tf, applyTransform) {
      return `<svg width="100%" height="100%" viewBox="0 0 ${tileDim} ${tileDim}"><use href="#${tileRef}" ${
        applyTransform ? buildTransformAttr(tf) : ''
      }></svg>`;
    };
    let buildTileButton = function (filename, tf) {
      let button = document.createElement('button');
      button.innerHTML = buildButtonTile(getTileID(filename, tf), tf);
      button.setAttribute('id', `btn.${getTileID(filename, tf)}`);
      button.setAttribute(
        'class',
        'tile m-2 p-0' +
          (selectedTile[0] == filename && selectedTile[1] == tf
            ? ' selected-tile'
            : '')
      );
      button.setAttribute(
        'title',
        'click to select, double click or right click to edit'
      );
      button.addEventListener('click', () => {
        selectTile(filename, tf);
      });
      button.addEventListener('dblclick', () => {
        editTile(filename);
      });
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        editTile(filename);
      });
      return button;
    };
    let drawTileButtons = function () {
      let tileButtons = document.getElementById(tileSetId);
      tileButtons.innerHTML = '';
      Object.entries(data.tiles).forEach(([filename, transforms]) => {
        Object.keys(transforms).forEach((tf) => {
          tileButtons.appendChild(buildTileButton(filename, tf));
        });
      });
    };
    let drawTiles = function () {
      drawTileDefs();
      drawTileButtons();
    };
    let getCoordinateId = function (x, y) {
      return [x, y].map((i) => i.toString(16).toUpperCase()).join('x');
    };
    let walkCanvas = function (fn) {
      let dim = dimensionsByOrientation[data.orientation];
      for (let x = 0; x < dim.width; x++) {
        for (let y = 0; y < dim.height; y++) {
          fn(x, y, dim.width, dim.height);
        }
      }
      return dim;
    };
    let paintCanvas = function () {
      let content = [];
      let dim = walkCanvas((x, y) => {
        let tile = data.placements[getCoordinateId(x, y)];
        let tileId = tile ? getTileID(tile[0], tile[1]) : emptyCellId;
        content.push(
          `<a href="#" onclick="toggleTile(event,${x},${y})"><use x="${
            tileDim * x
          }" y="${
            tileDim * y
          }" href="#${tileId}" stroke="black" stroke-width="2"/></a>`
        );
      });
      document.getElementById(
        canvasId
      ).innerHTML = `<svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet" viewBox="0 0 ${
        dim.width * tileDim
      } ${dim.height * tileDim}">${content.join('')}</svg>`;
    };
    let validateLoadFileJson = function (data) {
    };
    let processFileLoadError = function (filename, error) {
    };
    let loadFileResultsAsJsonData = function (results, filename) {
      let jsonData = JSON.parse(results);
      let error = validateLoadFileJson(jsonData);
      if (error) {
        throw error;
      }
      ['images', 'tiles', 'placements'].forEach((field) => {
        data[field] = jsonData[field];
      });
      if (jsonData.orientation != data.orientation) {
        setOrientation(jsonData.orientation);
      }
      drawTiles();
      paintCanvas();
    };
    let loadImageAsDataURL = function (results, filename) {
      data.images[filename] = results;
      data.tiles[filename] = { '': true };
      drawTiles();
      selectTile(filename, '');
      paintCanvas();
    };
    window.loadFile = function (e) {
      arbitrateEvent(e);
      document.getElementById(fileLoadInputId).click();
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
      arbitrateEvent(e);
      initDownloadJsonPopup('cobblestoneFileDownload', 'cobblestone', data);
    };
    let applyImgLinkTemplate = function (
      filename,
      dataURL,
      imgWidth,
      imgHeight
    ) {
      let downloadTpl = localStorage.getItem('imgLinkTemplate');
      return eval('`' + downloadTpl + '`');
    };
    window.repaintImage = function () {
      let trimToImage = document.getElementById(trimToImageId).checked;
      let scale = document.getElementById(imgDlScaleId).value;
      let [imgWidth, imgHeight] = ['width', 'height'].map((d) => {
        return dimensionsByOrientation[data.orientation][d];
      });
      let filename = normalizeFilename(
        document.getElementById(imgDlFileNameId).value,
        '.png',
        'cobblestone'
      );
      drawCanvas(
        imgDlDisplayId,
        trimToImage,
        scale,
        imgWidth,
        imgHeight,
        data.images,
        data.placements,
        (dataURL) => {
          document.getElementById(imgDlLinkId).innerHTML = applyImgLinkTemplate(
            filename,
            dataURL,
            imgWidth * scale,
            imgHeight * scale
          );
        }
      );
    };
    window.showImageDownload = function (e) {
      arbitrateEvent(e);
      setUpOneTimeEvent(document, 'ModalShown', () => {
        document.getElementById(imgDlScaleId).value = tileDim;
        repaintImage();
      });
      initPopup(localStorage.getItem('imageDownloadPopup'));
    };
    window.showPrintable = function (e) {
      arbitrateEvent(e);
      let dim = dimensionsByOrientation[data.orientation];
      drawCanvas(
        canvasDivId,
        tileDim,
        dim.width,
        dim.height,
        data.images,
        data.placements,
        (dataURL) => {
          printImageUrlAsPage(data.orientation, dataURL);
        }
      );
    };
    window.addImage = function (e) {
      arbitrateEvent(e);
      document.getElementById(imageLoadInputId).click();
    };
    window.loadImages = function (e) {
      loadFilesAs(
        Array.from(e.target.files),
        'dataURL',
        loadImageAsDataURL,
        processFileLoadError
      );
    };
    window.showAbout = function (e) {
      arbitrateEvent(e);
      initPopup(document.getElementById(aboutId).innerHTML);
    };
    window.setOrientation = function (orientation, e) {
      arbitrateEvent(e);
      let currentAnchor = document.getElementById(
        'orientation-' + data.orientation
      );
      currentAnchor.disabled = false;
      currentAnchor.classList.remove('disabled');
      let nextAnchor = document.getElementById('orientation-' + orientation);
      nextAnchor.disabled = true;
      nextAnchor.classList.add('disabled');
      data.orientation = orientation;
      let allCoords = [];
      walkCanvas((x, y) => {
        allCoords.push(getCoordinateId(x, y));
      });
      Object.keys(data.placements)
        .filter((p) => allCoords.indexOf(p) < 0)
        .forEach((p) => {
          delete data.placements[p];
        });
      drawTiles();
      paintCanvas();
    };
    window.toggleTile = function (e, x, y) {
      e.preventDefault();
      let coordId = getCoordinateId(x, y);
      if (coordId in data.placements) {
        delete data.placements[coordId];
      } else {
        data.placements[coordId] = selectedTile;
      }
      paintCanvas();
    };
    paintCanvas();
  };
})();
