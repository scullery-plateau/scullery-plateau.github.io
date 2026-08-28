namespace("dynamic-prototype.FontPoolTab", {}, () => {
  class FontPoolTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        availableFonts: ['Arial', 'Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Palatino', 'Times New Roman', 'Trebuchet MS', 'Verdana'],
        selectedFonts: ['Georgia', 'Trebuchet MS', 'Courier New']
      };
    }

    render() {
      const { availableFonts, selectedFonts } = this.state;
      return (
        <div className="font-pool-tab">
          <div className="row">
            <div className="col-md-8">
              <h6>Available Fonts</h6>
              <div className="d-flex flex-column gap-2 overflow-auto" style={{maxHeight: '500px'}}>
                {availableFonts.map(font => (
                  <button key={font} className="btn btn-info" style={{fontFamily: font}}>
                    <h3>{font}</h3>
                    <p>The Quick Brown Fox Jumped Over The Lazy Dog.</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <h6>Selected Fonts</h6>
              <div className="d-flex flex-column gap-2 overflow-auto" style={{maxHeight: '500px'}}>
                {selectedFonts.map(font => (
                  <button key={font} className="btn btn-success disabled" style={{fontFamily: font}}>
                    <h3>{font}</h3>
                    <p>The Quick Brown Fox Jumped Over The Lazy Dog.</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return FontPoolTab;
});