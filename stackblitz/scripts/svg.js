(function () {
  let buildAttrs = function (attrs) {
    return Object.entries(attrs)
      .map(([k, v]) => {
        return k + '="' + v + '"';
      })
      .join(' ');
  };
  window.SVG = {
    svg: (width, height, args, content) =>
      `<svg ${buildAttrs({ width, height })} ${buildAttrs(args)}>${content.join(
        '\n'
      )}</svg>`,
    defs: (contents) => `<defs>${contents.join('\n')}</defs>`,
    group: (style, contents) =>
      `<g ${buildAttrs(style)}>${contents.join('\n')}</g>`,
    anchor: (href, style, contents) =>
      `<a ${buildAttrs({ href })} ${buildAttrs(style)}>${contents.join(
        '\n'
      )}</a>`,
    image: (href, width, height, style) =>
      `<image ${buildAttrs({ href, width, height })} ${buildAttrs(
        style
      )}></image>`,
    use: (href, style) =>
      `<use ${buildAttrs({ href })} ${buildAttrs(style)}></use>`,
    rect: (x, y, width, height, style) =>
      `<rect ${buildAttrs({ x, y, width, height })} ${buildAttrs(
        style
      )}></rect>`,
  };
})();
