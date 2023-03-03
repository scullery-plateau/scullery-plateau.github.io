namespace('sp.outfitter.LayerGrouper',{},() => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnOpen(({}) => {

      });
      this.onClose = props.onClose;
    }
    render() {
      return <></>;
    }
  }
});