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
      return (<>
        { this.state.map && 
          <div style={{ 
            backgroundImage: `url(${this.state.map})`,
            width: '20em',
            height: '20em',
          }}></div>
      
        }
      </>);
    }
  }
});