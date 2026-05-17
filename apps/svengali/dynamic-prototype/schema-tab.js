namespace("dynamic-prototype.SchemaTab", {}, () => {
  class SchemaTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        columns: [
          { id: 'CHARACTER_NAME', label: 'Character Name', type: 'TextField', minLength: 1, maxLength: 100 },
          { id: 'EXPERIENCE_POINTS', label: 'Experience Points', type: 'NumberField', min: 0, max: 999999, step: 1 },
          { id: 'CHARACTER_CLASS', label: 'Character Class', type: 'Options' },
          { id: 'TITLE_FONT', label: 'Title Font', type: 'Font' },
          { id: 'ACCENT_COLOR', label: 'Accent Color', type: 'Color', default: '#FF5733' },
          { id: 'CHARACTER_PORTRAIT', label: 'Character Portrait', type: 'ImageData' }
        ]
      };
    }

    render() {
      const { columns } = this.state;
      return (
        <div className="schema-tab">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Columns</label>
              <div className="border rounded p-3 overflow-auto" style={{maxHeight: '500px'}}>
                <ul>
                  {columns.map(col => (
                    <li key={col.id} className="p-2">
                      <strong>{col.label}</strong>
                      <ul>
                        <li>ID: {col.id}</li>
                        <li>Type: {col.type}</li>
                        {col.minLength !== undefined && <li>Min Length: {col.minLength}</li>}
                        {col.maxLength !== undefined && <li>Max Length: {col.maxLength}</li>}
                        {col.min !== undefined && <li>Min: {col.min}</li>}
                        {col.max !== undefined && <li>Max: {col.max}</li>}
                        {col.step !== undefined && <li>Step: {col.step}</li>}
                        {col.default && <li>Default: {col.default}</li>}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6"><label className="form-label">Edit Column</label><div className="border rounded p-3">{/* Schema form will be rendered here */}</div></div>
          </div>
        </div>
      );
    }
  }

  return SchemaTab;
});