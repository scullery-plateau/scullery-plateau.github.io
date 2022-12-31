namespace("sp.cobblestone.TileEditor",{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.onClose = props.onClose;
      props.setOnOpen(({filename,context}) => {
        this.context = context;
        this.setState({filename});
      });
    }
    render() {
      return <></>;
    }
  }
})