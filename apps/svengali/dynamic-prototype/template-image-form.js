namespace("dynamic-prototype.TemplateImageForm", {}, () => {
  class TemplateImageForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        templateName: 'Card Template',
        frameX: 0,
        frameY: 0,
        frameWidth: 225,
        frameHeight: 350,
        imageSource: 'hero.png',
        centerX: 112,
        centerY: 175,
        magnification: 1.0,
        rotation: 0
      };
    }

    handleInputChange = (e) => {
      const { id, value, type } = e.target;
      this.setState({ [id]: type === 'number' ? parseFloat(value) : value });
    }

    render() {
      const { templateName, frameX, frameY, frameWidth, frameHeight, imageSource, centerX, centerY, magnification, rotation } = this.state;
      
      return (
        <form className="template-image-form">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="p-2">
                  <label htmlFor="template_name" className="col-form-label">Name:</label>
                </div>
                <div className="flex-fill p-2">
                  <input type="text" id="template_name" className="form-control" value={templateName} onChange={this.handleInputChange} />
                </div>
              </div>
              
              <hr className="my-3" />
              
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="frameX" className="col-form-label">Frame X:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="frameX" className="form-control" value={frameX} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="frameY" className="col-form-label">Frame Y:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="frameY" className="form-control" value={frameY} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="frameWidth" className="col-form-label">Width:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="frameWidth" className="form-control" value={frameWidth} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="frameHeight" className="col-form-label">Height:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="frameHeight" className="form-control" value={frameHeight} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="my-3" />
              
              <div className="d-flex align-items-center">
                <div className="p-2">
                  <label htmlFor="imageSource" className="col-form-label">Image Source:</label>
                </div>
                <div className="flex-fill p-2">
                  <select id="imageSource" className="form-select" value={imageSource} onChange={this.handleInputChange}>
                    <option>hero.png</option>
                    <option>mage.png</option>
                    <option>staff.png</option>
                  </select>
                </div>
              </div>
              
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="centerX" className="col-form-label">Center X:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="centerX" className="form-control" value={centerX} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="centerY" className="col-form-label">Center Y:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="centerY" className="form-control" value={centerY} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="magnification" className="col-form-label">Magnification:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="magnification" className="form-control" value={magnification} step="0.1" onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center h-100">
                    <div className="p-2">
                      <label htmlFor="rotation" className="col-form-label">Rotation:</label>
                    </div>
                    <div className="flex-fill p-2">
                      <input type="number" id="rotation" className="form-control" value={rotation} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row g-2 mt-3">
                <div className="col-6">
                  <button className="btn btn-secondary w-100" style={{backgroundColor: '#7B68EE', color: '#FFFFFF'}}>Background</button>
                </div>
                <div className="col-6">
                  <button className="btn btn-secondary w-100" style={{backgroundColor: '#8B4513', color: '#FFFFFF'}}>Frame</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 d-flex justify-content-center">
              <svg width="50%" height="100%" viewBox="0 0 225 350">
                <rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </form>
      );
    }
  }

  return TemplateImageForm;
});