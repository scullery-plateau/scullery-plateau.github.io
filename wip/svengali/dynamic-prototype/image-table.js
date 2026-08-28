namespace("dynamic-prototype.ImageTable", {}, () => {
  class ImageTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        images: [
          { filename: 'hero.png', loaded: true, inDataTable: true, inTemplate: true },
          { filename: 'mage.png', loaded: true, inDataTable: true, inTemplate: false },
          { filename: 'staff.png', loaded: false, inDataTable: false, inTemplate: false }
        ]
      };
    }

    render() {
      const { images } = this.state;
      return (
        <table className="image-table table table-sm table-dark table-striped">
          <thead className="table-info">
            <tr>
              <th>Thumbnail</th>
              <th>Filename</th>
              <th>Loaded?</th>
              <th>In Data Table?</th>
              <th>In Template?</th>
            </tr>
          </thead>
          <tbody>
            {images.length > 0 ? (
              images.map((img, idx) => (
                <tr key={idx}>
                  <td>
                    <svg width="40" height="62" viewBox="0 0 40 62">
                      <rect x="2" y="2" width="36" height="58" rx="4" ry="4" fill="#cccccc" stroke="#666" strokeWidth="0.5"/>
                    </svg>
                  </td>
                  <td>{img.filename}</td>
                  <td>{img.loaded ? <i className="fas fa-check text-success"></i> : <i className="fas fa-xmark text-danger"></i>}</td>
                  <td>{img.inDataTable ? <i className="fas fa-check text-success"></i> : <i className="fas fa-xmark text-danger"></i>}</td>
                  <td>{img.inTemplate ? <i className="fas fa-check text-success"></i> : <i className="fas fa-xmark text-danger"></i>}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No images uploaded</td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }
  }

  return ImageTable;
});