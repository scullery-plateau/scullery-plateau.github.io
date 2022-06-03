(function () {
  let hexFromRGB = function (r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((c) => {
          let h = Number(c).toString(16);
          if (h.length === 1) {
            h = '0' + h;
          }
          return h;
        })
        .join('')
    );
  };
  let rgbFromHex = function (hex) {
    if (hex) {
      let rgb = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
      return {
        red: rgb[0],
        green: rgb[1],
        blue: rgb[2],
      };
    }
  };
  let getColorType = function (color) {
    if (colors[color]) {
      return 'name';
    }
    if ((/[#]([0-9a-f]{6})/i.exec(color) || [])[0] == color) {
      return 'hex';
    }
    return;
  };
  let getForegroundColor = function (hex) {
    let rgb = rgbFromHex(hex);
    let luminosity = Math.sqrt(
      Math.pow(rgb['red'], 2) * 0.299 +
        Math.pow(rgb['green'], 2) * 0.587 +
        Math.pow(rgb['blue'], 2) * 0.114
    );
    return luminosity > 186 ? 'black' : 'white';
  };
  let populateColorNameSelector = function (select) {
    select.innerHTML = '';
    let header = document.createElement('OPTION');
    header.text = 'Select Color By Name';
    header.disabled = true;
    header.selected = true;
    header.setAttribute('hidden', true);
    select.add(header);
    let colorNames = Object.keys(colors);
    colorNames.sort();
    colorNames.forEach((colorName) => {
      let colorHex = colors[colorName];
      let opt = document.createElement('OPTION');
      opt.text = colorName;
      opt.value = colorHex;
      opt.setAttribute(
        'style',
        `margin: 2em; padding: 2em; height: 3em; line-height: 3em; background-color: ${colorName}; color: ${getForegroundColor(
          colorHex
        )};`
      );
      select.add(opt);
    });
  };
  let hexFromXY = function (x, y) {
    let r = 3 * Math.floor(x / 6) + Math.floor(y / 6);
    let g = x % 6;
    let b = y % 6;
    [r, g, b] = [r, g, b].map((c) => {
      c *= 3;
      return c + c * 16;
    });
    return hexFromRGB(r, g, b);
  };
  let buildHexPaletteTable = function () {
    let rows = [];
    for (let y = 0; y < 18; y++) {
      let cells = [];
      for (let x = 0; x < 12; x++) {
        let hex = hexFromXY(x, y);
        cells.push(
          `<td style="padding: 0; margin: 0;"><button style="color: ${hex}; background-color: ${hex};" onclick="setRGB('${hex}')">_</button></td>`
        );
      }
      rows.push(`<tr style="padding: 0; margin: 0;">${cells.join('')}</tr>`);
    }
    return `<table style="padding: 0; margin: 0;">${rows.join('')}</table>`;
  };
  window.loadColorPicker = function (
    hexColorInputId,
    hexPaletteTableId,
    colorByNameSelectorId,
    redColorInputId,
    greenColorInputId,
    blueColorInputId,
    hexColorDisplayId,
    color
  ) {
    document.getElementById(hexPaletteTableId).innerHTML =
      buildHexPaletteTable();
    populateColorNameSelector(document.getElementById(colorByNameSelectorId));
    window.setRGB = function (hex) {
      let rgb = rgbFromHex(hex);
      let foregroundColor = getForegroundColor(hex);
      document
        .getElementById(hexColorDisplayId)
        .setAttribute(
          'style',
          `color: ${hex}; background-color: ${hex}; border: 3px solid white; font-size: 3em;"`
        );
      document.getElementById(hexColorInputId).value = hex;
      document.getElementById(redColorInputId).value = rgb.red;
      document.getElementById(greenColorInputId).value = rgb.green;
      document.getElementById(blueColorInputId).value = rgb.blue;
    };
    window.setColorPart = function (rgbIn) {
      let rgb = rgbFromHex(document.getElementById(hexColorInputId).value);
      Object.entries(rgbIn).forEach(([key, value]) => {
        rgb[key] = value;
      });
      setRGB(hexFromRGB(rgb.red, rgb.green, rgb.blue));
    };
    setRGB(color);
  };
})();
