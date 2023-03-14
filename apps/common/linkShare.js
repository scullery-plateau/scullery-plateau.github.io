namespace('sp.common.LinkShare',{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnOpen((url) => {
        console.log({ url });
        this.setState({ url })
      })
      this.onClose = props.onClose;
    }
    render() {
      return <div className="d-flex flex-column">
        { this.state.url &&
          <div className="input-group">
            <label htmlFor="shareLink" className="input-group-text">URL</label>
            <input
              id="shareLink"
              type="text"
              className="form-control"
              readOnly={true}
              value={ this.state.url }/>
          </div> }
        <div className="d-flex justify-content-end">
          { this.state.url &&
            <button className="btn btn-success" onClick={() => {
              navigator.clipboard.writeText(this.state.url);
            }}>Copy To Clipboard</button> }
          <button className="btn btn-danger" onClick={() => this.onClose()}>Close</button>
        </div>
      </div>
    }
  }
})