namespace(
  'sp.common.ColorPicker',
  {
    'sp.common.Utilities': 'Utilities',
    'sp.common.Colors': 'Colors',
  },
  ({ Utilities, Colors }) => {
    const localStorageKey = "ColorPickerStoredColors";
    const hexFromXY = function (x, y) {
      const r = 3 * Math.floor(x / 6) + Math.floor(y / 6);
      const g = x % 6;
      const b = y % 6;
      return Utilities.hexFromRGB.apply(
        null,
        [r, g, b].map((c) => {
          c *= 3;
          return c + c * 16;
        })
      );
    };
    const setRGB = function (hexColor) {
      const rgb = Utilities.rgbFromHex(hexColor);
      if (rgb) {
        rgb.hex = hexColor;
        return rgb;
      }
    };
    const setColorPart = function (state, colorPart, colorValue) {
      const newState = Utilities.merge(state);
      newState[colorPart] = colorValue;
      newState.hex = Utilities.hexFromRGB(
        newState.red,
        newState.green,
        newState.blue
      );
      return newState;
    };
    const loadStoredColors = function(savedColorArray) {
      const storedColors = localStorage.getItem(localStorageKey);
      if (storedColors) {
        JSON.parse(storedColors).forEach((color) => {
          savedColorArray.push(color);
        })
      }
    }
    const buildInitState = function () {
      const savedColors = [];
      loadStoredColors(savedColors)
      return {
        hex: '',
        red: 0,
        green: 0,
        blue: 0,
        savedColors
      };
    };
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = buildInitState();
        props.setOnOpen(({ color, index }) => {
          const savedColors = Array.from(this.state.savedColors);
          loadStoredColors(savedColors);
          this.setState(Utilities.merge(setRGB(color),{ savedColors }));
          this.index = index;
        });
        this.onClose = props.onClose;
      }
      saveColor() {
        const savedColors = Array.from(this.state.savedColors);
        if (savedColors.indexOf(this.state.hex) === -1) {
          savedColors.push(this.state.hex);
          this.setState({ savedColors });
          localStorage.setItem(localStorageKey,JSON.stringify(savedColors));
        }
      }
      buildColorInput(id, label, colorPart) {
        return <div className="form-group">
          <label htmlFor={id}>{label}:</label>
          <input
            id={id}
            type="number"
            min="0"
            max="255"
            className="form-control"
            value={this.state[colorPart]}
            onChange={ (e) => {
              this.setState(
                setColorPart(this.state, colorPart, e.target.value)
              );
            }}
          />
        </div>;
      }
      buildColorOption(label, value) {
        return <option
          key={label}
          value={value}
          style={{
            color: Utilities.getForegroundColor(value),
            backgroundColor: value,
          }}>{label}</option>
      }
      render() {
        return (
          <div className="d-flex justify-content-center color-picker">
            <div className="p-2">
              <table style={{ padding: 0, margin: 0 }}>
                <tbody>
                  {Array(18)
                    .fill('')
                    .map((_, y) => {
                      return (
                        <tr key={`row${y}`} style={{ padding: 0, margin: 0 }}>
                          {Array(12)
                            .fill('')
                            .map((_, x) => {
                              const hex = hexFromXY(x, y);
                              return (
                                <td
                                  key={`cell${hex}`}
                                  style={{ padding: 0, margin: 0 }}
                                >
                                  <button
                                    key={hex}
                                    title={`Color: #${hex}`}
                                    style={{ color: hex, backgroundColor: hex }}
                                    onClick={() => {
                                      this.setState(setRGB(hex));
                                    }}
                                  >
                                    _
                                  </button>
                                </td>
                              );
                            })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="d-flex flex-column p-2">
              <p
                className="rounded-lg"
                style={{
                  color: this.state.hex,
                  backgroundColor: this.state.hex,
                }}
              >
                __
              </p>
              <div className="form-group">
                <label htmlFor="hexColor">Color Hexcode:</label>
                <input
                  type="text"
                  className="form-control"
                  id="hexColor"
                  value={this.state.hex}
                  onChange={(e) => {
                    this.setState(setRGB(e.target.value));
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="colorByName">Color by Name (including Saved Colors):</label>
                <select
                  id="colorByName"
                  className="form-control"
                  value={this.state.hex}
                  onChange={(e) => {
                    this.setState(setRGB(e.target.value));
                  }}
                >
                  <option value={undefined}>Select</option>
                  {this.state.savedColors.map((color,index) => {
                    const label = `Saved Color #${index+1}: ${color}`;
                    return this.buildColorOption(label, color);
                  })}
                  {Colors.getColorNames().map((colorName) => {
                    const hex = Colors.getColorByName(colorName);
                    return this.buildColorOption(colorName, hex);
                  })}
                </select>
              </div>
              <hr />
              <div className="d-flex">
                { this.buildColorInput('redColor', 'Red', 'red') }
                { this.buildColorInput('greenColor', 'Green', 'green') }
                { this.buildColorInput('blueColor', 'Blue', 'blue') }
              </div>
              <hr />
              <div>
                <button
                  onClick={ () => {
                    localStorage.setItem(localStorageKey,JSON.stringify(this.state.savedColors));
                    this.onClose({color: this.state.hex, index: this.index});
                  }}
                  className="btn btn-success">Use Color</button>
                <button onClick={ () => { this.saveColor() } } className="btn btn-info">Save Color</button>
                <button onClick={ () => {
                  localStorage.setItem(localStorageKey,JSON.stringify(this.state.savedColors));
                  this.onClose();
                }} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        );
      }
    };
  }
);
