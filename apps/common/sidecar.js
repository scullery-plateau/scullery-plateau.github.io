namespace("sp.common.Sidecar",{},({}) => {
  const Sidecar = function(sidecarName, initHTML, appRootId, loadEvent, ComponentClass) {
    const sidecarUpdateEvent = 'sidecar.' + sidecarName + '.update';
    const state = {};
    this.open = function(onOpenComplete) {
      const sidecar = window.open();
      sidecar.document.addEventListener(loadEvent,() => {
        const appRoot = sidecar.document.getElementById(appRootId);
        if (appRoot) {
          ReactDOM.createRoot(sidecar.document.getElementById(appRootId)).render(
            <ComponentClass
              setOnUpdate={(setter) => {
                sidecar.document.addEventListener(sidecarUpdateEvent, (e) => {
                  setter(e.detail);
                });
              }}/>);
          onOpenComplete();
        }
      });
      sidecar.document.write(initHTML);
      state.sidecar = sidecar;
    }
    this.update = function(detail) {
      if (state.sidecar) {
        state.sidecar.document.dispatchEvent(new CustomEvent(sidecarUpdateEvent, { detail }));
      }
    }
  };
  Sidecar.build = function({ sidecarName, initHTML, appRootId, loadEvent, componentClass }) {
    return new Sidecar(sidecarName, initHTML, appRootId, loadEvent, componentClass);
  }
  return Sidecar;
});