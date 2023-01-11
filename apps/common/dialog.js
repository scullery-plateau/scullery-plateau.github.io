namespace('sp.common.Dialog', () => {
  const Dialog = function (dialogName, TemplateClass, onClose, attrs) {
    attrs = attrs || {};
    const modalOpenEvent = 'modal.' + dialogName + '.open';
    const dialog = document.createElement('dialog');
    Object.entries(attrs).forEach(([k, v]) => {
      dialog.setAttribute(k, v);
    });
    ReactDOM.createRoot(dialog).render(
      <TemplateClass
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
          document.body.removeChild(dialog);
        }}/>);
    this.open = function (detail) {
      document.body.appendChild(dialog);
      dialog.showModal();
      document.dispatchEvent(new CustomEvent(modalOpenEvent, { detail }));
    };
  };
  Dialog.factory = function (dialogMap) {
    return Object.entries(dialogMap).reduce((out, [dialogName, { templateClass, onClose, attrs }]) => {
      out[dialogName] = new Dialog(dialogName, templateClass, onClose, attrs);
      return out;
    }, {});
  };
  return Dialog;
});
