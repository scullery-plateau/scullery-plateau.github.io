namespace(
  'sp.common.FileDownload',
  { 'sp.common.Utilities': 'Utilities' },
  ({ Utilities }) => {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.onClose = props.onClose;
        this.state = {};
        props.setOnOpen((state) => {
          this.setState(state);
        });
      }
      render() {
        return (
          <>
            <p>Feel free to enter a filename</p>
            <div className="form-group">
              <label className="text-light" htmlFor={this.state.fieldId}>
                Filename
              </label>
              <input
                type="text"
                className="form-control rpg-textbox"
                id={this.state.fieldId}
                placeholder={this.state.placeholder}
                value={this.state.filename}
                onChange={(e) => this.setState({ filename: e.target.value })}
              />
            </div>
            <div className="justify-content-end">
              <button
                className="btn btn-info"
                onClick={() => {
                  Utilities.triggerJSONDownload(
                    this.state.filename,
                    this.state.defaultFilename,
                    this.state.jsonData
                  );
                  this.onClose();
                }}
              >Download & Close</button>
            </div>
          </>
        );
      }
    };
  }
);
