namespace('sp.svengali.buckshot.Renderer', {
  'sp.svengali.buckshot.Context': 'Context',
  'sp.svengali.buckshot.Classes': 'Classes'
}, ({ Context, Classes }) => {
  const GUTTER = 24; // 0.25in

  const renderPageSVG = (pageCards, layoutInstance) => {
    // Standard Landscape Canvas area: 10" x 8"
    // Width: 10" * 96 = 960
    // Height: 8" * 96 = 768
    const pageW = 960;
    const pageH = 768;
    
    // Svengali card grid dimensions: 8.0" x 7.25"
    const gridW = 8.0 * 96; // 768px
    const gridH = 7.25 * 96; // 696px

    // Center the 8x7.25 grid within the 10x8 canvas
    const offsetX = (pageW - gridW) / 2;
    const offsetY = (pageH - gridH) / 2;
    
    const cardW = 2.5 * 96; // 240px
    const cardH = 3.5 * 96; // 336px

    const placements = pageCards.map((cardData, i) => {
      const x = offsetX + (i % 3) * (cardW + GUTTER);
      const y = offsetY + Math.floor(i / 3) * (cardH + GUTTER);
      return `<use href="#${cardData.defId}" x="${x}" y="${y}" />`;
    }).join('\n');

    return `<svg viewBox="0 0 ${pageW} ${pageH}">${placements}</svg>`;
  };

  const getPrintPackage = (contextKey) => {
    const context = Context[contextKey];
    const rawCards = context.Data.CARDS;
    const layoutInstance = new Classes.SvengaliLayout(context.Layout);

    const symbols = rawCards.map((card, i) => {
      const id = `card-def-${i}`;
      return layoutInstance.renderCard(card, id);
    }).join('\n');

    const defs = `<svg width="0" height="0"><defs>${symbols}</defs></svg>`;
    
    const allCardInstances = rawCards.flatMap((card, i) => {
      const count = card.count || 1;
      return Array(count).fill({ ...card, defId: `card-def-${i}` });
    });

    const pages = [];
    for (let i = 0; i < allCardInstances.length; i += 6) {
      const pageCards = allCardInstances.slice(i, i + 6);
      pages.push(renderPageSVG(pageCards, layoutInstance));
    }

    return {
      title: `Svengali Prototype - ${contextKey}`,
      orientation: 'landscape',
      defs,
      pages
    };
  };

  return { getPrintPackage };
});

