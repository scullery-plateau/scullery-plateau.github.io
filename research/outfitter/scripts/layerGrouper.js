namespace('sp.outfitter.LayerGrouper',{},() => {
  const layerOptions = ['base','detail','outline','shadow'];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnOpen(({ metadata, partCount, selected }) => {
        this.setState({ 
          metadata, 
          partCount,
           pool: selected,
            selectedLayers: {}, 
            targetLayer: "base", 
            part: undefined,
            layerColors: {} 
        });
      });
      this.onClose = props.onClose;
    }
    render() {
      const partTypes = Array.from(Object.keys(this.state.partCount));
      partTypes.sort();
      return <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          <table>
            <tbody>
              <tr>
                <td>
                  <button className="btn btn-success" onClick>Add Part Type</button>
                </td>
                { layerOptions.map((layerOpt) => {

                }) }
              </tr>
              <tr>
                <td>
                  <select
                    value={ this.state.part }
                    onChange
                  >

                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center flex-wrap">
          { Object.keys(this.state.pool).filter((key) => {
              return Object.values(this.state.selected).indexOf(key) < 0
            }).map(() => {
              return 
            }) }
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => this.onClose({ selectedLayers: this.state.selectedLayers })}>Apply</button>
          <button className="btn btn-danger" onClick={() => this.onClose()}>Cancel</button>
        </div>
      </div>;
    }
  }
});