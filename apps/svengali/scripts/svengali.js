namespace('sp.svengali.Svengali',{
    'sp.common.LoadFile':'LoadFile',
    'sp.common.Dialog':'Dialog',
    'sp.common.Header':'Header',
    'sp.svengali.CardDisplay':'CardDisplay'
},({ LoadFile, Dialog, Header, CardDisplay }) => {
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
              activeTab: 'Layout',
              layers: [],
              data: [],
              schema: []
            };
        }
        setActiveTab(tabName) {
          this.setState({ activeTab: tabName });
        }
        isTabActive(tabName) {
          return this.state.activeTab == tabName;
        }
        buildColorPickerButton(label, fieldName) {
            return <button 
                className="btn"
                style={{
                }}
                onClick={() => {}}
                onDoubleClick={() => {}}
                onContextMenu={() => {}}
                >{label}</button>
        }
        render() {
            return <div>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className={`nav-link${this.isTabActive('Layout')?'active':''}`} href="#" onClick={() => this.setActiveTab('Layout')}>Layout</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link${this.isTabActive('Data')?'active':''}`} href="#" onClick={() => this.setActiveTab('Data')}>Data</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link${this.isTabActive('Schema')?'active':''}`} href="#" onClick={() => this.setActiveTab('Schema')}>Schema</a>
                </li>
              </ul>
              <div className="tab-content">
                { this.isTabActive('Layout') && <div className="row">
                  <div className="col-5">
                  </div>
                  <div className="col-5">
                    <CardDisplay layers="this.state.layers" data="this.state.data"/>
                  </div>
                </div> }
                { this.isTabActive('Data') && <div className="row">
                  <div className="col-5">
                  </div>
                  <div className="col-5">
                    <CardDisplay layers="this.state.layers" data="this.state.data"/>
                  </div>
                </div> }
                { this.isTabActive('Schema') && <div className="row">
                  <div className="col-5">
                  </div>
                  <div className="col-5">
                  </div>
                </div> }
              </div>
            </div>;
        }
    }
});