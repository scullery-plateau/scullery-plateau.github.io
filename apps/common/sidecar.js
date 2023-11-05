namespace("sp.common.Sidecar",{},({}) => {
  const Sidecar = function(sidecarName, initHTML, appRootId, ComponentClass) {
    const sidecarUpdateEvent = 'sidecar.' + sidecarName + '.update';
    const state = {};
    this.open = function() {
      const sidecar = window.open();
      sidecar.document.write(initHTML);
      ReactDOM.createRoot(sidecar.document.getElementById(appRootId)).render(
        <ComponentClass
          setOnUpdate={(setter) => {
            sidecar.document.addEventListener(sidecarUpdateEvent, (e) => {
              setter(e.detail);
            });
          }}/>);
      state.sidecar = sidecar;
    }
    this.update = function(detail) {
      if (state.sidecar) {
        state.sidecar.document.dispatchEvent(new CustomEvent(sidecarUpdateEvent, { detail }));
      }
    }
  };
  Sidecar.build = function({ sidecarName, initHTML, appRootId, componentClass }) {
    return new Sidecar(sidecarName, initHTML, appRootId, componentClass);
  }
  return Sidecar;
});