namespace("dynamic-prototype.OrientationModal", {}, () => {
  class OrientationModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedOrientation: null
      };
    }

    selectOrientation = (orientation) => {
      this.setState({ selectedOrientation: orientation });
      if (this.props.onSelect) {
        this.props.onSelect(orientation);
      }
    }

    render() {
      return (
        <div className="orientation-modal d-flex justify-content-center my-3">
          <div className="rpg-box p-3" style={{maxWidth: '650px'}}>
            <h5 className="mb-3">Create New Template</h5>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-primary p-0" type="button" onClick={() => this.selectOrientation('portrait')} title="Portrait Orientation (2.25 x 3.5)">
                <svg width="225" height="350" viewBox="0 0 225 350">
                  <rect x="10" y="10" width="205" height="330" rx="25" ry="25" fill="white" stroke="#333" strokeWidth="2"/>
                  <text x="112.5" y="165" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">Portrait</text>
                  <text x="112.5" y="195" textAnchor="middle" fontSize="16" fill="#666">2.25" × 3.5"</text>
                </svg>
              </button>
              <button className="btn btn-primary p-0" type="button" onClick={() => this.selectOrientation('landscape')} title="Landscape Orientation (3.5 x 2.25)">
                <svg width="350" height="225" viewBox="0 0 350 225">
                  <rect x="10" y="10" width="330" height="205" rx="25" ry="25" fill="white" stroke="#333" strokeWidth="2"/>
                  <text x="175" y="105" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">Landscape</text>
                  <text x="175" y="135" textAnchor="middle" fontSize="16" fill="#666">3.5" × 2.25"</text>
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return OrientationModal;
});