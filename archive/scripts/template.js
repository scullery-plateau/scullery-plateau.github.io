(function () {
  window.initTemplate = function (name, domId) {
    localStorage.setItem(name, document.getElementById(domId).innerHTML);
    document.getElementById(domId).innerHTML = '';
  };
})();
