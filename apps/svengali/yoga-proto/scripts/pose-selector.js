namespace("sp.yoga-proto.PoseSelector", {
  "sp.yoga-proto.PoseData": "PoseData",
  "sp.common.Utilities":"util",
}, ({ PoseData, util }) => {
  const borderClass = "border border-success border-5"
  const selectionKey = function(category, name) {
    return category + ": " + name;
  }
  const parseSelectionKey = function(key) {
    const [category, name] = key.split(": ");
    return {category, name};
  }
  const PoseSelector = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = util.merge(PoseData, props, { selected:{}, collapsed: {} });
      props.setOnOpen((selected) => this.setState({ selected }));
      this.close = props.close;
    }
    toggleCollapse(e, category) {
      e.preventDefault();
      const { collapsed } = this.state;
      collapsed[category] = !collapsed[category];
      this.setState({ collapsed });
    }
    isSelected(category, name) {
      return this.state.selected[selectionKey(category,name)];
    }
    toggleSelected(e, category, name) {
      e.preventDefault();
      const key = selectionKey(category,name);
      const { selected } = this.state;
      selected[key] = ! selected[key];
      this.setState({ selected });
    }
    render() {
      return <div className="d-flex flex-column">
        <h2>Select Poses</h2>
        { Object.entries(this.state.categories).map(([category, { firstRow, maxRowWidth, names }]) => {
          return <>
            <div className="card mb-3">
              <div className="card-header bg-dark text-center">
                <a className="btn btn-dark" href="#" onClick={(e) => this.toggleCollapse(e, category)}>
                  <h3>{category}</h3>
                </a>
              </div>
              { !this.state.collapsed[category] && 
                <div className="card-body bg-info">
                  <div className="d-flex flex-wrap justify-content-around">
                    { names.map((name, index) => {
                      const col = index % maxRowWidth;
                      const row = firstRow + Math.floor(index / maxRowWidth);
                      return <div className={`thumbnail m-2 rounded ${this.isSelected(category,name)?borderClass:''}`}>
                        <a href="#" onClick={(e) => this.toggleSelected(e,category,name)}>
                          <img width="100%" height="100%" alt={name} title={name} src={`./gallery/pose${col}x${row}.png`}/>
                        </a>
                      </div>;
                    })}
                  </div>
                </div>
              }
            </div>
          </>;
        })}
        <div className="d-flex justify-content-right">
          <button className="btn btn-success" onClick={() => this.close(this.state.selected)}>Accept Selected Poses</button>
          <button className="btn btn-danger" onClick={() => this.close()}>Cancel</button>
        </div>
      </div>;
    }
  }
  PoseSelector.selectionKey = selectionKey;
  PoseSelector.parseSelectionKey = parseSelectionKey;
  return PoseSelector;
});