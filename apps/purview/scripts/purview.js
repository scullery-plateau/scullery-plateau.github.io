namespace("sp.purview.Purview",{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  "sp.common.Utilities":"util",
  "sp.purview.PlayerView":"PlayerView",
},({ buildAbout, ColorPicker, Colors, Dialog, EditMode, Header, LoadFile, util, PlayerView}) => {
  const about = [
    "Purview lets you project your digital battle map onto a second display / output.",
    "Make your dungeon map experience more interactive as the players at your table move thru your dungeon on a digital display.",
    "Scale any image to fit any screen from convenient and easy to use controls."
  ];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        bgColor: "#000001",
        frameColor: "#FF0000",
        lineWidth: 3,
      };
      this.modals = Dialog.factory({
        about: {
          componentClass: buildAbout("Purview",about),
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.update(index, color);
          },
        },
      });
      this.menuItems = [{
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        }
      }];
    }
    applyUpdates(stateUpdates) {
      stateUpdates = stateUpdates || {};
      const [ dataURL, baseImg, playerView ] = [ "dataURL", "baseImg", "playerView" ].map(field => this.state[field] || stateUpdates[field]);
      const { innerWidth, innerHeight } = playerView.getDimensions();
      const { width: imgWidth, height: imgHeight } = baseImg;
      const init = { scale: Math.max(innerWidth/imgWidth, innerHeight/imgHeight), xOffset: 0, yOffset: 0 };
      const scale = !isNaN(stateUpdates.scale)?stateUpdates.scale:!isNaN(this.state.scale)?this.state.scale:!isNaN(init.scale)?init.scale:1;
      const svg = {
        width: Math.max(imgWidth, innerWidth/scale),
        height: Math.max(imgHeight, innerHeight/scale)
      };
      if (svg.height > imgHeight) {
        init.yOffset = (imgHeight - svg.height) / 2;
      } else if (svg.width > imgWidth) {
        init.xOffset = (imgWidth - svg.width) / 2;
      }
      const [ xOffset, yOffset ] = [ "xOffset", "yOffset" ].map(field => !isNaN(stateUpdates[field])?stateUpdates[field]:(!isNaN(this.state[field])?this.state[field]:init[field]));
      svg.x = Math.min(xOffset,0);
      svg.y = Math.min(yOffset,0);
      const svgFrame = {
        x: xOffset,
        y: yOffset,
        width: innerWidth/scale,
        height: innerHeight/scale
      };
      playerView.update({
        dataURL,
        img: baseImg,
        frame: svgFrame
      });
      const [ bgColor, lineWidth, frameColor ] = [ "bgColor", "lineWidth", "frameColor" ].map(field => stateUpdates[field] || this.state[field]);
      playerView.setBackgroundColor(bgColor);
      let updates = { dataURL, baseImg, playerView, scale, xOffset, yOffset, bgColor, lineWidth, frameColor, svg, svgFrame }
      this.setState(updates);
    }

    loadMapImage() {
      const playerView = new PlayerView();
      LoadFile(
        false,
        'dataURL',
        (dataURL) => {
          playerView.open();
          util.initImageObj(dataURL,(baseImg) => {
            EditMode.enable();
            playerView.setOnResize(() => {
              this.applyUpdates({ dataURL, baseImg, playerView });
            });
          });
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    update(field, value) {
      const updates = {};
      updates[field] = value;
      this.applyUpdates(updates);
    }
    launchColorPicker(field) {
      this.modals.colorPicker.open({
        color: this.state[field] || "#999999",
        index: field
      });
    }
    buildColorPickerButton(label, field, classes, style) {
      const value = this.state[field];
      return <button
        className={`btn ${value?'btn-secondary':'btn-outline-light'} ${classes}`}
        title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
        style={ value?util.merge({ backgroundColor: value, color: Colors.getForegroundColor(value) },style):style }
        onClick={() => this.launchColorPicker(field)}
        onDoubleClick={() => this.update(field,undefined)}
        onContextMenu={(e) => {
          e.preventDefault();
          this.update(field,undefined)
        }}>{label}</button>;
    }
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Purview'} />
        { !this.state.dataURL && 
          (<>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={() => this.loadMapImage()}>Load Map Image</button>
            </div>
          </>) }
        { this.state.dataURL && 
          <div className="d-flex justify-content-center">
            <div className="rpg-box d-flex flex-column m-2">
              <div className="input-group my-2">
                <label htmlFor="scale" className="input-group-text">Scale:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  min={ 0 }
                  step={ 0.01 }
                  value={ this.state.scale }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update("scale",parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="xOffset" className="input-group-text">X-Offset:</label>
                <input
                  id="xOffset"
                  type="number"
                  className="form-control"
                  value={ this.state.xOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update("xOffset",parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="yOffset" className="input-group-text">Y-Offset:</label>
                <input
                  id="yOffset"
                  type="number"
                  className="form-control"
                  value={ this.state.yOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update('yOffset',parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="lineWidth" className="input-group-text">Line Width:</label>
                <input
                  id="lineWidth"
                  type="number"
                  className="form-control"
                  value={ this.state.lineWidth }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update('lineWidth',parseFloat(e.target.value))}/>
              </div>
              { this.buildColorPickerButton("Frame Color", "frameColor", "my-2", {})}
              { this.buildColorPickerButton("Background Color", "bgColor", "my-2", {})}
            </div>
            <div className="rpg-box m-2" style={{width: "20em", height: "20em"}}>
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
                <rect 
                  x={this.state.svgFrame.x}
                  y={this.state.svgFrame.y}
                  width={this.state.svgFrame.width}
                  height={this.state.svgFrame.height}
                  fill="none"
                  stroke={this.state.frameColor}
                  strokeWidth={this.state.lineWidth}/>
              </svg>
            </div>
          </div>
        }
      </>);
    }
  }
});