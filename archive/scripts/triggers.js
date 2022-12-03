(function () {
  window.setUpOneTimeEvent = function (element, event, handler) {
    let oneTimeHandler = function () {
      try {
        handler();
      } finally {
        element.removeEventListener(event, oneTimeHandler);
      }
    };
    element.addEventListener(event, oneTimeHandler);
  };
})();
