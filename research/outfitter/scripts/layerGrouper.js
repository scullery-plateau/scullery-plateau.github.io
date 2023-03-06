namespace('sp.outfitter.LayerGrouper',{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.Utilities':'util',
  'sp.outfitter.LayerSVG':'LayerSVG'
},({ ColorPicker, Dialog, util, LayerSVG }) => {
  const layerOptions = ['base','detail','outline','shadow'];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        metadata: {},
        partCount: {},
        pool: {},
        selectedLayers: {},
        targetLayer: "base",
        part: undefined,
        layerColors: {}
      };
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
      this.modals = Dialog.factory({
        colorPicker:{
          templateClass: ColorPicker,
          attrs: {class: 'rpg-box text-light w-75'},
          onClose: ({ color, index }) => {
            const layerColors = util.merge(this.state.layerColors);
            layerColors[index] = color;
            this.setState({ layerColors });
          }
        }
      })
    }
    buildCompositeImage() {
      // todo
    }
    selectLayer(imageIndex) {
      // todo
    }
    render() {
      const partTypes = Array.from(Object.keys(this.state.partCount || {}));
      partTypes.sort();
      return <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          <table>
            <tbody>
              <tr>
                { layerOptions.map((layerOpt) => {
                  return <td>{ /* color button */ }</td>
                }) }
                <td>
                  {Object.keys(this.state.partCount).length > 0 &&
                    <select
                    value={this.state.part}
                    onChange={(e) => {
                      this.setState({part: e.target.value})
                    }}
                  >
                    <option> -- select part type --</option>
                    {Object.keys(this.state.partCount).sort().map((partType) => {
                      return <option value={partType}>{partType}</option>
                    })}
                  </select>}
                  <button className="btn btn-success" onClick={() => {
                    const partCount = util.merge(this.state.partCount);
                    const newPart = prompt('Please enter the name of a part to add to the list.');
                    partCount[newPart] = 0;
                    this.setState({ partCount });
                  }}>{Object.keys(this.state.partCount).length > 0?'+':'Add Part Type'}</button>
                </td>
              </tr>
              <tr>
                { layerOptions.map((layerOpt) => {
                  const imageIndex = this.state.selectedLayers[layerOpt];
                  if (imageIndex) {
                    return <td>
                      <LayerSVG
                        layer={this.state.metadata[imageIndex]}
                        imageIndex={imageIndex}
                        isSelected={() => {
                          return this.state.targetLayer === layerOpt;
                        }}
                        onClick={() => this.setState({ targetLayer: layerOpt }) }
                        />
                    </td>;
                  } else {
                    return <td>
                      <button
                        className={`btn ${this.state.targetLayer === layerOpt?"btn-success":"btn-secondary"}`}
                        onClick={() => this.setState({ targetLayer: layerOpt }) }
                      >{layerOpt} image</button>
                    </td>;
                  }
                }) }
                <td>{ this.buildCompositeImage() }</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center flex-wrap overflow-scroll" style={{ height: screen.availHeight * 0.6}}>
          { Object.keys(this.state.pool || {}).filter((key) => {
              return Object.values(this.state.selectedLayers || {}).indexOf(key) < 0
            }).map((imageIndex) => {
            return <LayerSVG
              layer={this.state.metadata[imageIndex]}
              imageIndex={imageIndex}
              isSelected={() => this.state.selectedLayers[imageIndex]}
              onClick={() => this.selectLayer(imageIndex)}/>;
            }) }
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => {
            const { selectedLayers, partCount } = this.state;
            this.onClose({ selectedLayers, partCount });
          }}>Apply</button>
          <button className="btn btn-danger" onClick={() => this.onClose()}>Cancel</button>
        </div>
      </div>;
    }
  }
});