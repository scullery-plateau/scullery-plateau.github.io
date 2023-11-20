namespace('sp.cobblestone.PrintPages',{
  'sp.common.PrintJS': 'PrintJS',
  'sp.common.Utilities': 'util',
  'sp.common.GridUtilities': 'gUtil',
  'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ PrintJS, util, gUtil, cUtil }) =>{
  const tileDim = cUtil.getTileDim();
  const pageSize = { max: 10, min: 8 };
  const buildDefs = function(images, tiles) {
    return `<svg width="0" height="0"><defs>${
      Object.entries(tiles).reduce((acc,[filename,tfs]) => {
        return Object.entries(tfs).reduce((out,[tf,isPresent]) => {
          if (isPresent) {
            console.log({ filename, tf });
            const id = cUtil.getTileId(filename, tf);
            const href = images[filename];
            const tfs = cUtil.buildImageTransform(tf);
            out.push(`<image id="${id}" href="${href}" width="${tileDim}" height="${tileDim}" transform="${tfs}"/>`);
          }
          return out;
        },acc);
      },[]).join('')
    }</defs></svg>`;
  }
  const wrapSVG = function(width, height, content) {
    return `<svg viewBox="0 0 ${width} ${height}">${content}</svg>`
  }
  const drawPlacements = function(placements, offX, offY) {
    return Object.entries(placements).map(([coordId,[filename,tf]]) => {
      const { x, y } = gUtil.parseCoordinateId(coordId);
      const id = cUtil.getTileId(filename, tf);
      return `<use x="${offX + (tileDim * x)}" y="${offY + (tileDim * y)}" href="#${id}"/>`;
    }).join('');
  }
  const getPagePlacements = function(page, placements) {
    return util.range(page.height).reduce((acc,y) => {
      return util.range(page.width).reduce((out,x) => {
        const placement = placements[gUtil.getCoordinateId(page.x + x, page.y + y)];
        if (placement) {
          out[gUtil.getCoordinateId(x, y)] = placement;
        }
        return out;
      },acc);
    },{});
  }
  const drawPageFrames = function(pageSelections, offX, offY) {
    return pageSelections.map((page) => {
      let { x, y, width, height } = page;
      [ x, y, width, height ] = [ x, y, width, height ].map(n => (n * tileDim));
      return `<rect x="${offX + x}" y="${offY + y}" width="${width}" height="${height}" fill="none" stroke="${page.pageOutlineColor}" stroke-width="6"/>`
    }).join('');
  }
  const buildPages = function(size, orientation, printOrientation, placements, pageSelections) {
    const pageRatioWidth = gUtil.getWidth(pageSize,printOrientation);
    const pageRatioHeight = gUtil.getHeight(pageSize,printOrientation);
    const imageWidth = gUtil.getWidth(size,orientation);
    const imageHeight = gUtil.getHeight(size,orientation);
    const ratioWidth = imageHeight * pageRatioWidth / pageRatioHeight;
    const ratioHeight = imageWidth * pageRatioHeight / pageRatioWidth;
    const width = Math.max(imageWidth, ratioWidth);
    const height = Math.max(imageHeight, ratioHeight);
    const offX = tileDim * (width - imageWidth) / 2;
    const offY = tileDim * (height - imageHeight) / 2;
    const firstPage = wrapSVG(width * tileDim, height * tileDim, drawPlacements(placements, offX, offY));
    const secondPage = wrapSVG(width * tileDim, height * tileDim, drawPlacements(placements, offX, offY) + drawPageFrames(pageSelections, offX, offY));
    return [firstPage, secondPage].concat(pageSelections.map((page) => {
      return wrapSVG(pageRatioWidth * tileDim, pageRatioHeight * tileDim, drawPlacements(getPagePlacements(page,placements), 0, 0));
    }));
  }
  const printPages = function (title, size, orientation, printOrientation, images, tiles, placements, pageSelections) {
    const defs = buildDefs(images, tiles);
    const pages = buildPages(size, orientation, printOrientation, placements, pageSelections);
    PrintJS.printSvgPages(title, printOrientation, defs, pages);
  }
  return { printPages };
});