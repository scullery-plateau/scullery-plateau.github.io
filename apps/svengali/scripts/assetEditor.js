namespace('sp.svengali.AssetEditor',{
  'sp.common.LoadFile':'LoadFile'
},({ LoadFile }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.setOnOpen(({ datatable }) => { this.setState({
        datatable,
        columns:{},
        images:{}
      }) });
      this.onClose = props.onClose;
    }
    complete() {
      const { columns, images } = this.state;
      this.onClose({ columns, images });
    }
    render() {
      return <>

      </>;
    }
  }
})