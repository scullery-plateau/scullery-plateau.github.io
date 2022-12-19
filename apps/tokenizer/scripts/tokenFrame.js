namespace("sp.tokenizer.TokenFrame",{
  "sp.common.ColorPicker":"ColorPicker",
  'sp.common.Colors':'colors',
  "sp.common.Dialog":"Dialog",
  'sp.common.Utilities':'util',
  'sp.tokenizer.Token':'Token',
},({ColorPicker,Dialog,util,Token}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = Token.initTokenState();
      this.onClose = props.onClose;
      props.setOnOpen(({token,index}) => {
        this.setState(token);
        this.tokenIndex = index;
      });
      this.modals = Dialog.factory({
        frameColorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color }) => {
            this.setState({ frameColor: color });
          },
        },
        bgColorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color }) => {
            this.setState({ backgroundColor: color });
          },
        },
      });
    }
    render() {
      return <div className="d-flex flex-column">
        <div className="d-flex justify-content-around">
          <div className="d-flex flex-column w-25 controls">
            <div className="form-group">
              <label htmlFor="xOffset">X-Offset:</label>
              <input
                type="number"
                value={ this.state.xOffset }
                className="form-control"
                id="xOffset"
                onChange={(e) => { this.setState({ xOffset: parseInt(e.target.value) }); }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="yOffset">Y-Offset:</label>
              <input
                type="number"
                value={ this.state.yOffset }
                className="form-control"
                id="yOffset"
                onChange={(e) => { this.setState({ yOffset: parseInt(e.target.value) }); }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="scale">Scale:</label>
              <input
                type="number"
                min="0"
                value={ this.state.scale }
                step="0.01"
                className="form-control"
                id="scale"
                onChange={(e) => { this.setState({ scale: parseFloat(e.target.value) }); }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="frameWidth">Frame Width:</label>
              <input
                type="number"
                min="1"
                max={ (this.state.baseScale / 2) - 1 }
                value={ this.state.frameWidth }
                className="form-control"
                id="frameWidth"
                onChange={(e) => { this.setState({ frameWidth: parseInt(e.target.value) }); }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sideCount">Side Count:</label>
              <input
                type="number"
                min="2"
                max="50"
                value={ this.state.sideCount }
                className="form-control"
                id="sideCount"
                onChange={(e) => { this.setState({ sideCount: parseInt(e.target.value) }); }}
              />
            </div>
            <button
              className="btn btn-light"
              style={{
                backgroundColor: this.state.frameColor,
                color: util.getForegroundColor(this.state.frameColor)
              }}
              onClick={ () => {
                this.modals.frameColorPicker.open({
                  color: this.state.frameColor
                });
              }}
              >Frame Color</button>
            <button
              className="btn btn-light"
              style={{
                backgroundColor: this.state.backgroundColor,
                color: util.getForegroundColor(this.state.backgroundColor)
              }}
              onClick={ () => {
                this.modals.bgColorPicker.open({
                  color: this.state.backgroundColor
                });
              }}
              >Background Color</button>
            <button
              className={`rounded btn ${ this.state.isTransparent ? 'btn-outline-light' : 'btn-dark' }`}
              onClick={() => { this.setState({ isTransparent: !this.state.isTransparent }); }}>
              {this.state.isTransparent ? 'Transparent' : 'Opaque'}
            </button>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <Token token={ this.state } frameSize="20em"/>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success"
            onClick={ () => { this.onClose({
              token: this.state,
              index: this.tokenIndex
            }); } }
          >Apply Updates</button>
          <button
            className="btn btn-danger"
            onClick={ () => this.onClose() }
          >Close</button>
        </div>
      </div>;
    }
  }
});
