namespace("sp.purview.Purview",{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.FileDownload': 'FileDownload',
  'sp.common.GridHighlighter':'GridHighlighter',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Point':'Point',
  "sp.common.Utilities":"util",
  "sp.purview.Constants":"Constants",
  "sp.purview.GridConfig":"GridConfig",
  "sp.purview.PlayerView":"PlayerView",
  "sp.purview.ScaleToScreen":"ScaleToScreen",
},({ ColorPicker, Colors, Dialog, EditMode, FileDownload, GridHighlighter, Header, LoadFile, Point, util, Constants, GridConfig, PlayerView, ScaleToScreen}) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [
    "Purview lets you project your digital battle map onto a second display / output.",
    "Make your dungeon map experience more interactive as the players at your table move thru your dungeon on a digital display.",
    "Scale any image to fit any screen from convenient and easy to use controls."
  ];
  const transformOptions = [
    ['Original',''],
    ['Turn Left','turnLeft'],
    ['Turn Right','turnRight'],
    ['Turn Around','flipDown,flipOver'],
    ['Flip Down','flipDown'],
    ['Flip Over','flipOver'],
    ['Flip Left','turnLeft,flipOver'],
    ['Flip Right','turnRight,flipOver'],
  ];
  const highlighterFrameId = "highlighterFrame";
  const validateLoadFileJson = function() {};
  const controlLayers = [{
    id: "fogOfWar",
    label: "View Controls"
  },{
    id: "scenery",
    label: "Scenery"
  },{
    id: "sprites",
    label: "Sprites"
  }]
  const getSpriteLabel = function(controlLayer, index, { filename, c, r, cols, rows }) {
    return `${controlLayer} ${index}: ${filename} (${c}, ${r}, ${cols}, ${rows})`;
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        bgColor: "#000001",
        frameColor: "#FF0000",
        lineWidth: 3,
        moveStep:1,
        scaleStep:0.01,
        fogOfWar: {},
        sprites: [],
        scenery: [],
        images: {},
        controlLayer: "fogOfWar",
      };
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.applyUpdates(util.assoc({}, index, color));
          },
        },
        scaleToScreen: {
          componentClass: ScaleToScreen,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: (response) => {
            this.applyScreenScale(response);
          },
        },
        fileDownload: {
          componentClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {}
        },
        gridConfig: {
          componentClass: GridConfig,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ dataURL, baseImg, grid, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize }) => {
            this.acceptGrid({ dataURL, baseImg, grid, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize });
          },
        },
      });
      this.menuItems = [{
        id: 'fileMenu',
        label: 'File',
        items: [{
          id: 'loadFile',
          label: 'Load File',
          callback: () => {
            this.loadFile();
          },
        },{
          id: 'downloadFile',
          label: 'Download File',
          callback: () => {
            this.downloadFile();
          }
        }]
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          Dialog.alert({
            label: "Purview",
            lines: about
          });
        }
      }];
    }
    applyScreenScale({ 
      scaleToScreen, 
      screenWidth, 
      screenHeight, 
      screenSquare
    }) {
      const { innerWidth, innerHeight } = this.state.playerView.getDimensions();
      const scale = Math.max(innerHeight/screenHeight, innerWidth/screenWidth) * screenSquare / this.state.squareSize;
      console.log({ scaleToScreen, scale});
      this.applyUpdates({ scaleToScreen, scale });
    }
    loadFile() {
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const jsonData = JSON.parse(fileContent);
          const error = validateLoadFileJson(jsonData);
          if (error) {
            throw error;
          }
          util.initImageObj(jsonData.dataURL,(baseImg) => {
            EditMode.enable();
            const playerView = new PlayerView();
            playerView.open(() => {
              jsonData.baseImg = baseImg;
              jsonData.playerView = playerView;
              this.applyUpdates(jsonData);
              this.gridHighlighter = GridHighlighter.init({
                squareSize: jsonData.squareSize,
                highlighterFrameId,
                outlineColor: "white",
                outlineWidth: 3, 
                allowDragEvents: (() => true),
                onOutOfBounds:(() => {}),
                onDrop:((startId, ids) => {
                  const fogOfWar = util.merge(this.state.fogOfWar);
                  const setNewState = (fogOfWar[startId])?((fogOfWar, cellId) => {
                    delete fogOfWar[cellId];
                  }):((fogOfWar, cellId) => { 
                    fogOfWar[cellId] = true;
                  });
                  setNewState(fogOfWar, startId);
                  ids.forEach((id) => {
                    setNewState(fogOfWar, id);
                  });
                  this.applyUpdates({ fogOfWar });
                })
              });
            }, () => {
              this.applyUpdates({ scaleToScreen: false });
            });
          });
        },
        (fileName, error) => {
          console.log({ fileName, error });
          alert(fileName + ' failed to load. See console for error.');
        }
      );
    }
    downloadFile() {
      const downloadJson = util.dissoc(this.state, ["baseImg", "playerView"]);
      this.modals.fileDownload.open({
        defaultFilename:"purview",
        jsonData: downloadJson
      })
    }
    applyUpdates(stateUpdates) {
      stateUpdates = stateUpdates || {};
      const [ dataURL, baseImg, playerView, gridRows, gridColumns, squareSize, gridLineColor, gridLineWidth ] = [ "dataURL", "baseImg", "playerView", "gridRows", "gridColumns", "squareSize", "gridLineColor", "gridLineWidth" ].map(field => this.state[field] || stateUpdates[field]);
      const { innerWidth, innerHeight } = playerView.getDimensions();
      const { width: imgWidth, height: imgHeight } = baseImg;
      const init = { 
        scale: Math.max(innerWidth/imgWidth, innerHeight/imgHeight), 
        xOffset: 0, 
        yOffset: 0 
      };
      init.width = Math.max(imgWidth, innerWidth/scale);
      init.height = Math.max(imgHeight, innerHeight/scale);
      const scale = !isNaN(stateUpdates.scale)?stateUpdates.scale:!isNaN(this.state.scale)?this.state.scale:!isNaN(init.scale)?init.scale:1;
      if (init.height > imgHeight) {
        init.yOffset = (imgHeight - init.height) / 2;
      } else if (init.width > imgWidth) {
        init.xOffset = (imgWidth - init.width) / 2;
      }
      const [ xOffset, yOffset ] = [ "xOffset", "yOffset" ].map(field => !isNaN(stateUpdates[field])?stateUpdates[field]:(!isNaN(this.state[field])?this.state[field]:init[field]));
      const maxX = Math.max(imgWidth, xOffset + innerWidth/scale);
      const maxY = Math.max(imgHeight, yOffset + innerHeight/scale);
      const svg = {
        x: Math.min(xOffset,0),
        y: Math.min(yOffset,0)
      };
      svg.width = maxX - svg.x;
      svg.height = maxY - svg.y;
      const svgFrame = {
        x: xOffset,
        y: yOffset,
        width: innerWidth/scale,
        height: innerHeight/scale
      };
      const [ bgColor, lineWidth, frameColor, fogOfWar, moveStep, sprites, scenery, images, scaleToScreen ] = [ "bgColor", "lineWidth", "frameColor", "fogOfWar", "moveStep", "sprites", "scenery", "images", "scaleToScreen" ].map(field => stateUpdates[field] || this.state[field]);
      playerView.update({
        dataURL,
        img: baseImg,
        frame: svgFrame,
        gridRows, 
        gridColumns, 
        squareSize, 
        fogOfWar, 
        sprites, 
        scenery,
        images
      });
      playerView.setBackgroundColor(bgColor);
      const allUpdates = { dataURL, baseImg, playerView, scale, xOffset, yOffset, bgColor, lineWidth, frameColor, svg, svgFrame, gridRows, gridColumns, squareSize, fogOfWar, moveStep, gridLineColor, gridLineWidth, sprites, scenery, images, scaleToScreen };
      this.setState(allUpdates);
    }
    loadMapImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL) => {
          util.initImageObj(dataURL,(baseImg) => {
            EditMode.enable();
            this.modals.gridConfig.open({ dataURL, baseImg });
          });
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    acceptGrid({ dataURL, baseImg, grid, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize}) {
      const playerView = new PlayerView();
      playerView.open(() => {
        this.applyUpdates({ dataURL, baseImg, playerView, grid, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize });
        this.gridHighlighter = GridHighlighter.init({
          squareSize,
          highlighterFrameId,
          outlineColor: "white",
          outlineWidth: 3, 
          allowDragEvents: (() => true),
          onOutOfBounds:(() => {}),
          onDrop:((startId, ids) => {
            const fogOfWar = util.merge(this.state.fogOfWar);
            const setNewState = (fogOfWar[startId])?((fogOfWar, cellId) => {
              delete fogOfWar[cellId];
            }):((fogOfWar, cellId) => { 
              fogOfWar[cellId] = true;
            });
            setNewState(fogOfWar, startId);
            ids.forEach((id) => {
              setNewState(fogOfWar, id);
            });
            this.applyUpdates({ fogOfWar });
          })
        });
      }, () => {
        this.applyUpdates();
      });
    }
    toggleFog(coordId) {
      const fogOfWar = util.merge(this.state.fogOfWar);
      if (fogOfWar[coordId]) {
        delete fogOfWar[coordId];
      } else {
        fogOfWar[coordId] = true;
      }
      this.applyUpdates({ fogOfWar });
    }
    update(field, value) {
      this.applyUpdates(util.assoc({}, field, parseFloat(value)));
    }
    launchColorPicker(field, value) {
      this.modals.colorPicker.open({ color: value || "#999999", index: field });
    }
    buildColorPickerButton(label, field, classes, style) {
      const value = this.state[field];
      return <button
        className={`btn ${value?'btn-secondary':'btn-outline-light'} ${classes}`}
        title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
        style={ value?util.merge({ backgroundColor: value, color: Colors.getForegroundColor(value) },style):style }
        onClick={() => this.modals.colorPicker.open({ color: value || "#999999", index: field })}
        onDoubleClick={() => this.update(field, undefined) }
        onContextMenu={(e) => {
          e.preventDefault();
          this.update(field,undefined);
        }}>{label}</button>;
    }
    buildControlField(field, label, options) {
      options = options || {};
      return <div className="input-group my-2">
        <label htmlFor={field} className="input-group-text">{label}:</label>
        <input
          id={field}
          name={field}
          type="number"
          className="form-control"
          min={ options.min }
          step={ options.step }
          disabled={ options.disabled }
          value={ this.state[field] }
          style={{ width: "4em"}}
          onChange={(e) => this.update([field],e.target.value)}/>
      </div>;
    }
    activateFog() {
      this.applyUpdates({ 
        fogOfWar:  Array(this.state.gridRows).fill("").reduce((acc, _, rowIndex) => {
          return Array(this.state.gridColumns).fill("").reduce((outVal, _, columnIndex) => {
            return util.assoc(outVal, (new Point([columnIndex, rowIndex])).getCoordinateId(), true);
          }, acc);
        }, {})
      });
    }
    deactivateFog() {
      this.applyUpdates({ fogOfWar: {} });
    }
    isOnGrid() {
      return this.state.moveStep === this.state.squareSize && this.state.xOffset % this.state.squareSize === 0 && this.state.yOffset % this.state.squareSize === 0;
    }
    snapToGrid() {
      this.applyUpdates({
        moveStep: this.state.squareSize,
        xOffset: (this.state.xOffset - (this.state.xOffset % this.state.squareSize)),
        yOffset: (this.state.yOffset - (this.state.yOffset % this.state.squareSize))
      });
    }
    selectSprite(event, controlLayer, selectedSprite) {
      event.preventDefault();
      this.setState({ controlLayer, selectedSprite });
    }
    displaySprites(spriteList) {
      return this.state[spriteList].map(({ filename, r, c, rows, cols, orientation}, index) => {
        return <a href="#" onClick={(e) => this.selectSprite(e, spriteList, index)}>
          <image title={ getSpriteLabel(spriteList, index, { filename, r, c, rows, cols }) }
                 href={ this.state.images[filename] } 
                 x={ c * this.state.squareSize } 
                 y={ r * this.state.squareSize } 
                 width={ cols * this.state.squareSize } 
                 height={ rows * this.state.squareSize }
                 transform={ Constants.getSpriteTransform(orientation)(this.state.squareSize, { r, c, rows, cols }) }
                 />
        </a>;
      });
    }
    selectTab(event, controlLayer) {
      event.preventDefault();
      const selectedSprite = this.state.selectedSprite || 0;
      this.setState({ controlLayer, selectedSprite });
    }
    addSprite() {
      const filesToSprites = ((files, newState) => {
        if (files.length === 0) {
          newState.selectedSprite = newState[newState.controlLayer].length - 1;
          this.applyUpdates(newState);
        } else {
          const { filename, dataURL } = files[0];
          newState.images[filename] = dataURL;
          newState[newState.controlLayer].push({ filename, c: 0, r: 0, cols: 1, rows: 1, orientation: '' });
          filesToSprites(files.slice(1), newState);
        }
      })
      LoadFile(
        true,
        'dataURL',
        (files) => {
          const newState = util.merge(this.state);
          newState.images = util.merge(newState.images);
          newState[newState.controlLayer] = Array.from(newState[newState.controlLayer]);
          filesToSprites(files, newState, newState.controlLayer);
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    copySprite() {
      const newState = util.merge(this.state);
      const spriteList = Array.from(newState[this.state.controlLayer]);
      spriteList.splice(this.state.selectedSprite,0,util.merge(spriteList[this.state.selectedSprite]));
      newState[this.state.controlLayer] = spriteList;
      newState.selectedSprite = newState.selectedSprite + 1;
      this.applyUpdates(newState);
    }
    removeSprite() {
      const newState = util.merge(this.state);
      const spriteList = Array.from(newState[this.state.controlLayer]);
      if (spriteList.length >= 1) {
        spriteList.splice(this.state.selectedSprite,1);
        newState.selectedSprite = Math.max(this.state.selectedSprite - 1, 0);
        newState[this.state.controlLayer] = spriteList;
        this.applyUpdates(newState);
      }
    }
    updateSprite(field, value) {
      const newState = util.merge(this.state);
      const spriteList = Array.from(newState[this.state.controlLayer]);
      spriteList[this.state.selectedSprite][field] = value;
      newState[this.state.controlLayer] = spriteList;
      this.applyUpdates(newState);
    }
    fromSelectedSprite(field, defaultValue) {
      const sprite = this.state[this.state.controlLayer][this.state.selectedSprite];
      return sprite?(sprite[field] || defaultValue):defaultValue;
    }
    buildSpriteField(fieldId, label, field, maxField) {
      return <div className="input-group my-0 mx-1">
        <label htmlFor={fieldId} className="input-group-text">{label}:</label>
        <input
          id={fieldId}
          type="number"
          className="form-control"
          min={0}
          max={ this.state[maxField] - 1 }
          value={ this.fromSelectedSprite(field) }
          onChange={(e) => {
            this.updateSprite(field, Math.max(0, Math.min(this.state[maxField] - 1, parseInt(e.target.value || 0))))
          }}/>
      </div>;
    }
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Purview'} />
        { !this.state.dataURL && 
          (<div className="d-flex justify-content-center">
            <div className="rpg-box m-2">
              <div className="d-flex flex-column justify-content-center">
                <p>Choose an image to load as a map which has already been cropped to be flush with the grid in that image.</p>
                <p>If your image has not been cropped to be flush, use the <a className="btn btn-link" href="../grid-cropper/index.html">Grid Cropper</a> app here on Scullery Plateau.</p>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success" onClick={() => this.loadMapImage()}>Load Map Image</button>
                </div>
                <p className="text-center">- OR -</p>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success" onClick={() => this.loadFile()}>Load Saved File</button>
                </div>
              </div>
            </div>
          </div>) }
        { this.state.dataURL && 
          <div className="row justify-content-center">
            <div className="col-4">
              <div className="rpg-box card d-flex m-2 p-0">
                <div className="card-header bg-dark">
                  <ul className="nav nav-tabs card-header-tabs">
                    { controlLayers.map(({ id, label }) => {
                      return <li className="nav-item">
                        <a className={`nav-link ${this.state.controlLayer === id?'active text-light':''}`} href="#" onClick={(e) => this.selectTab(e, id)}>
                          <em>{ label }</em>
                        </a>
                      </li>;
                    })}
                  </ul>
                </div>
                <div className="card-body d-flex flex-column">
                  { this.state.controlLayer === "fogOfWar" && <>
                    <div className="d-flex justify-content-around">
                      <button title="Download" className="btn btn-primary text-light" onClick={() => { this.downloadFile() }}><i className="far fa-floppy-disk"></i></button>
                      <button title="About" className="btn btn-primary text-light" onClick={() => { Dialog.alert({ title: "About Spritely ...", lines: about }) }}><i className="far fa-circle-question"></i></button>
                    </div>
                    <hr/>
                    <div className="d-flex justify-content-around">
                      { this.buildControlField("scale", "Scale", { min: 0, step: this.state.scaleStep, disabled: this.state.scaleToScreen }) }
                      <div className="input-group my-2">
                        <label htmlFor="scaleStep" className="input-group-text">Scale Step:</label>
                        <input
                          id="scaleStep"
                          name="scaleStep"
                          type="number"
                          className="form-control"
                          min={0.01}
                          step={0.01}
                          disabled={ this.state.scaleToScreen }
                          value={ this.state.scaleStep }
                          style={{ width: "4em" }}
                          onChange={(e) => this.setState({ scaleStep: parseFloat(e.target.value) })}/>
                      </div>
                    </div>
                    <button 
                      className={`btn ${ this.state.scaleToScreen?'btn-danger':'btn-success' }`}
                      onClick={() => { 
                        if (this.state.scaleToScreen) {
                          this.setState({ scaleToScreen: false });
                        } else {
                          this.modals.scaleToScreen.open({});
                        }
                      }}>{this.state.scaleToScreen?'Unlock Scale':'Scale To Screen'}</button>
                    <hr/>
                    <div className="d-flex justify-content-around">
                      { this.buildControlField("xOffset", "X-Offset", { step: this.state.moveStep }) }
                      { this.buildControlField("yOffset", "Y-Offset", { step: this.state.moveStep }) }
                    </div>
                    <div className="input-group my-2">
                      <label htmlFor="moveStep" className="input-group-text">Move Step:</label>
                      <input
                        id="moveStep"
                        name="moveStep"
                        type="number"
                        className="form-control"
                        min={ 1 }
                        step={ 1 }
                        value={ this.state.moveStep }
                        style={{ width: "4em"}}
                        onChange={(e) => this.setState({ moveStep: parseFloat(e.target.value) })}/>
                    </div>
                    <button 
                      className={`btn ${ this.isOnGrid()?'btn-disabled':'btn-success' }`}
                      disabled={ this.isOnGrid() }
                      onClick={() => { this.snapToGrid() }}>Snap To Grid</button>
                    <hr/>
                    <div className="d-flex justify-content-around">
                      { this.buildControlField("lineWidth", "Line\xa0Width", { min: 1 }) }
                      { this.buildColorPickerButton("Frame\xa0Color", "frameColor", "my-2", {})}
                    </div>
                    { this.buildColorPickerButton("Background\xa0Color", "bgColor", "my-2", {})}
                  </> }
                  { (this.state.controlLayer === "scenery" || this.state.controlLayer === "sprites") && <>
                    <div className="d-flex justify-content-around my-1">
                      <div className="input-group flex-grow-1 my-0 mx-1">
                        <label htmlFor="sprite-select" className="input-group-text">Sprite:</label>
                        <select id="sprite-select" className="form-control" value={ this.state.selectedSprite } onChange={(e) => {
                          this.setState({ selectedSprite: parseInt(e.target.value.toString()) })
                        }}>
                          {
                            this.state[this.state.controlLayer].map((sprite, index) => {
                              return <option key={`sprite-option-${index}`} value={index}>{ getSpriteLabel(this.state.controlLayer, index, sprite) }</option>;
                            })
                          }
                        </select>
                      </div>
                      <button title="Add Sprite" className="btn btn-success my-0 mx-1" onClick={() => this.addSprite()}>+</button>
                      <button title="Copy Sprite" className="btn btn-secondary my-0" onClick={() => this.copySprite()}><i className="fas fa-copy"></i></button>
                      <button title="Remove Sprite" className="btn btn-danger my-0 mx-1" onClick={() => this.removeSprite()}>-</button>
                    </div>
                    <hr/>
                    <h5>Size:</h5>
                    <div className="d-flex justify-content-around my-1">
                    { this.buildSpriteField("size-columns", "Columns", 'cols', "gridColumns") }
                    { this.buildSpriteField("size-rows", "Rows", 'rows', "gridRows") }
                    </div>
                    <hr/>
                    <h5>Position:</h5>
                    <div className="d-flex justify-content-around my-1">
                    { this.buildSpriteField("position-column", "Column", 'c', "gridColumns") }
                    { this.buildSpriteField("position-row", "Row", 'r', "gridRows") }
                    </div>
                    <hr/>
                    <div className="d-flex justify-content-around my-1">
                      <label htmlFor="sprite-orientation" className="input-group-text">Orientation:</label>
                      <select id="sprite-orientation" className="form-control" value={ this.fromSelectedSprite('orientation') } onChange={(e) => {
                          this.updateSprite('orientation', e.target.value);
                        }}>
                          {
                            transformOptions.map(([label, value], index) => {
                              return <option key={`sprite-orientation-${index}`} value={value}>{label}</option>;
                            })
                          }
                        </select>
                    </div>
                  </> }
                </div>
              </div>
            </div>
            <div className="col-8 h-100">
              <div className="rpg-box m-2">
                <svg width="100%" height="100%" viewBox={`${this.state.svg.x} ${this.state.svg.y} ${this.state.svg.width} ${this.state.svg.height}`}>
                  <rect
                    x={this.state.svg.x}
                    y={this.state.svg.y}
                    width={this.state.svg.width}
                    height={this.state.svg.height}
                    fill={this.state.bgColor}
                    stroke="none"
                  />
                  <image href={this.state.dataURL} height={this.state.baseImg.height} width={this.state.baseImg.width}/>
                  { this.displaySprites("scenery") }
                  { this.displaySprites("sprites") }
                  { this.state.controlLayer === "fogOfWar" &&
                    <>
                      { !isNaN(this.state.gridRows) && !isNaN(this.state.gridColumns) && !isNaN(this.state.squareSize) &&
                        Array(this.state.gridRows).fill("").map((_, rowIndex) => {
                          return Array(this.state.gridColumns).fill("").map((_, columnIndex) => {
                            const coordId = (new Point([columnIndex, rowIndex])).getCoordinateId();
                            const foggy = this.state.fogOfWar[coordId];
                            return (<a href="#" onClick={() => this.toggleFog(coordId)}>
                              <rect id={coordId} x={columnIndex * this.state.squareSize} y={rowIndex * this.state.squareSize} 
                                    width={this.state.squareSize} height={this.state.squareSize} 
                                    fill={foggy?"black":"white"} opacity={foggy?0.3:0.1}
                                    draggable="true" droptarget="true"/>
                            </a>);
                          });
                        })
                      }
                      <g id={highlighterFrameId} x="0" y="0" width={this.state.squareSize * this.state.gridColumns} height={this.state.squareSize * this.state.gridRows}></g>
                    </>
                  }
                  <rect 
                    x={this.state.svgFrame.x}
                    y={this.state.svgFrame.y}
                    width={this.state.svgFrame.width}
                    height={this.state.svgFrame.height}
                    fill="none"
                    stroke={this.state.frameColor}
                    strokeWidth={this.state.lineWidth}
                    droptarget="true"
                    />
                </svg>
              </div>
            </div>
          </div>
        }
      </>);
    }
  }
});