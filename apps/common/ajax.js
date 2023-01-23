namespace("sp.common.Ajax",{},() => {
  const callbackEvents = {
    success: 'AjaxSuccess',
    failure: 'AjaxFailure',
    stateChange: 'AjaxStateChanged',
  };
  const defaultCallbacks = Object.entries(callbackEvents).reduce(
    (out, [k, v]) => {
      out[k] = (arg) => {
        document.dispatchEvent(new CustomEvent(v, { detail: arg }));
      };
      return out;
    },
    {}
  );
  const getLocalStaticFileAsText = function (filepath, callbacks) {
    console.log(filepath);
    if (typeof callbacks == 'function') {
      callbacks = {
        success: callbacks,
      };
    }
    callbacks = Object.entries(callbacks).reduce((out, [k, v]) => {
      out[k] = v;
      return out;
    }, defaultCallbacks);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          callbacks.success(this.responseText);
        } else {
          callbacks.failure({
            requestedFile: filepath,
            status: this.status,
            statusText: this.statusText,
            responseText: this.responseText,
          });
        }
      } else {
        callbacks.stateChange({
          state: this.readyState,
          min: 0,
          max: 4,
        });
      }
    };
    xhttp.open('GET', filepath, true);
    xhttp.send();
  };
  return { getLocalStaticFileAsText }
});
