namespace("dynamic-prototype.SchemaColumnForm", {}, () => {
  class SchemaColumnForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        column: 'Character Name',
        columns: ['Character Name', 'Experience Points', 'Character Class', 'Title Font', 'Accent Color', 'Character Portrait']
      };
    }

    handleColumnChange = (e) => {
      this.setState({ column: e.target.value });
    }

    render() {
      const { column, columns } = this.state;
      return (
        <form className="schema-column-form">
          <div className="d-flex align-items-center">
            <div className="p-2"><label htmlFor="schema_column" className="col-form-label">Column:</label></div>
            <div className="flex-fill p-2">
              <select id="schema_column" className="form-select" value={column} onChange={this.handleColumnChange}>
                {columns.map(col => <option key={col}>{col}</option>)}
              </select>
            </div>
            <div className="p-2"><button className="btn btn-sm btn-success" type="button" title="Add Column"><i className="fas fa-plus"></i></button></div>
            <div className="p-2"><button className="btn btn-sm btn-danger" type="button" title="Delete Column"><i className="fas fa-minus"></i></button></div>
          </div>
        </form>
      );
    }
  }

  return SchemaColumnForm;
});