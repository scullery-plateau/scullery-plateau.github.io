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
      this.close = props.close;
    }
    complete() {
      const { columns, images } = this.state;
      this.close({ columns, images });
    }
    render() {
      return <>

      </>;
    }
  }
})