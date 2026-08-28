namespace("Practice", {
  'sp.common.CanvasUtil':'CanvasUtil',
  'sp.common.Utilities':'util'
}, ({ CanvasUtil, util }) => {
  const hexPoints = [[250, 0], [750, 0], [1000, 433.33], [750, 866.66], [250, 866.66], [0, 433.33]];
  const hexWidth = 1000;
  const hexHeight = 866.66;
  const getPoints = () => hexPoints.map(pair => pair.join(",")).join(" ");
  const image = {
    id: "delapouite-island-7FFFD4",
    path: encodeURIComponent("../sample-images/delapouite-island-#7FFFD4.png"),
    width: 512,
    height: 512
  };
  const fields = [
    ["xOffset","X-Offset","number"],
    ["yOffset","Y-Offset","number"],
    ["scale","Scale","number",0.01],
    ["frameColor","Frame Color","text"],
    ["frameThickness","Frame Thickness","number"],
    ["backgroundColor","Background Color","string"],
  ];
  const drawCanvasUrl = function(canvasId,img,tile) {
    const c = document.getElementById(canvasId);
    const ctx = c.getContext('2d');
    c.width = hexWidth;
    c.height = hexHeight;

    if (tile.backgroundColor) {
      CanvasUtil.fillShape(ctx, {}, {
        drawType: "poly",
        points: hexPoints,
        backgroundColor: tile.backgroundColor
      });
    }

    CanvasUtil.drawImage(ctx, {}, img, tile.xOffset, tile.yOffset, tile.scale * image.width, tile.scale * image.height, {
      drawType: "poly",
      points: hexPoints,
      backgroundColor: tile.backgroundColor
    });

    if (tile.frameColor) {
      CanvasUtil.strokeShape(ctx, {
        lineWidthMult: 1
      }, {
        drawType: "poly",
        points: hexPoints,
        frameColor: tile.frameColor,
        frameWidth: tile.frameThickness
      });
    }
    return c.toDataURL();
  }
  const buildInitState = function(image) {
    const xScale = hexWidth / image.width;
    const yScale = hexHeight / image.height;
    const scale = Math.floor(Math.min(xScale, yScale)*100)/100;
    const xOffset = Math.round((hexWidth - (scale * image.width)) / 2);
    const yOffset = Math.round((hexHeight - (scale * image.height)) / 2);
    return {
      xOffset,
      yOffset,
      scale,
      frameColor: "red",
      frameThickness: 10,
      backgroundColor: "darkblue"
    };
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = buildInitState(image);
      this.canvasId = props.canvasId;
    }
    afterRender() {
      if (!this.state.baseImg) {
        util.initImageObj(image.path, (baseImg) => {
          this.update("baseImg", baseImg);
        });
      }
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    update(fieldName, value) {
      const token = Object.entries(this.state).reduce((out,[k, v]) => {
        out[k] = v;
        return out;
      }, {});
      token[fieldName] = value;
      token.canvasURL = drawCanvasUrl(this.canvasId, token.baseImg, token);
      this.setState(token);
    }
    render() {
      if (this.state.baseImg) {
        return <div className="d-flex justify-content-center">
          <div className="d-flex flex-column w-50">
            {fields.map(([fieldName, fieldLabel, fieldType, step]) => <div className="form-group">
                <label htmlFor={fieldName}>{fieldLabel}:</label>
                <input
                  type={fieldType}
                  value={ this.state[fieldName] }
                  className="form-control"
                  step={step||1}
                  id={fieldName}
                  onChange={(e) => { 
                    this.update(fieldName, e.target.value);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            { this.state.canvasURL && <img style={{ width:"20em", height:"20em"}} src={this.state.canvasURL}/>}
          </div>
        </div>;
      }
    }
  }
})