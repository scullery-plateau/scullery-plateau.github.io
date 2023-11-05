namespace("sp.purview.Purview",{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  "sp.common.Utilities":"util",
  "sp.purview.PlayerView":"PlayerView",
  "sp.purview.PurviewCanvas":"PurviewCanvas",
},({ buildAbout, Dialog, EditMode, Header, LoadFile, util, PlayerView, PurviewCanvas}) => {
  const about = [];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.canvasId = props.canvasId;
      this.state = { 
        bgColor: "black",
        frameColor: "red"
      };
      this.modals = Dialog.factory({
        about: {
          componentClass: buildAbout("Purview",about),
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
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
      console.log({ innerWidth, innerHeight });
      const { width: imgWidth, height: imgHeight } = baseImg;
      console.log({ baseImg, imgHeight, imgWidth });
      const init = { scale: Math.max(innerWidth/imgWidth, innerHeight/imgHeight), xOffset: 0, yOffset: 0 };
      const scale = stateUpdates.scale || this.state.scale || init.scale;
      const svg = {
        width: Math.max(imgWidth, innerWidth/scale),
        height: Math.max(imgHeight, innerHeight/scale)
      };
      if (svg.height > imgHeight) {
        init.yOffset = (imgHeight - svg.height) / 2;
      } else if (svg.width > imgWidth) {
        init.xOffset = (imgWidth - svg.width) / 2;
      }
      const [ xOffset, yOffset ] = [ "xOffset", "yOffset" ].map(field => stateUpdates[field] || this.state[field] || init[field]);
      svg.x = Math.min(xOffset,0);
      svg.y = Math.min(yOffset,0);
      const svgFrame = {
        x: xOffset,
        y: yOffset,
        width: innerWidth/scale,
        height: innerHeight/scale
      };
      const canvasDetails = {
        x: -xOffset * scale,
        y: -yOffset * scale,
        w: imgWidth * scale,
        h: imgHeight * scale
      };
      const canvasFrame = {
        ratioW: innerWidth,
        ratioH: innerHeight
      };
      const canvasURL = PurviewCanvas.drawCanvasURL(this.canvasId, baseImg, canvasDetails, canvasFrame);
      playerView.update({ map: canvasURL });
      const bgColor = stateUpdates.bgColor || this.state.bgColor;
      playerView.setBackgroundColor(bgColor);
      let updates = { dataURL, baseImg, playerView, scale, xOffset, yOffset, bgColor, svg, svgFrame }
      console.log(updates)
      this.setState(updates);
    }
    loadMapImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL) => {
          util.initImageObj(dataURL,(baseImg) => {
            EditMode.enable();
            const playerView = new PlayerView();
            playerView.open();
            playerView.setOnResize(() => {
              this.applyUpdates();
            });
            this.applyUpdates({ dataURL, baseImg, playerView });
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
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Purview'} />
        { !this.state.map && 
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
                <label htmlFor="scale" className="input-group-text">X-Offset:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  value={ this.state.xOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update("xOffset",parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="scale" className="input-group-text">yOffset:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  value={ this.state.yOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update('yOffset',parseFloat(e.target.value))}/>
              </div>
            </div>
            <div className="rpg-box m-2" style={{width: "20em", height: "20em"}}>
              <svg width="100%" height="100%" viewBox={`${this.state.svg.x} ${this.state.svg.y} ${this.state.svg.width} ${this.state.svg.height}`}>
                <image href={this.state.dataURL} height={this.state.baseImg.height} width={this.state.baseImg.width}/>
                <rect 
                  x={this.state.svgFrame.x}
                  y={this.state.svgFrame.y}
                  width={this.state.svgFrame.width}
                  height={this.state.svgFrame.height}
                  fill="none"
                  stroke={this.state.frameColor}
                  strokeWidth="3"/>
              </svg>
            </div>
          </div>
        }
      </>);
    }
  }
});