namespace("dynamic-prototype.ImageTab", {}, () => {
  class ImageTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isPopulated: true
      };
    }

    render() {
      return (
        <div className="image-tab">
          <div className="mb-3 text-center">
            <button className="btn btn-primary" type="button"><i className="fas fa-upload"></i> Load Image</button>
            <button className="btn btn-danger" type="button"><i className="fas fa-trash"></i> Delete Unused</button>
          </div>
          <div className="overflow-auto">{/* ImageTable component will render here */}</div>
          <div className="mt-3 text-end">
            <button className="btn btn-success btn-sm" type="button"><i className="fas fa-check"></i> Update</button>
            <button className="btn btn-secondary btn-sm" type="button"><i className="fas fa-times"></i> Cancel</button>
          </div>
        </div>
      );
    }
  }

  return ImageTab;
});