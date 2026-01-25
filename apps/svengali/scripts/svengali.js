namespace('sp.svengali.Svengali',{
  'sp.common.ColorPicker': 'ColorPicker',
  'sp.common.Colors': 'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities': 'Utilities',

  'sp.svengali.CardDisplay':'CardDisplay'
},({ LoadFile, Dialog, Header, CardDisplay }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [];
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        activeTab: 'Layout',
        activeLayer: -1,
        layers: [],
        data: [],
        schema: [],
      };
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.setColorFromPicker(index, color);
          },
        },
      });
      this.menuItems = [
        {
          id: 'about',
          label: 'About',
          callback: () => {
            Dialog.alert({ title: "Svengali", lines: about });
          },
        },
      ]
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
      return <>
        <Header menuItems={this.menuItems} appTitle={'Svengali'} />
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
      </>;
    }
  }
});