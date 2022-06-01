(function () {
  window.setUpOneTimeEvent = function (event, handler) {
    let oneTimeHandler = function () {
      try {
        handler();
      } finally {
        document.removeEventListener(event, oneTimeHandler);
      }
    };
    document.addEventListener(event, oneTimeHandler);
  };
})();
