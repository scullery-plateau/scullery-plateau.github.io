namespace("dynamic-prototype.SchemaTextFieldForm", {}, () => {
  class SchemaTextFieldForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        label: 'Character Name',
        minLength: 1,
        maxLength: 100
      };
    }

    handleInputChange = (e) => {
      const { id, value, type } = e.target;
      this.setState({ [id]: type === 'number' ? parseInt(value) : value });
    }

    render() {
      const { label, minLength, maxLength } = this.state;
      return (
        <form className="schema-text-field-form">
          <h5>TextField Field Type</h5>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="schema_label_tf" className="col-form-label">Label:</label></div>
            <div className="flex-fill p-2"><input type="text" id="schema_label_tf" className="form-control" value={label} onChange={this.handleInputChange} /></div>
            <div className="p-2"><span className="form-text text-info">ID: CHARACTER_NAME</span></div>
          </div>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="min_length" className="col-form-label">Min Length:</label></div>
            <div className="flex-fill p-2"><input type="number" id="min_length" className="form-control" value={minLength} onChange={this.handleInputChange} /></div>
          </div>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="max_length" className="col-form-label">Max Length:</label></div>
            <div className="flex-fill p-2"><input type="number" id="max_length" className="form-control" value={maxLength} onChange={this.handleInputChange} /></div>
          </div>
        </form>
      );
    }
  }

  return SchemaTextFieldForm;
});