namespace("dynamic-prototype.TemplateTextForm", {}, () => {
  class TemplateTextForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        textName: 'Text Layer',
        frameX: 0,
        frameY: 0,
        frameWidth: 225,
        frameHeight: 350,
        textContent: 'Sample card text goes here',
        fontFamily: 'Georgia'
      };
    }

    handleInputChange = (e) => {
      const { id, value, type } = e.target;
      this.setState({ [id]: type === 'number' ? parseFloat(value) : value });
    }

    render() {
      const { textName, frameX, frameY, frameWidth, frameHeight, textContent, fontFamily } = this.state;
      return (
        <form className="template-text-form">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="p-2"><label htmlFor="text_name" className="col-form-label">Name:</label></div>
                <div className="flex-fill p-2"><input type="text" id="text_name" className="form-control" value={textName} onChange={this.handleInputChange} /></div>
              </div>
              <hr className="my-3" />
              <div className="row g-2">
                <div className="col-6"><div className="d-flex align-items-center h-100"><div className="p-2"><label htmlFor="frameX" className="col-form-label">Frame X:</label></div><div className="flex-fill p-2"><input type="number" id="frameX" className="form-control" value={frameX} onChange={this.handleInputChange} /></div></div></div>
                <div className="col-6"><div className="d-flex align-items-center h-100"><div className="p-2"><label htmlFor="frameY" className="col-form-label">Frame Y:</label></div><div className="flex-fill p-2"><input type="number" id="frameY" className="form-control" value={frameY} onChange={this.handleInputChange} /></div></div></div>
              </div>
              <div className="row g-2">
                <div className="col-6"><div className="d-flex align-items-center h-100"><div className="p-2"><label htmlFor="frameWidth" className="col-form-label">Width:</label></div><div className="flex-fill p-2"><input type="number" id="frameWidth" className="form-control" value={frameWidth} onChange={this.handleInputChange} /></div></div></div>
                <div className="col-6"><div className="d-flex align-items-center h-100"><div className="p-2"><label htmlFor="frameHeight" className="col-form-label">Height:</label></div><div className="flex-fill p-2"><input type="number" id="frameHeight" className="form-control" value={frameHeight} onChange={this.handleInputChange} /></div></div></div>
              </div>
              <hr className="my-3" />
              <div className="form-floating"><textarea className="form-control" id="text_content" style={{height: '100px'}} value={textContent} onChange={this.handleInputChange}></textarea><label htmlFor="text_content" className="text-dark">Text:</label></div>
              <div className="row g-2 mt-3">
                <div className="col-6"><div className="d-flex align-items-center h-100"><div className="p-2"><label htmlFor="fontFamily" className="col-form-label">Font Family:</label></div><div className="flex-fill p-2"><select id="fontFamily" className="form-select" value={fontFamily} onChange={this.handleInputChange}><option>Georgia</option><option>Arial</option><option>Times New Roman</option></select></div></div></div>
                <div className="col-6"><button className="btn btn-secondary w-100" style={{backgroundColor: '#FF8C00', color: '#FFFFFF'}}>Font Color</button></div>
              </div>
              <div className="row g-2 mt-3">
                <div className="col-6"><button className="btn btn-secondary w-100" style={{backgroundColor: '#7B68EE', color: '#FFFFFF'}}>Background</button></div>
                <div className="col-6"><button className="btn btn-secondary w-100" style={{backgroundColor: '#8B4513', color: '#FFFFFF'}}>Frame</button></div>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center"><svg width="50%" height="100%" viewBox="0 0 225 350"><rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" strokeWidth="1"/></svg></div>
          </div>
        </form>
      );
    }
  }

  return TemplateTextForm;
});