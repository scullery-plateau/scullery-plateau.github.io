namespace("dynamic-prototype.CardDisplay", {}, () => {
  class CardDisplay extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        viewBox: '0 0 225 350'
      };
    }

    render() {
      const { viewBox } = this.state;
      return (
        <div className="card-display d-flex justify-content-center">
          <svg width="50%" height="100%" viewBox={viewBox}>
            <rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" strokeWidth="1"/>
            {/* Template layers will be rendered here */}
          </svg>
        </div>
      );
    }
  }

  return CardDisplay;
});