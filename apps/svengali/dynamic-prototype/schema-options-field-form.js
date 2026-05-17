namespace("dynamic-prototype.SchemaOptionsFieldForm", {}, () => {
  class SchemaOptionsFieldForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        label: 'Character Class',
        options: ['Barbarian', 'Bard', 'Cleric', 'Fighter', 'Ranger', 'Rogue', 'Wizard']
      };
    }

    handleInputChange = (e) => {
      const { id, value } = e.target;
      this.setState({ [id]: value });
    }

    handleOptionChange = (index, value) => {
      const { options } = this.state;
      const newOptions = [...options];
      newOptions[index] = value;
      this.setState({ options: newOptions });
    }

    addOption = () => {
      const { options } = this.state;
      this.setState({ options: [...options, 'New Option'] });
    }

    removeOption = (index) => {
      const { options } = this.state;
      this.setState({ options: options.filter((_, i) => i !== index) });
    }

    render() {
      const { label, options } = this.state;
      return (
        <form className="schema-options-field-form">
          <h5>Options Field Type</h5>
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="schema_label_opt" className="col-form-label">Label:</label></div>
            <div className="flex-fill p-2"><input type="text" id="schema_label_opt" className="form-control" value={label} onChange={this.handleInputChange} /></div>
            <div className="p-2"><span className="form-text text-info">ID: CHARACTER_CLASS</span></div>
          </div>
          <label className="form-label mt-3">Options</label>
          <div className="p-2">
            <ol>
              {options.map((option, index) => (
                <li key={index} className="d-flex justify-content-center mb-2">
                  <input type="text" className="form-control" value={option} onChange={(e) => this.handleOptionChange(index, e.target.value)} />
                  <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => this.removeOption(index)}>
                    <i className="fa fa-xmark"></i>
                  </button>
                </li>
              ))}
              <li className="d-flex justify-content-center mb-2">
                <button type="button" className="btn btn-sm btn-success" onClick={this.addOption}>Add Option</button>
              </li>
            </ol>
          </div>
        </form>
      );
    }
  }

  return SchemaOptionsFieldForm;
});