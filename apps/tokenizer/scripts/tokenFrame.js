namespace('sp.tokenizer.TokenFrame',{
  "sp.common.Utilities":"util",
  "sp.common.Dialog":"Dialog",
  "sp.common.ColorPicker":"ColorPicker",
  "sp.common.Constants":"c",
  "sp.tokenizer.Token":"Token"
}, ({util,c,ColorPicker,Dialog,Token}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { index: -1, formToken: Token.buildInitState("myFrame") };
      this.onClose = props.onClose;
      props.setOnOpen(({index,token}) => {
        this.setState({index,formToken:util.merge(this.state.formToken,token)});
      });
      this.modals = Dialog.factory({
        frameColorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color }) => {
            this.applyToToken({ frameColor: color });
          },
        },
        bgColorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color }) => {
            this.applyToToken({ backgroundColor: color });
          },
        },
      });  
    }
    applyToToken(update) {
      let merged = util.merge(this.state.formToken,update)
      console.log(merged)
      this.setState({ formToken:merged });
    }
    render() {
      return (
        <>
          <div className="m-3 d-flex">
            <div className="d-flex flex-column w-25 controls">
              <div className="form-group">
                <label htmlFor="xOffset">X-Offset:</label>
                <input
                  type="number"
                  value={this.state.formToken.xOffset}
                  className="form-control"
                  id="xOffset"
                  onChange={(e) => {this.applyToToken({xOffset:parseInt(e.target.value)})}}
                />
              </div>
              <div className="form-group">
                <label htmlFor="yOffset">Y-Offset:</label>
                <input
                  type="number"
                  value={ this.state.formToken.yOffset }
                  className="form-control"
                  id="yOffset"
                  onChange={(e) => {this.applyToToken({yOffset:parseInt(e.target.value)})}}
                />
              </div>
              <div className="form-group">
                <label htmlFor="scale">Scale:</label>
                <input
                  type="number"
                  min="0"
                  value={ this.state.formToken.scale }
                  step="0.01"
                  className="form-control"
                  id="scale"
                  onChange={(e) => {this.applyToToken({scale:parseFloat(e.target.value)})}}
                />
              </div>
              <div className="form-group">
                <label htmlFor="sideCount">Side Count:</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={ this.state.formToken.sideCount }
                  className="form-control"
                  id="sideCount"
                  onChange={(e) => {this.applyToToken({sideCount:parseInt(e.target.value)})}}/>
              </div>
              <button 
                className="btn btn-light" 
                style={{
                  color: util.getForegroundColor(this.state.formToken.frameColor),
                  backgroundColor: this.state.formToken.frameColor
                }}
                onClick={ () => {
                  this.modals.frameColorPicker.open({
                    color: this.state.formToken.frameColor
                  });
              }}>Frame Color</button>
              <button 
                className="btn btn-light" 
                style={{
                  color: util.getForegroundColor(this.state.formToken.backgroundColor),
                  backgroundColor: this.state.formToken.backgroundColor
                }}
                onClick={ () => {
                  this.modals.bgColorPicker.open({
                    color: this.state.formToken.backgroundColor
                  });
              }}>Background Color</button>
            </div>
            <div className="frame-editor">
              <Token token={ this.state.formToken } frameSize={"20em"}/>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className={'btn btn-success'}
              onClick={() => { 
                this.onClose({ index: this.state.index, token: this.state.formToken }); 
              }}>Confirm</button>
            <button
              className={'btn btn-danger'}
              onClick={() => this.onClose()}
            >Cancel</button>
          </div>
        </>
      );
    }
  }
});
