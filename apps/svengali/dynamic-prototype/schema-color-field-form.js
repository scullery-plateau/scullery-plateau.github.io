namespace("dynamic-prototype.SchemaColorFieldForm", {}, () => {
  class SchemaColorFieldForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        label: 'Accent Color',
        defaultColor: '#FF5733'
      };
    }

    handleInputChange = (e) => {
      const { id, value } = e.target;
      this.setState({ [id]: value });
    }

    render() {
      const { label, defaultColor } = this.state;
      return (
        <form className="schema-color-field-form">
          <h5>Color Field Type</h5>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="schema_label_color" className="col-form-label">Label:</label></div>
            <div className="flex-fill p-2"><input type="text" id="schema_label_color" className="form-control" value={label} onChange={this.handleInputChange} /></div>
            <div className="p-2"><span className="form-text text-info">ID: ACCENT_COLOR</span></div>
          </div>
          <div className="d-flex align-items-center mt-3">
            <div className="flex-fill p-2">
              <button type="button" className="btn btn-secondary w-100" style={{backgroundColor: defaultColor, color: '#FFFFFF'}}>Default Color</button>
            </div>
          </div>
        </form>
      );
    }
  }

  return SchemaColorFieldForm;
});