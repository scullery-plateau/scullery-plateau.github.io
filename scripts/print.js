(function () {
  window.initTpl = function (iframe) {
    localStorage.setItem(
      'printTemplate',
      iframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML
    );
    iframe.parentNode.removeChild(iframe);
  };
  window.printImageUrlAsPage = function (orientation, dataURL) {
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
  window.printSvgPages = function (title, orientation, defs, pages) {
    let html = `<html>
      <head>
        <title>${title}</title>
        <link
          rel="stylesheet"
          href="https://voltron42.github.io/flair/print/${orientation}.css"
        />
      </head>
      <body>
        ${defs}
        ${pages
          .map((page) => {
            return `<div class="page">
          <div class="canvas">${page}</div>
        </div>`;
          })
          .join('\n')}
      </body>
    </html>`;
    var win = window.open('', '_blank');
    win.document.getElementsByTagName('html')[0].innerHTML = html;
  };
})();
