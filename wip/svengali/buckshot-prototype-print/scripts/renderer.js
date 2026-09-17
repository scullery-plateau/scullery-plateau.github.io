namespace('sp.svengali.buckshot.Renderer', {
  'sp.svengali.buckshot.Context': 'Context',
  'sp.svengali.buckshot.Classes': 'Classes'
}, ({ Context, Classes }) => {
  const GUTTER = 24; // 0.25in

  const renderPageSVG = (pageCards, layoutInstance, orientation) => {
    const isPortrait = orientation === 'portrait';
    
    // Canvas dimensions at 96dpi
    const pageW = isPortrait ? 768 : 960; // 8in or 10in
    const pageH = isPortrait ? 960 : 768; // 10in or 8in
    
    // Base Svengali card grid (Landscape arrangement: 2 rows of 3)
    const gridW = 8.0 * 96;  // 768px
    const gridH = 7.25 * 96; // 696px
    const cardW = 2.5 * 96; 
    const cardH = 3.5 * 96;

    const placements = pageCards.map((cardData, i) => {
      const x = (i % 3) * (cardW + GUTTER);
      const y = Math.floor(i / 3) * (cardH + GUTTER);
      return `<use href="#${cardData.defId}" x="${x}" y="${y}" />`;
    }).join('\n');

    let content;
    if (isPortrait) {
      // Portrait Paper: 8.5"w x 11"h. Canvas: 8"w x 10"h.
      // Horizontally: 8" canvas is centered (0.25" margins). Grid (7.25"w) is centered in canvas.
      const rotatedW = gridH; // 696
      const rotatedH = gridW; // 768
      const offsetX = (pageW - rotatedW) / 2; // (768 - 696) / 2 = 36px
      
      // Vertically: To center 8" grid on 11" paper, need 1.5" top margin.
      // CSS provides 0.25". Required SVG offset: 1.25" (120px).
      const offsetY = 1.25 * 96; 
      
      content = `<g transform="translate(${gridH + offsetX}, ${offsetY}) rotate(90)">${placements}</g>`;
    } else {
      // Landscape Paper: 11"w x 8.5"h. Canvas: 10"w x 8"h.
      // Horizontally: To center 8" grid on 11" paper, need 1.5" left margin.
      // CSS provides 0.25". Required SVG offset: 1.25" (120px).
      const offsetX = 1.25 * 96; 
      
      // Vertically: 8" canvas is centered on 8.5" paper (0.25" margins). Grid (7.25"h) centered in canvas.
      const offsetY = (pageH - gridH) / 2; // (768 - 696) / 2 = 36px
      
      content = `<g transform="translate(${offsetX}, ${offsetY})">${placements}</g>`;
    }

    return `
      <svg viewBox="0 0 ${pageW} ${pageH}" style="display: block;">
        <rect width="${pageW}" height="${pageH}" fill="none" stroke="black" stroke-width="1"/>
        ${content}
      </svg>`;
  };

  const getPrintPackage = (contextKey, orientation) => {
    const context = Context[contextKey];
    const rawCards = context.Data.CARDS;
    const layoutInstance = new Classes.SvengaliLayout(context.Layout);

    const symbols = rawCards.map((card, i) => {
      const id = `card-def-${i}`;
      return layoutInstance.renderCard(card, id);
    }).join('\n');

    const defs = `<svg width="0" height="0" style="display: none;"><defs>${symbols}</defs></svg>`;
    
    const allCardInstances = rawCards.flatMap((card, i) => {
      const count = card.count || 1;
      return Array(count).fill({ ...card, defId: `card-def-${i}` });
    });

    const pages = [];
    for (let i = 0; i < allCardInstances.length; i += 6) {
      const pageCards = allCardInstances.slice(i, i + 6);
      pages.push(renderPageSVG(pageCards, layoutInstance, orientation));
    }

    return {
      title: `Svengali Prototype - ${contextKey}`,
      orientation: orientation || 'landscape',
      defs,
      pages
    };
  };

  return { getPrintPackage };
});

