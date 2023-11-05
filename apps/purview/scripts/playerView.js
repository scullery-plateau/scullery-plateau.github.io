namespace("sp.purview.PlayerView",{

},({}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnUpdate((detail) => {
        this.setState(detail);
      })
    }
    render() {
      return (<></>);
    }
  }
});