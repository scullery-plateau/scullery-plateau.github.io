namespace("dynamic-prototype.TemplateLayerForm", {}, () => {
  class TemplateLayerForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedLayer: props.selectedLayer || 'Layer 1',
        layers: props.layers || ['Layer 1', 'Layer 2']
      };
    }

    addLayer = () => {
      const newLayer = `Layer ${this.state.layers.length + 1}`;
      this.setState({ layers: [...this.state.layers, newLayer] });
    }

    deleteLayer = () => {
      const { layers, selectedLayer } = this.state;
      const filtered = layers.filter(l => l !== selectedLayer);
      this.setState({ layers: filtered, selectedLayer: filtered[0] || null });
    }

    render() {
      const { selectedLayer, layers } = this.state;
      return (
        <form className="template-layer-form">
          <div className="d-flex align-items-center">
            <div className="p-1"><label htmlFor="template_layer" className="col-form-label">Layer:</label></div>
            <div className="flex-fill p-2">
              <select id="template_layer" className="form-select" value={selectedLayer} onChange={(e) => this.setState({ selectedLayer: e.target.value })}>
                {layers.map(layer => <option key={layer}>{layer}</option>)}
              </select>
            </div>
            <div className="p-1"><button className="btn btn-success" type="button" onClick={this.addLayer} title="Add Layer"><i className="fas fa-plus"></i></button></div>
            <div className="p-1"><button className="btn btn-danger" type="button" onClick={this.deleteLayer} title="Delete Layer"><i className="fas fa-minus"></i></button></div>
            <div className="p-1"><button className="btn btn-secondary" type="button" title="Move To Back"><i className="fas fa-angles-left"></i></button></div>
            <div className="p-1"><button className="btn btn-secondary" type="button" title="Move Back One"><i className="fas fa-chevron-left"></i></button></div>
            <div className="p-1"><button className="btn btn-secondary" type="button" title="Move Forward One"><i className="fas fa-chevron-right"></i></button></div>
            <div className="p-1"><button className="btn btn-secondary" type="button" title="Move To Front"><i className="fas fa-angles-right"></i></button></div>
          </div>
        </form>
      );
    }
  }

  return TemplateLayerForm;
});