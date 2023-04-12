namespace('sp.svengali.Svengali',{
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Dialog':'Dialog',
    'sp.common.Header':'Header'
},() => {
    const sizeUnits = "mm";
    const cardSize = { min: 64, max: 89 };
    const pageSize = { min: 216, max: 279 };
    const buildTemplateFn = function(columns, markdown) {
        return eval("({" + columns.join(",") + "}) => marked.parse(`" + markdown + "`)");
    }
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {};
        }
        loadDatafile() {

        }
        render() {
            return <>
                { !this.state.datatable &&
                  <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                            this.loadDatafile();
                        }}>Load Data File</button>
                  </div> }
                { this.state.datatable &&
                  <div className="rpg-box text-light m-1 d-flex justify-content-center">
                      <div className="d-flex flex-column">

                      </div>
                      <div className="d-flex flex-column">

                      </div>
                  </div> }
            </>;
        }
    }
});