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
    if (typeof callbacks == 'function') {
      callbacks = {
        success: callbacks,
      };
    }
    callbacks = Object.entries(callbacks).reduce((out, [k, v]) => {
      out[k] = v;
      return out;
    }, defaultCallbacks);
    fetch(filepath)
      .then((response) => {
        if (response.ok) {
          return response.text().then((responseText) => {
            callbacks.success({
              requestedFile: filepath,
              responseText,
            });
          });
        } else {
          callbacks.failure({
            requestedFile: filepath,
            status: response.status,
            statusText: response.statusText,
          });
        }
      })
      .catch((error) => {
        callbacks.failure({
          requestedFile: filepath,
          error: error.message,
        });
      });
  };

  return { getLocalStaticFileAsText }
});
