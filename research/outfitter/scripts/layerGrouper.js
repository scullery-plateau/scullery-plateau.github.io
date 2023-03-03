namespace('sp.outfitter.LayerGrouper',{},() => {
  const layerOptions = ['base','detail','outline','shadow'];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnOpen(({ metadata, partCount, selected }) => {
        this.setState({ metadata, pool: selected, selectedLayers: {}, targetLayer: "base", part: undefined });
      });
      this.onClose = props.onClose;
    }
    render() {
      return <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">

        </div>
        <div className="d-flex justify-content-center flex-wrap">

        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => this.onClose({ selectedLayers: this.state.selectedLayers })}>Apply</button>
          <button className="btn btn-danger" onClick={() => this.onClose()}>Cancel</button>
        </div>
      </div>;
    }
  }
});