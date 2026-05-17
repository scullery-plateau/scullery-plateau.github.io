namespace("dynamic-prototype.FontPoolButton", {}, () => {
  class FontPoolButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isSelected: props.isSelected || false,
        fontFamily: props.fontFamily || 'Arial'
      };
    }

    render() {
      const { fontFamily, isSelected } = this.state;
      const buttonClass = isSelected ? 'btn btn-success disabled' : 'btn btn-info';
      return (
        <button className={buttonClass} style={{fontFamily}}>
          <h3>{fontFamily}</h3>
          <p>The Quick Brown Fox Jumped Over The Lazy Dog.</p>
        </button>
      );
    }
  }

  return FontPoolButton;
});