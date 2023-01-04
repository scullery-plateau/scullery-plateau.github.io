namespace('sp.cobblestone.Download',{},() => {
  const defaultFilename = "cobblestone";
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {scale:5,filename:defaultFilename};
      this.onClose = props.onClose();
      props.setOnOpen(({images,tiles,placements,size,orientation}) => {
        this.setState({images,tiles,placements,size,orientation});
      });
    }
    downloadData() {
      const {images,tiles,placements,size,orientation,filename} = this.state;
      Utilities.triggerJSONDownload(
        filename,
        defaultFilename,
        {images,tiles,placements,size,orientation}
      );
    }
    render() {
      // todo - dra
      return <div className="d-flex flex-columns">
        { /* todo */ }
        <div className="d-flex justify-content-end">
          <button className="btn btn-info" onClick={() => { this.downloadData() }}>Download Datafile</button>
          <button className="btn btn-warning" onClick={() => { this.onClose() }}>Close</button>
        </div>
      </div>;
    }
  }
});