namespace('sp.spritely.Spritely',{
  'sp.common.ColorPicker': 'ColorPicker',
  'sp.common.Colors': 'Colors',
  'sp.common.Dialog': 'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header': 'Header',
  'sp.common.LoadFile': 'LoadFile',
  'sp.common.Utilities': 'Utilities',
  'sp.spritely.Constants': 'Constants',
  'sp.spritely.ImageDownload': 'ImageDownload',
  'sp.spritely.Schema': 'Schema',
  'sp.spritely.SpritelyUtil': 'SpritelyUtil',
},({ 
  ColorPicker,
  Colors,
  Dialog,
  EditMode,
  Header,
  LoadFile,
  Utilities,
  Constants,
  ImageDownload,
  Schema,
  SpritelyUtil,
}) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [
    'Spritely is a canvas for pixel art.',
    'Build your palette below, then select a color in the palette to paint pixels that color, or to unpaint pixels already that color.',
    'Changing the color of a slot in the palette will change the color of all matching pixels.',
    'Deleting a color will unpaint all pixels that matching color.',
    'Unpainting pixels will return them to the background color.',
  ];
  const highlighterFrameId = "highlighterFrame";
  const getTransforms = {
    turnLeft: (size) => (x, y) => [y, size - 1 - x],
    turnRight: (size) => (x, y) => [size - 1 - y, x],
    flipOver: (size) => (x, y) => [size - 1 - x, y],
    flipDown: (size) => (x, y) => [x, size - 1 - y],
    shiftRight: () => (x, y) => [x + 1, y],
    shiftLeft: () => (x, y) => [x - 1, y],
    shiftUp: () => (x, y) => [x, y - 1],
    shiftDown: () => (x, y) => [x, y + 1],
  };
  const drawPaletteDef = function (color, id) {
    return (
      <rect
        key={id}
        id={id}
        width="10"
        height="10"
        strokeWidth="1"
        stroke="black"
        fill={color}
      />
    );
  };
  return class Spritely extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        palette: [],
        pixels: {},
        size: 16,
        selectedPaletteIndex: -1,
        isTransparent: true,
        bgColor: Constants.defaultColor(),
      };
      this.dragState = {};
      this.modals = Dialog.factory({
        imageDownload: {
          componentClass: ImageDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            const palette = Array.from(this.state.palette);
            palette[index] = color;
            this.setState({ palette, selectedPaletteIndex: index });
          },
        },
        bgColorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color }) => {
            this.setState({ bgColor: color });
          },
        },
      });
      this.menuItems = [
        {
          id: 'fileMenu',
          label: 'File',
          items: [
            {
              id: 'loadFile',
              label: 'Load File',
              callback: () => {
                this.loadFile();
              },
            },
            {
              id: 'download',
              label: 'Download',
              callback: () => {
                this.modals.imageDownload.open(this.state);
              },
            },
          ],
        },
        {
          id: 'sizeMenu',
          label: 'Size',
          groupClassName: 'size-picker',
          getter: () => this.state.size,
          setter: (size) => {
            this.setState({ size });
          },
          options: [16, 32, 48].map((value) => {
            return { label: `${value} X ${value}`, value };
          }),
        },
        {
          id: 'transformMenu',
          label: 'Transform',
          items: [
            ['turnLeft', 'Turn Left'],
            ['turnRight', 'Turn Right'],
            ['flipOver', 'Flip Over'],
            ['flipDown', 'Flip Down'],
            ['shiftLeft', 'Shift Left'],
            ['shiftRight', 'Shift Right'],
            ['shiftUp', 'Shift Up'],
            ['shiftDown', 'Shift Down'],
          ].map(([id, label]) => {
            return {
              id: `transform-${id}`,
              label,
              callback: () => {
                this.transform(id);
              },
            };
          }),
        },
        {
          id: 'about',
          label: 'About',
          callback: () => {
            Dialog.alert({ title: "Spritely", lines: about });
          },
        },
      ];
      EditMode.enable();
    }
    loadFile() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const jsonData = JSON.parse(fileContent);
          const error = Schema.validate(jsonData);
          if (error) {
            throw error;
          }
          jsonData.isTransparent = !('bgColor' in jsonData);
          jsonData.size = jsonData.size || 16;
          this.setState(jsonData);
        },
        (fileName, error) => {
          console.log({ fileName, error });
          alert(fileName + ' failed to load. See console for error.');
        }
      );
    }
    transform(transformType) {
      const size = this.state.size;
      const transformFn = getTransforms[transformType](size);
      const pixels = Object.entries(this.state.pixels).reduce(
        (out, [pixelId, paletteIndex]) => {
          const { x, y } = SpritelyUtil.parsePixelId(pixelId);
          const [x1, y1] = transformFn(x, y);
          if (x1 >= 0 && x1 < size && y1 >= 0 && y1 < size) {
            const newPixelId = SpritelyUtil.getPixelId(x1, y1);
            out[newPixelId] = paletteIndex;
          }
          return out;
        },
        {}
      );
      this.setState({ pixels });
    }
    togglePixelColor(pixelId) {
      if (this.state.selectedPaletteIndex >= 0) {
        const pixels = Utilities.merge(this.state.pixels);
        if (pixels[pixelId] === this.state.selectedPaletteIndex) {
          delete pixels[pixelId];
        } else {
          pixels[pixelId] = this.state.selectedPaletteIndex;
        }
        document.getElementById(highlighterFrameId).innerHTML = "";
        this.setState({ pixels });
      }
    }
    minMaxStartEnd(startId, endId) {
      const { x: startX, y: startY } = SpritelyUtil.parsePixelId(startId);
      const { x: endX, y: endY } = SpritelyUtil.parsePixelId(endId);
      const minX = Math.min(startX, endX); 
      const minY = Math.min(startY, endY); 
      const maxX = Math.max(startX, endX); 
      const maxY = Math.max(startY, endY); 
      return { minX, minY, maxX, maxY };
    }
    highlight(startId, endId) {
      const squareSize = Constants.pixelDim();
      const { minX: minColumn, minY: minRow, maxX: maxColumn, maxY: maxRow } = this.minMaxStartEnd(startId, endId);
      const rowCount = (1 + maxRow - minRow);
      const columnCount = (1 + maxColumn - minColumn);
      const [ x, y, width, height ] = [ minColumn, minRow, columnCount, rowCount ].map((n) => n * squareSize);
      document.getElementById(highlighterFrameId).innerHTML = `<rect x=${x} y=${y} width=${width} height=${height} fill="none" stroke="red" stroke-width="2"/>`;
    }
    togglePerStart(startId, endId) {
      const pixels = Utilities.merge(this.state.pixels);
      const setNewState = (pixels[startId] === this.state.selectedPaletteIndex)?((pixels, pixelId) => {
        delete pixels[pixelId];
      }):((pixels, pixelId) => { 
        pixels[pixelId] = this.state.selectedPaletteIndex; 
      });
      const { minX, minY, maxX, maxY } = this.minMaxStartEnd(startId, endId);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          setNewState(pixels, SpritelyUtil.getPixelId(x,y));
        }
      }
      this.setState({ pixels });
    }
    render() {
      return (
        <>
          <Header menuItems={this.menuItems} appTitle={'Spritely'} />
          <h4 className="text-center">Click <a href="./gallery.html">here</a> view a gallery of Spritely images with datafiles!</h4>
          <div className="d-flex justify-content-center rpg-box m-3">
            <button
              className="rounded w-25"
              style={{
                backgroundColor: this.state.bgColor,
                color: Colors.getForegroundColor(this.state.bgColor),
              }}
              onClick={() => {
                this.modals.bgColorPicker.open({ color: this.state.bgColor });
              }}
            >
              BG Color
            </button>
            <span className="m-3"></span>
            <button
              className={`rounded w-25 btn ${
                this.state.isTransparent ? 'btn-outline-light' : 'btn-dark'
              }`}
              onClick={() => {
                this.setState({ isTransparent: !this.state.isTransparent });
              }}
            >
              {this.state.isTransparent ? 'Transparent' : 'Opaque'}
            </button>
          </div>
          <div
            className="rpg-box m-3 d-flex justify-content-between"
            title="Palette">
            <button
              className="btn btn-success"
              title="Add Color"
              onClick={() => {
                const selectedPaletteIndex = this.state.palette.length;
                const palette = [].concat(this.state.palette, [
                  Constants.defaultColor(),
                ]);
                this.setState({ palette, selectedPaletteIndex });
              }}>+</button>
            <div className="ml-2 w-100 d-flex flex-wrap">
              {this.state.palette.map((color, index) => {
                const id = SpritelyUtil.getPaletteButtonId(index);
                return (
                  <button
                    key={id}
                    id={id}
                    className={`palette-color rounded-pill mr-2 ml-2${index === this.state.selectedPaletteIndex?' selected-color':''}`}
                    title={`Color: ${ color }; click to select, double click or right click to change this color`}
                    style={{ color, backgroundColor: color }}
                    onClick={() => { this.setState({ selectedPaletteIndex: index }) }}
                    onDoubleClick={() => {
                      this.modals.colorPicker.open({
                        index,
                        color: this.state.palette[index],
                      });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      this.modals.colorPicker.open({
                        index,
                        color: this.state.palette[index],
                      });
                    }}
                  >----</button>
                );
              })}
            </div>
            <button
              className="btn btn-danger"
              title="Remove Color"
              onClick={() => {
                const palette = Array.from(this.state.palette);
                palette.splice(this.state.selectedPaletteIndex, 1);
                const pixels = Object.entries(this.state.pixels).reduce((out,[k,v]) => {
                  out[k] = v - ((v >= this.state.selectedPaletteIndex)?1:0);
                  return out;
                }, {});
                const selectedPaletteIndex = Math.min(
                  this.state.selectedPaletteIndex,
                  palette.length - 1
                );
                this.setState({ palette, selectedPaletteIndex, pixels });
              }}>-</button>
          </div>
          <div className="rpg-title-box m-3" title="click to paint a pixel">
            <svg
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMin meet"
              viewBox={`0 0 ${this.state.size * Constants.pixelDim()} ${this.state.size * Constants.pixelDim()}`}
              onMouseDown={(e) => {
                if (this.state.selectedPaletteIndex >= 0 && e.target.tagName === "use") {
                  delete this.dragState.endId;
                  this.dragState.drag = true;
                  this.dragState.startId = e.target.id;
                }
              }}
              onMouseMove={(e) => {
                if (this.state.selectedPaletteIndex >= 0 && this.dragState.drag) {
                  const endId = (e.target.id === ''?this.dragState.endId:e.target.id);
                  if (this.dragState.endId != endId && this.dragState.startId != endId) {
                    this.dragState.endId = endId;
                    this.highlight(this.dragState.startId, this.dragState.endId);
                  }
                }
              }}
              onMouseUp={(e) => {
                if(this.state.selectedPaletteIndex >= 0 && this.dragState.drag && this.dragState.endId && this.dragState.endId != this.dragState.startId) {
                  this.togglePerStart(this.dragState.startId, this.dragState.endId);
                }
                delete this.dragState.drag;
                delete this.dragState.startId;
                delete this.dragState.endId;
                document.getElementById(highlighterFrameId).innerHTML = "";
              }}
              onMouseOut={(e) => {
                if (this.state.selectedPaletteIndex >= 0 && this.dragState.drag && ["use","rect"].indexOf(e.target?.tagName) >= 0 && ["use","rect"].indexOf(e.relatedTarget?.tagName) < 0) {
                  if (this.dragState.endId && this.dragState.endId != this.dragState.startId) {
                    this.togglePerStart(this.dragState.startId, this.dragState.endId);
                  }
                  delete this.dragState.drag;
                  delete this.dragState.startId;
                  delete this.dragState.endId;
                  document.getElementById(highlighterFrameId).innerHTML = "";
                }
              }}
            >
              <g>
                {Utilities.range(this.state.size).map((y) => {
                  return Utilities.range(this.state.size).map((x) => {
                    const pixelId = SpritelyUtil.getPixelId(x, y);
                    const pixel = this.state.pixels[pixelId];
                    const altColor = this.state.isTransparent?Constants.clearedPixelId():Constants.bgColorPixelId();
                    const colorId = isNaN(pixel)?`#${altColor}`:`#${SpritelyUtil.getPaletteId(pixel)}`;
                    return (
                      <a
                        key={pixelId}
                        href="#"
                        onClick={(e) => {
                          console.log({ fn: "onClick", e });
                          e.preventDefault();
                          this.togglePixelColor(pixelId);
                        }}>
                        <use
                          id={pixelId}
                          x={x * Constants.pixelDim()}
                          y={y * Constants.pixelDim()}
                          href={colorId}/>
                      </a>
                    );
                  });
                })}
              </g>
              <g id={highlighterFrameId} x="0" y="0" width={this.state.size * Constants.pixelDim()} height={this.state.size * Constants.pixelDim()}></g>
            </svg>
          </div>
          <div style={{ display: 'none' }}>
            <svg width="0" height="0">
              <defs>
                {drawPaletteDef(
                  this.state.bgColor,
                  Constants.bgColorPixelId()
                )}
                {this.state.palette.map((c, i) =>
                  drawPaletteDef(c, SpritelyUtil.getPaletteId(i))
                )}
              </defs>
            </svg>
          </div>
        </>
      );
    }
  };
});
