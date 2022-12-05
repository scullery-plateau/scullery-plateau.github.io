namespace('sp.tokenizer.TokenFrame',{
  "sp.common.Utilities":"util",
  "sp.common.Dialog":"Dialog",
  "sp.common.ColorPicker":"ColorPicker",
  "sp.common.Constants":"c",
  "sp.tokenizer.Token":"Token"
}, ({util,c,ColorPicker,Dialog,Token}) => {
  const context = {};
  return function (props) {
    const [formToken, setFormToken] = React.useState(Token.buildInitState());
    props.setOnOpen(({index,token}) => {
      console.log({index,token});
      context.index = index;
      console.log(context);
      setFormToken(util.merge(formToken,token));
    });
    const applyToToken = function(update) {
      let merged = util.merge(formToken,update);
      console.log({formToken,update,merged});
      setFormToken(merged);
      console.log({formToken});
    }
    const modals = Dialog.factory({
      frameColorPicker: {
        templateClass: ColorPicker,
        attrs: { class: 'rpg-box text-light w-75' },
        onClose: ({ color }) => {
          applyToToken({ frameColor: color });
        },
      },
      bgColorPicker: {
        templateClass: ColorPicker,
        attrs: { class: 'rpg-box text-light w-75' },
        onClose: ({ color }) => {
          applyToToken({ backgroundColor: color });
        },
      },
    });
    return (
      <>
        <div className="m-3 d-flex">
          <div className="d-flex flex-column w-25 controls">
            <div className="form-group">
              <label htmlFor="xOffset">X-Offset:</label>
              <input
                type="number"
                value={formToken.xOffset}
                className="form-control"
                id="xOffset"
                onChange={(e) => {applyToToken({xOffset:parseInt(e.target.value)})}}
              />
            </div>
            <div className="form-group">
              <label htmlFor="yOffset">Y-Offset:</label>
              <input
                type="number"
                value={ formToken.yOffset }
                className="form-control"
                id="yOffset"
                onChange={(e) => {applyToToken({yOffset:parseInt(e.target.value)})}}
              />
            </div>
            <div className="form-group">
              <label htmlFor="scale">Scale:</label>
              <input
                type="number"
                min="0"
                value={ formToken.scale }
                step="0.01"
                className="form-control"
                id="scale"
                onChange={(e) => {applyToToken({scale:parseFloat(e.target.value)})}}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sideCount">Side Count:</label>
              <input
                type="number"
                min="2"
                max="50"
                value={ formToken.sideCount }
                className="form-control"
                id="sideCount"
                onChange={(e) => {applyToToken({sideCount:parseInt(e.target.value)})}}/>
            </div>
            <button 
              className="btn btn-light" 
              style={{
                color: util.getForegroundColor(formToken.frameColor),
                backgroundColor: formToken.frameColor
              }}
              onClick={ () => {
                modals.frameColorPicker.open({
                  color: formToken.frameColor
                });
            }}>Frame Color</button>
            <button 
              className="btn btn-light" 
              style={{
                color: util.getForegroundColor(formToken.backgroundColor),
                backgroundColor: formToken.backgroundColor
              }}
              onClick={ () => {
                modals.bgColorPicker.open({
                  color: formToken.backgroundColor
                });
            }}>Background Color</button>
          </div>
          <div className="frame-editor">
            <Token token={ formToken } index={ context.index }/>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className={'btn btn-success'}
            onClick={() => { 
              console.log({ context, formToken });
              props.onClose({ index: context.index, token: formToken }); 
            }}>Confirm</button>
          <button
            className={'btn btn-danger'}
            onClick={() => props.onClose()}
          >Cancel</button>
        </div>
      </>
    );
  };
});
