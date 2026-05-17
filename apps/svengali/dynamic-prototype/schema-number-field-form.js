namespace("dynamic-prototype.SchemaNumberFieldForm", {}, () => {
  class SchemaNumberFieldForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        label: 'Experience Points',
        min: 0,
        max: 999999,
        step: 1
      };
    }

    handleInputChange = (e) => {
      const { id, value, type } = e.target;
      this.setState({ [id]: type === 'number' ? parseInt(value) : value });
    }

    render() {
      const { label, min, max, step } = this.state;
      return (
        <form className="schema-number-field-form">
          <h5>NumberField Field Type</h5>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="schema_label_nf" className="col-form-label">Label:</label></div>
            <div className="flex-fill p-2"><input type="text" id="schema_label_nf" className="form-control" value={label} onChange={this.handleInputChange} /></div>
            <div className="p-2"><span className="form-text text-info">ID: EXPERIENCE_POINTS</span></div>
          </div>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="min_value" className="col-form-label">Min:</label></div>
            <div className="flex-fill p-2"><input type="number" id="min_value" className="form-control" value={min} onChange={this.handleInputChange} /></div>
          </div>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="max_value" className="col-form-label">Max:</label></div>
            <div className="flex-fill p-2"><input type="number" id="max_value" className="form-control" value={max} onChange={this.handleInputChange} /></div>
          </div>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="step_value" className="col-form-label">Step:</label></div>
            <div className="flex-fill p-2"><input type="number" id="step_value" className="form-control" value={step} onChange={this.handleInputChange} /></div>
          </div>
        </form>
      );
    }
  }

  return SchemaNumberFieldForm;
});