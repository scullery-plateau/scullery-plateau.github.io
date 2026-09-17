namespace('sp.svengali.buckshot.Demo', {
  'sp.svengali.buckshot.Renderer': 'Renderer'
}, ({ Renderer }) => {
  return {
    render: (containerId, contextKey, orientation) => {
      const container = document.getElementById(containerId);
      const pkg = Renderer.getPrintPackage(contextKey, orientation);
      
      const pagesHtml = pkg.pages.map(svg => `
        <div class="page">
          <div class="canvas">${svg}</div>
        </div>
      `).join('\n');

      container.innerHTML = pkg.defs + pagesHtml;
    }
  };
});
