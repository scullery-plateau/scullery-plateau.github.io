namespace("dynamic-prototype.DataForm", {}, () => {
  class DataForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        characterName: 'Aragorn',
        experiencePoints: 8500,
        characterClass: 'Ranger',
        titleFont: 'Georgia',
        characterPortrait: 'hero.png'
      };
    }

    handleInputChange = (e) => {
      const { id, value, type } = e.target;
      this.setState({ [id]: type === 'number' ? parseFloat(value) : value });
    }

    render() {
      const { characterName, experiencePoints, characterClass, titleFont, characterPortrait } = this.state;
      return (
        <form className="data-form">
          <div className="d-flex align-items-center"><div className="p-2"><label htmlFor="character_name" className="col-form-label">Character Name:</label></div><div className="flex-fill p-2"><input type="text" id="character_name" className="form-control" value={characterName} onChange={this.handleInputChange} /></div></div>
          <div className="d-flex align-items-center"><div className="p-2"><label htmlFor="experience_points" className="col-form-label">Experience Points:</label></div><div className="flex-fill p-2"><input type="number" id="experience_points" className="form-control" value={experiencePoints} onChange={this.handleInputChange} /></div></div>
          <div className="d-flex align-items-center"><div className="p-2"><label htmlFor="character_class" className="col-form-label">Character Class:</label></div><div className="flex-fill p-2"><select id="character_class" className="form-select" value={characterClass} onChange={this.handleInputChange}><option>Barbarian</option><option>Bard</option><option>Cleric</option><option>Fighter</option><option>Ranger</option><option>Rogue</option><option>Wizard</option></select></div></div>
          <div className="d-flex align-items-center"><div className="p-2"><label htmlFor="title_font" className="col-form-label">Title Font:</label></div><div className="flex-fill p-2"><select id="title_font" className="form-select" value={titleFont} onChange={this.handleInputChange}><option>Georgia</option><option>Arial</option><option>Times New Roman</option></select></div></div>
          <div className="d-flex align-items-center"><div className="flex-fill p-2"><button className="btn btn-secondary w-100" style={{backgroundColor: '#FF8C00', color: '#FFFFFF'}}>Accent</button></div></div>
          <div className="d-flex align-items-center"><div className="p-2"><label htmlFor="character_portrait" className="col-form-label">Character Portrait:</label></div><div className="flex-fill p-2"><select id="character_portrait" className="form-select" value={characterPortrait} onChange={this.handleInputChange}><option>hero.png</option><option>mage.png</option><option>staff.png</option></select></div></div>
        </form>
      );
    }
  }

  return DataForm;
});