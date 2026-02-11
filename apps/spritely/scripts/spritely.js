namespace('sp.spritely.Spritely',{
  'sp.common.ColorPicker': 'ColorPicker',
  'sp.common.Colors': 'Colors',
  'sp.common.Dialog': 'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.GridHighlighter':'GridHighlighter',
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
  GridHighlighter,
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
  const transformLabels = [
    ['turnLeft', 'Turn Left', 'fa-rotate-left'],
    ['turnRight', 'Turn Right', 'fa-rotate-right'],
    ['flipOver', 'Flip Over', 'fa-right-left'],
    ['flipDown', 'Flip Down', 'fa-right-left fa-rotate-90'],
    ['shiftLeft', 'Shift Left', 'fa-arrow-left'],
    ['shiftRight', 'Shift Right', 'fa-arrow-right'],
    ['shiftUp', 'Shift Up', 'fa-arrow-up'],
    ['shiftDown', 'Shift Down', 'fa-arrow-down'],
  ];
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
            {
              id: 'loadAsOverlay',
              label: 'Load As Overlay',
              callback: () => {
                this.loadAsOverlay();
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
          items: transformLabels.map(([id, label]) => {
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
      GridHighlighter.init({
        squareSize: Constants.pixelDim(),
        highlighterFrameId,
        outlineColor: "red", 
        outlineWidth: 2, 
        allowDragEvents: (() => (this.state.selectedPaletteIndex >= 0)),
        onOutOfBounds:(() => {}),
        onDrop:((startId, ids) => {
          const pixels = Utilities.merge(this.state.pixels);
          const setNewState = (pixels[startId] === this.state.selectedPaletteIndex)?((pixels, pixelId) => {
            delete pixels[pixelId];
          }):((pixels, pixelId) => { 
            pixels[pixelId] = this.state.selectedPaletteIndex; 
          });
          setNewState(pixels, startId);
          ids.forEach((id) => {
            setNewState(pixels, id);
          });
          this.setState({ pixels });
        })
      });
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
    loadAsOverlay() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const jsonData = JSON.parse(fileContent);
          const error = Schema.validate(jsonData);
          if (error) {
            throw error;
          }
          const newState = Utilities.merge(this.state);
          newState.palette = Array.from(newState.palette);
          newState.pixels = Utilities.merge(newState.pixels);
          const paletteMap = Array(jsonData.palette.length);
          jsonData.palette.forEach((color,index) => {
            const newIndex = newState.palette.indexOf(color);
            if (newIndex < 0) {
              paletteMap[index] = newState.palette.length;
              newState.palette.push(color);
            } else {
              paletteMap[index] = newIndex;
            }
          });
          Object.entries(jsonData.pixels).forEach(([coordId, paletteIndex]) => {
            newState.pixels[coordId] = paletteMap[paletteIndex];
          });
          this.setState(newState);
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
    render() {
      return (
        <>
          <Header menuItems={this.menuItems} appTitle={'Spritely'} />
          <h4 className="text-center">Click <a href="./gallery.html">here</a> view a gallery of Spritely images with datafiles!</h4>
          <div className="row justify-content-center">
            <div className="col-3">
              <div className="rpg-box m-3">
                <div className="d-flex justify-content-around">
                  <button title="Load File" className="btn btn-primary text-light" onClick={() => { this.loadFile() }}><i className="far fa-folder-open"></i></button>
                  <button title="Download" className="btn btn-primary text-light" onClick={() => { this.modals.imageDownload.open(this.state) }}><i className="far fa-floppy-disk"></i></button>
                  <button title="Load As Overlay - Load an additional image over the top of the existing image" className="btn btn-primary text-light" onClick={() => { this.loadAsOverlay() }}><i className="fas fa-photo-film"></i></button>
                  <button title="About" className="btn btn-primary text-light" onClick={() => { Dialog.alert({ title: "About Spritely ...", lines: about }) }}><i className="far fa-circle-question"></i></button>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center rpg-box m-3">
                <div className="d-flex justify-content-around my-1">
                  <button title="Turn Left" className="btn btn-primary text-light" onClick={() => { this.transform("turnLeft") }}><i className={`fas fa-rotate-left`}></i></button>
                  <button title="Turn Right" className="btn btn-primary text-light" onClick={() => { this.transform("turnRight") }}><i className={`fas fa-rotate-right`}></i></button>
                  <button title="Flip Over" className="btn btn-primary text-light" onClick={() => { this.transform("flipOver") }}><i className={`fas fa-right-left`}></i></button>
                  <button title="Flip Down" className="btn btn-primary text-light" onClick={() => { this.transform("flipDown") }}><i className={`fas fa-right-left fa-rotate-90`}></i></button>
                </div>
                <div className="d-flex justify-content-around my-1">
                  <button title="Shift Left" className="btn btn-primary text-light" onClick={() => { this.transform("shiftLeft") }}><i className={`fas fa-arrow-left`}></i></button>
                  <button title="Shift Right" className="btn btn-primary text-light" onClick={() => { this.transform("shiftRight") }}><i className={`fas fa-arrow-right`}></i></button>
                  <button title="Shift Up" className="btn btn-primary text-light" onClick={() => { this.transform("shiftUp") }}><i className={`fas fa-arrow-up`}></i></button>
                  <button title="Shift Down" className="btn btn-primary text-light" onClick={() => { this.transform("shiftDown") }}><i className={`fas fa-arrow-down`}></i></button>
                </div>
              </div>
              <div className="d-flex justify-content-around rpg-box m-3">
                <button className="rounded m-1 btn btn-outline-light"
                        style={{ backgroundColor: this.state.bgColor, color: Colors.getForegroundColor(this.state.bgColor) }}
                        onClick={() => { this.modals.bgColorPicker.open({ color: this.state.bgColor }) }}>BG&nbsp;Color</button>
                <button className={`rounded m-1 btn ${this.state.isTransparent ? 'btn-outline-light' : 'btn-dark'}`}
                        onClick={() => { this.setState({ isTransparent: !this.state.isTransparent }); }}>
                  {this.state.isTransparent ? 'Transparent' : 'Opaque'}
                </button>
              </div>
              <div className="d-flex flex-column rpg-box m-3">
                <div className="d-flex justify-content-around">
                  <button className="btn btn-success m-1 w-100" title="Add Color"
                      onClick={() => {
                        const selectedPaletteIndex = this.state.palette.length;
                        const palette = [].concat(this.state.palette, [
                          Constants.defaultColor(),
                        ]);
                        this.setState({ palette, selectedPaletteIndex });
                      }}>+</button>
                  <button className="btn btn-danger m-1 w-100" title="Remove Color"
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
                <div className="w-100 d-flex flex-wrap justify-content-center">
                  {this.state.palette.map((color, index) => {
                    const id = SpritelyUtil.getPaletteButtonId(index);
                    return (
                      <button
                        key={id}
                        id={id}
                        className={`palette-color rounded-pill m-1 ${index === this.state.selectedPaletteIndex?' selected-color':''}`}
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
                      >---</button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-7 h-100">
              <div className="rpg-title-box m-3">
                <svg width="100%" height="100%" preserveAspectRatio="xMidYMin meet"
                     viewBox={`0 0 ${this.state.size * Constants.pixelDim()} ${this.state.size * Constants.pixelDim()}`}>
                  { Utilities.range(this.state.size).map((y) => {
                    return Utilities.range(this.state.size).map((x) => {
                      const pixelId = SpritelyUtil.getPixelId(x, y);
                      const pixel = this.state.pixels[pixelId];
                      const color = this.state.palette[pixel];
                      const altColor = this.state.isTransparent?Constants.clearedPixelId():Constants.bgColorPixelId();
                      const colorId = isNaN(pixel)?`#${altColor}`:`#${SpritelyUtil.getPaletteId(pixel)}`;
                      return (
                        <a
                          key={pixelId}
                          href="#"
                          title={`${isNaN(pixel)?"C":`Color: ${ color }; c`}lick to paint pixel, right click to select color in palette`}
                          onClick={(e) => {
                            console.log({ fn: "onClick", e });
                            e.preventDefault();
                            this.togglePixelColor(pixelId);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (!isNaN(pixel)) {
                              this.setState({ selectedPaletteIndex: pixel });
                            }
                          }}>
                          <use
                            id={pixelId}
                            x={x * Constants.pixelDim()}
                            y={y * Constants.pixelDim()}
                            href={colorId}
                            droptarget="true"
                            draggable="true"/>
                        </a>
                      );
                    });
                  })}
                  <g id={highlighterFrameId} x="0" y="0" width={this.state.size * Constants.pixelDim()} height={this.state.size * Constants.pixelDim()}></g>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ display: 'none' }}>
            <svg width="0" height="0">
              <defs>
                { drawPaletteDef(
                  this.state.bgColor,
                  Constants.bgColorPixelId()
                )}
                { this.state.palette.map((c, i) =>
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
