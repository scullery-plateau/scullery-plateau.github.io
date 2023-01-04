namespace('sp.cobblestone.Publish',{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.onClose = props.onClose();
      props.setOnOpen(({images,tiles,placements,size,orientation}) => {
        this.setState({images,tiles,placements,size,orientation});
      });
    }
    render() {
      // todo
      return <>
        { /* todo */ }
      </>;
    }
  }
});