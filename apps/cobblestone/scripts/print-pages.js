namespace('sp.cobblestone.PrintPages',{
  'sp.common.PrintJS': 'PrintJS',
  'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ PrintJS, cUtil }) =>{
  const buildDefs = function(images) {
    return `<svg width="0" height="0"><defs></defs></svg>`;
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