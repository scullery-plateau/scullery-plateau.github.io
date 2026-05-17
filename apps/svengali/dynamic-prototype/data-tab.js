namespace("dynamic-prototype.DataTab", {}, () => {
  class DataTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentRow: 'Row 1 of 3',
        totalRows: 3
      };
    }

    render() {
      const { currentRow, totalRows } = this.state;
      return (
        <div className="data-tab">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="p-2"><label htmlFor="rows" className="col-form-label">Row Selector:</label></div>
                <div className="flex-fill p-2">
                  <select id="rows" className="form-select" value={currentRow}>
                    {Array.from({length: totalRows}, (_, i) => <option key={i} value={`Row ${i + 1} of ${totalRows}`}>Row {i + 1} of {totalRows}</option>)}
                  </select>
                </div>
                <div className="p-2"><button className="btn btn-sm btn-success" type="button" title="Add Row"><i className="fas fa-plus"></i></button></div>
                <div className="p-2"><button className="btn btn-sm btn-danger" type="button" title="Delete Row"><i className="fas fa-minus"></i></button></div>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center"><svg width="50%" height="100%" viewBox="0 0 225 350"><rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" strokeWidth="1"/></svg></div>
          </div>
        </div>
      );
    }
  }

  return DataTab;
});