namespace('sp.cobblestone.PrintPages',{
  'sp.common.PrintJS': 'PrintJS',
  'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ PrintJS, cUtil }) =>{
  const tileDim = cUtil.getTileDim();
  const buildDefs = function(images) {
    return `<svg width="0" height="0"><defs>${
      Object.entries(images).map(([filename,href]) => {
        const id = cUtil.getTileId(filename, tf);
        const tfs = cUtil.buildImageTransform(tf);
        return `<image id="${id}" href="${href}" width="${tileDim}" height="${tileDim}" transform="${tfs}"/>`;
      }).join('')
    }</defs></svg>`;
  }
  const buildPages = function(size, orientation, placements, pageSelections) {
    return [];
  }
  const printPages = function (title, size, orientation, images, placements, pageSelections) {
    const defs = buildDefs(images);
    const pages = buildPages(size, orientation, placements, pageSelections);
    PrintJS.printSvgPages(title,orientation,defs,pages);
  }
  return { printPages };
});