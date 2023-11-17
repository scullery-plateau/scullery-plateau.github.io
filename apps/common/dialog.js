namespace('sp.common.Dialog', () => {
  const Dialog = function (dialogName, ComponentClass, onClose, attrs, returnInputsOnEsc) {
    attrs = attrs || {};
    const state = {};
    const modalOpenEvent = 'modal.' + dialogName + '.open';
    const dialog = document.createElement('dialog');
    Object.entries(attrs).forEach(([k, v]) => {
      dialog.setAttribute(k, v);
    });
    dialog.addEventListener("close",(e) => {
      if (onClose !== undefined && state.returnValue !== undefined) {
        onClose(state.returnValue);
      }
      if (dialog.parentElement) {
        dialog.parentElement.removeChild(dialog);
      }
    });
    ReactDOM.createRoot(dialog).render(
      <ComponentClass
        setOnOpen={(setter) => {
          document.addEventListener(modalOpenEvent, (e) => {
            setter(e.detail);
          });
        }}
        close={(value) => {
          state.returnValue = value;
          dialog.close();
        }}/>);
    this.open = function (detail) {
      if (returnInputsOnEsc) {
        state.returnValue = detail;
      }
      document.body.appendChild(dialog);
      dialog.showModal();
      document.dispatchEvent(new CustomEvent(modalOpenEvent, { detail }));
    };
  };
  Dialog.factory = function (dialogMap) {
    return Object.entries(dialogMap).reduce((out, [dialogName, { componentClass, onClose, attrs }]) => {
      out[dialogName] = new Dialog(dialogName, componentClass, onClose, attrs);
      return out;
    }, {});
  };
  const AlertDialogComponent = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { lines: [] };
      this.close = props.close;
      props.setOnOpen((settings) => {
        console.log({ settings, setOnOpen: true });
        this.setState(settings);
      });
    }
    render() {
      return (
        <>
          <h3>{this.state.title}</h3>
          { this.state.lines.map((p, i) => (
            <p key={`alert-dialog-${i}`}>{p}</p>
          ))}
          <div className="d-flex justify-content-end">
            <button className="btn btn-info" onClick={() => this.close()}>OK</button>
          </div>
        </>
      );
    }
  }
  const ConfirmDialogComponent = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { lines: [] };
      this.close = props.close;
      props.setOnOpen((settings) => {
        this.setState(settings);
      });
    }
    render() {
      return (
        <>
          <h3>{this.state.title}</h3>
          { this.state.lines.map((p, i) => (
            <p key={`confirm-dialog-${i}`}>{p}</p>
          ))}
          <div className="d-flex justify-content-end">
            <button className="btn btn-info" onClick={() => {
              this.state.onConfirm();
              this.close();
            }}>{this.state.confirmButtonText?this.state.confirmButtonText:'Confirm'}</button>
            <button className="btn btn-info" onClick={() => {
              this.state.onCancel();
              this.close();
            }}>{this.state.cancelButtonText?this.state.cancelButtonText:'Cancel'}</button>
          </div>
        </>
      );
    }
  }
  const PromptDialogComponent = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { lines: [] };
      this.close = props.close;
      props.setOnOpen((settings) => {
        this.setState(settings);
      });
    }
    render() {
      return (
        <>
          <h3>{this.state.title}</h3>
          { this.state.lines.map((p, i) => (
            <p key={`prompt-dialog-${i}`}>{p}</p>
          ))}
          <div className="form-group">
            <label 
              className="text-light form-label" 
              htmlFor="promptField">{this.state.label}</label>
            <input
              type="text"
              className="form-control"
              id="promptField"
              name="promptField"
              placeholder={this.state.placeholder}
              value={this.state.promptValue}
              style={this.state.inputStyle}
              onChange={(e) => this.setState({ promptValue: e.target.value })}/>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-info" onClick={() => {
              this.state.onResponse(this.state.promptValue);
              this.close();
            }}>OK</button>
            <button className="btn btn-info" onClick={() => {
              this.state.onCancel();
              this.close();
            }}>Cancel</button>
          </div>
        </>
      );
    }
  }
  const modalClasses = {
    alert: AlertDialogComponent,
    confirm: ConfirmDialogComponent,
    prompt: PromptDialogComponent
  }
  const modals = {};
  Dialog.initializeModals = function(modalTypes,attrs) {
    attrs = attrs || {};
    (modalTypes || [ "alert", "confirm", "prompt" ]).forEach((modalType) => {
      if (!modals[modalType]) {
        const componentClass = modalClasses[modalType];
        if (componentClass) {
          const factoryArgs = {};
          factoryArgs[modalType] = { componentClass, attrs };
          modals[modalType] = Dialog.factory(factoryArgs)[modalType];
        }
      }
    });
  }
  Dialog.alert = function(settings) {
    modals.alert.open(settings);
  }
  Dialog.confirm = function(settings) {
    modals.confirm.open(settings);
  }
  Dialog.prompt = function(settings) {
    modals.prompt.open(settings);
  }
  return Dialog;
});
