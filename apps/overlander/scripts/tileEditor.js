namespace('sp.overlander.TileEditor',{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.onClose = props.onClose;
      props.setOnOpen(({ tile }) => {
        this.setState(tile);
      })
    }
    render() {
      return <></>;
    }
  }
});
