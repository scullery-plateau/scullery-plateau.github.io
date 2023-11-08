namespace('sp.common.Dialog', () => {
  const Dialog = function (dialogName, ComponentClass, onClose, attrs, returnInputsOnEsc) {
    attrs = attrs || {};
    const modalOpenEvent = 'modal.' + dialogName + '.open';
    const dialog = document.createElement('dialog');
    Object.entries(attrs).forEach(([k, v]) => {
      dialog.setAttribute(k, v);
    });
    dialog.addEventListener("close",() => {
      if (onClose !== undefined && dialog.returnValue !== undefined) {
        onClose(dialog.returnValue);
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
          dialog.returnValue = value;
          dialog.close();
        }}/>);
    this.open = function (detail) {
      if (returnInputsOnEsc) {
        dialog.returnValue = detail;
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
  return Dialog;
});
