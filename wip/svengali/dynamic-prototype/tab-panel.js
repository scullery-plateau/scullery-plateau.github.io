namespace("dynamic-prototype.TabPanel", {}, () => {
  class TabPanel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeTab: props.activeTab || 'template'
      };
    }

    render() {
      const { activeTab } = this.state;
      const tabs = ['template', 'data', 'schema', 'image', 'fontPool'];
      
      return (
        <div className="tab-panel">
          <div className="nav nav-tabs mb-3 gap-1">
            {tabs.map(tab => (
              <button 
                key={tab}
                className={`nav-link ${activeTab === tab ? 'active' : 'bg-secondary text-light'} rounded-3`}
                onClick={() => this.setState({ activeTab: tab })}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {this.props.children}
          </div>
        </div>
      );
    }
  }

  return TabPanel;
});