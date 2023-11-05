namespace('sp.common.Dialog', () => {
  const Dialog = function (dialogName, ComponentClass, onClose, attrs) {
    attrs = attrs || {};
    const modalOpenEvent = 'modal.' + dialogName + '.open';
    const dialog = document.createElement('dialog');
    Object.entries(attrs).forEach(([k, v]) => {
      dialog.setAttribute(k, v);
    });
    ReactDOM.createRoot(dialog).render(
      <ComponentClass
        setOnOpen={(setter) => {
          document.addEventListener(modalOpenEvent, (e) => {
            setter(e.detail);
          });
        }}
        onClose={(value) => {
          if (onClose !== undefined && value !== undefined) {
            onClose(value);
          }
          dialog.close();
          if (dialog.parentElement) {
            dialog.parentElement.removeChild(dialog);
          }
        }}/>);
    this.open = function (detail) {
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
