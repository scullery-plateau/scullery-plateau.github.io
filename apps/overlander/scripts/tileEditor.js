namespace('sp.overlander.TileEditor',{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.close = props.close;
      props.setOnOpen(({ tile }) => {
        this.setState(tile);
      })
    }
    render() {
      return <></>;
    }
  }
});
