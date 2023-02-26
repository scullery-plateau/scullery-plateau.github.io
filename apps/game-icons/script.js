namespace("sp.game-icons.Gallery",{
  'sp.common.Ajax':'Ajax',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.Utilities':'util'
},({ Ajax, ColorPicker, Dialog, util }) => {
  const buildColorPickerButton = function(label, style, getter, primary, secondary) {
    const value = getter();
    return <button
      className={`btn ${value?'btn-secondary':'btn-outline-dark'}`}
      title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
      style={ value?util.merge({ backgroundColor: value, color: util.getForegroundColor(value) },style):style }
      onClick={() => primary(value)}
      onDoubleClick={() => secondary(value)}
      onContextMenu={(e) => {
        e.preventDefault();
        secondary(value);
      }}>{label}</button>;
  }
  const Downloader = class extends React.Component {
    constructor(props) {
      super(props);
      props.setOnOpen(({ id, svgPath, color, bgColor }) => {
        console.log({ event: "open", id, svgPath, color, bgColor});
        this.setState({ id, svgPath, color, bgColor, canvasURL: undefined });
      });
      this.state = {
        color: "#555555",
        bgColor: undefined,
        canvasURL: undefined
      };
      this.onClose = props.onClose;
      this.modals = Dialog.factory({
        dlColorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'w-75' },
          onClose: ({ color, index }) => {
            this.setColorFromPicker(index, color);
          },
        }
      });
    }
    setColorFromPicker(index,color) {
      const update = { canvasURL: undefined };
      update[index] = color;
      this.setState(update);
    }
    buildColorPickerButton(label, field, getter, style) {
      return buildColorPickerButton(label,style,getter,(value) => {
        this.modals.dlColorPicker.open({index:field,color:(value || '#999999')})
      },(value) => {
        this.setColorFromPicker(field,undefined);
      });
    }
    updateCanvasURL() {
      if (!this.state.canvasURL && this.state.svgPath) {
        let download = this.state.id.replace(".","-") + "-" + this.state.color;
        if (this.state.bgColor) {
          download += "-" + this.state.bgColor;
        }
        download += ".png";
        const [width, height] = [512, 512];
        const viewBox = [0, 0, width, height].join(' ');
        const content = [];
        if (this.state.bgColor) {
          content.push(`<rect width="${width}" height="${height}" fill="${this.state.bgColor}"/>`);
        }
        content.push(`<path d="${this.state.svgPath}" fill="${this.state.color}"/>`)
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${content.join('')}</svg>`;
        console.log({ svg });
        const imageURL = `data:image/svg+xml, ${encodeURIComponent(svg)}`;
        const baseImg = new Image();
        baseImg.onload = (() => {
          const c = document.getElementById("canvas");
          const ctx = c.getContext('2d');
          c.width = width;
          c.height = height;
          ctx.drawImage(baseImg, 0, 0, width, height);
          this.setState({ download, canvasURL: c.toDataURL() });
        });
        baseImg.src = imageURL;
      }
    }
    render() {
      this.updateCanvasURL();
      return <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          { this.buildColorPickerButton("Color","color",() => this.state.color, {})}
          { this.buildColorPickerButton("Background Color","bgColor",() => this.state.bgColor, {})}
        </div>
        <div className="d-flex justify-content-center">
          { this.state.canvasURL && <a href={this.state.canvasURL} download={this.state.download}><img src={this.state.canvasURL}/></a> }
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger" onClick={() => { this.onClose(); }}>Close</button>
        </div>
      </div>;
    }
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gallery: {},
        bgColor: props.bgColor,
        color: props.color,
        search:""
      };
      this.modals = Dialog.factory({
        downloader:{
          templateClass: Downloader,
          attrs: { class: '' },
          onClose: () => {}
        },
        colorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'w-75' },
          onClose: ({ color, index }) => {
            this.setColorFromPicker(index, color);
          },
        }
      });
    }
    loadGallery () {
      Ajax.getLocalStaticFileAsText('./icons.json',{
        success: (responseText) => {
          const gallery = JSON.parse(responseText);
          this.setState({ gallery, progress: undefined });
        },
        failure: (resp) => {
          console.log(resp);
          throw resp;
        },
        stateChange: (state) => {
          const progress = (100 * (state.state + 1)) / (state.max + 1);
          this.setState({progress})
        }
      });
    }
    setColorFromPicker(index,color) {
      const update = { };
      update[index] = color;
      this.setState(update);
    }
    buildColorPickerButton(label, field, style) {
      return buildColorPickerButton(label,style,() => {
        return this.state[field];
      },(value) => {
        const args = {index:field,color:(value || '#999999')};
        console.log(args);
        this.modals.colorPicker.open(args);
      },() => {
        this.setColorFromPicker(field,undefined);
      });
    }
    render() {
      let entries = Object.entries(this.state.gallery);
      if (this.state.progress) {
        return <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <h2 className="text-center">Game Icons Gallery</h2>
            <div className="d-flex flex-column">
              <p>Loading gallery data, please wait....</p>
              <div className="progress">
                <div className="progress-bar" style={{width: `${this.state.progress}%`}}>{this.state.progress}%</div>
              </div>
            </div>
          </div>
        </div>;
      } else if (entries.length > 0) {
        return <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <h2 className="text-center">Game Icons Gallery</h2>
            <div className="input-group">
              <label htmlFor="search" className="input-group-text">Search:</label>
              <input
                id="search"
                type="text"
                className="form-control"
                style={{width: "4em"}}
                value={ this.state.search }
                onChange={(e) => this.setState({ search: e.target.value })}/>
            </div>
            <div className="d-flex justify-content-center">
              { this.buildColorPickerButton("Color","color",{})}
              { this.buildColorPickerButton("Background Color","bgColor", {})}
            </div>
            <div className="row justify-content-center">
              { entries.filter(([id, svgPath]) => {
                const term = this.state.search || "";
                if (term.length === 0) {
                  return true;
                }
                return id.includes(term);
              }).map(([id,svgPath]) => {
                const { color, bgColor } = this.state;
                return <div className="col-sm-5 col-md-4 col-lg-3 col-xl-3" key={id}>
                  <div className="d-flex flex-column border border-dark text-center">
                    <p style={{width: "6em!important"}}>{id}</p>
                    <div className="text-center">
                      <button className="btn" onClick={() => this.modals.downloader.open({ id, svgPath, color, bgColor })}>
                        <svg width="6em" height="6em" viewBox="0 0 512 512">
                          <rect x="2" y="2" width="510" height="510" fill={bgColor}/>
                          <path fill={color} d={svgPath}/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>;
      } else {
        return <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <h2 className="text-center">Game Icons Gallery</h2>
            <button className="btn btn-primary" onClick={() => this.loadGallery()}>Load Gallery</button>
          </div>
        </div>;
      }
    }
  }
});