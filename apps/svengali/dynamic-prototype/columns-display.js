namespace("dynamic-prototype.ColumnsDisplay", {}, () => {
  class ColumnsDisplay extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        columns: [
          { id: 'CHARACTER_NAME', label: 'Character Name', type: 'TextField' },
          { id: 'EXPERIENCE_POINTS', label: 'Experience Points', type: 'NumberField' },
          { id: 'CHARACTER_CLASS', label: 'Character Class', type: 'Options' },
          { id: 'TITLE_FONT', label: 'Title Font', type: 'Font' },
          { id: 'ACCENT_COLOR', label: 'Accent Color', type: 'Color' },
          { id: 'CHARACTER_PORTRAIT', label: 'Character Portrait', type: 'ImageData' }
        ]
      };
    }

    render() {
      const { columns } = this.state;
      return (
        <div className="columns-display">
          <label className="form-label">Columns</label>
          <div className="border rounded p-3 overflow-auto" style={{maxHeight: '500px'}}>
            <ul>
              {columns.map(col => (
                <li key={col.id} className="p-2">
                  <strong>{col.label}</strong>
                  <ul>
                    <li>ID: {col.id}</li>
                    <li>Type: {col.type}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }

  return ColumnsDisplay;
});