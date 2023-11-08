namespace('sp.common.Dialog', () => {
  const Dialog = function (dialogName, ComponentClass, close, attrs) {
    attrs = attrs || {};
    const modalOpenEvent = 'modal.' + dialogName + '.open';
    const dialog = document.createElement('dialog');
    Object.entries(attrs).forEach(([k, v]) => {
      dialog.setAttribute(k, v);
    });
    dialog.addEventListener("close",() => {
      if (close !== undefined && dialog.returnValue !== undefined) {
        close(dialog.returnValue);
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
      document.body.appendChild(dialog);
      dialog.showModal();
      document.dispatchEvent(new CustomEvent(modalOpenEvent, { detail }));
    };
  };
  Dialog.factory = function (dialogMap) {
    return Object.entries(dialogMap).reduce((out, [dialogName, { componentClass, close, attrs }]) => {
      out[dialogName] = new Dialog(dialogName, componentClass, close, attrs);
      return out;
    }, {});
  };
  return Dialog;
});
