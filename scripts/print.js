(function () {
  window.initTpl = function (iframe) {
    localStorage.setItem(
      'printTemplate',
      iframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML
    );
    iframe.parentNode.removeChild(iframe);
  };
  window.printTemplate = function (orientation, dataURL) {
    let obj = {
      printTitle: 'Print ' + orientation.toUpperCase(),
      orientation,
      dataURL,
    };
    let html = Object.entries(obj).reduce((out, [key, value]) => {
      return out.replace(key, value);
    }, localStorage.getItem('printTemplate'));
    var win = window.open('', '_blank');
    win.document.getElementsByTagName('html')[0].innerHTML = html;
  };
})();
