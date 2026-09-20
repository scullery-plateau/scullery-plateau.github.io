namespace('sp.svengali.buckshot.Demo', {
  'sp.svengali.Renderer': 'Renderer',
  'sp.svengali.buckshot.Context': 'Context',
  'sp.svengali.buckshot.Icons': 'Icons'
}, ({ Renderer, Context, Icons }) => {
  return {
    render: (containerId, contextKey, orientation) => {
      const container = document.getElementById(containerId);
      const context = Context[contextKey];
      const pkg = Renderer.getPrintPackage(context.Layout, context.Data, Icons, orientation);
      
      const pagesHtml = pkg.pages.map(svg => `
        <div class="page">
          <div class="canvas">${svg}</div>
        </div>
      `).join('\n');

      container.innerHTML = pkg.defs + pagesHtml;
    }
  };
});
