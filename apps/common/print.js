namespace('sp.common.PrintJS', () => {
  const printImageUrlAsPage = function (orientation, dataURL) {
    const obj = {
      printTitle: 'Print ' + orientation.toUpperCase(),
      orientation,
      dataURL,
    };
    const html = Object.entries(obj).reduce((out, [key, value]) => {
      return out.replace(key, value);
    }, localStorage.getItem('printTemplate'));
    const win = window.open('', '_blank');
    win.document.getElementsByTagName('html')[0].innerHTML = html;
  };
  window.printSvgPages = function (title, orientation, defs, pages) {
    const html = `<html>
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
    const win = window.open('', '_blank');
    win.document.getElementsByTagName('html')[0].innerHTML = html;
  };
  return { printSvgPages, printImageUrlAsPage };
});
