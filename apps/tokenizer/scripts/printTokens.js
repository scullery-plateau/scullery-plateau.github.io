namespace("sp.tokenizer.PrintTokens",{
  "sp.common.PrintJS":"PrintJS",
  "sp.common.Utilities":"util"
},({PrintJS,util}) => {
  const pageWidth = 8;
  const pageHeight = 10;
  const layout = {
    1:{
      yPadding: 0.125,
      alternatingYOffset: 0.5625,
      columnLength: 9,
      columns: 8,
      partitionSize: 68
    },
    2: {
      yPadding: 0.25,
      alternatingYOffset: 1.125,
      columnLength: 4,
      columns: 4,
      partitionSize: 16
    },
    3: {
      yPadding: 0.5,
      xPadding: 1,
      columnLength: 3,
      columns: 2,
      partitionSize: 6
    },
    4: {
      yPadding: 2,
      alternatingYOffset: 3,
      columnLength: 2,
      columns: 2,
      partitionSize: 3
    }
  };
  const buildDefs = function (size, files) {
    const content = Object.entries(files).map(([filename, url]) => {
        return `<image id="${filename}.${size}" x="0" y="0" width="${size}" height="${size}" xlink:href="${url}"/>`;
      }).join('\n');
    return `<svg width="0" height="0"><defs>${content}</defs></svg>`;
  };
  const svgFrame = function (content) {
    return `<svg viewBox="0 0 8 10">${content}</svg>`;
  };
const buildPages = function (size, minis) {
  const { yPadding, xPadding, alternatingYOffset, partitionSize, columnLength, columns } = layout[size];
  const [ yPad, xPad, altYOffset ] = [ yPadding || 0, xPadding || 0, alternatingYOffset || 0];
  const isFullAltCol = (pageHeight >= (altYOffset + size + ((columnLength - 1) * (size + yPad))));
  const altColumnLength = columnLength - (isFullAltCol?0:1);
  const colPairs = columns / 2;
  const partitions = partition(minis, partitionSize);
  return partitions.map((p,n) => {
    let i = 0;
    const page = [];
    for (let col = 0; col < colPairs; col++) {
      for (let tile = 0; tile < columnLength; tile++) {
        page.push(`<use x="${2 * col * (size + xPad) }" y="${tile * (size + yPad)}" href="#${p[i++]}.${size}"/>`);
      }
      for (let tile = 0; tile < altColumnLength; tile++) {
        page.push(`<use x="${(2 * col + 1) * (size + xPad) }" y="${altYOffset + tile * (size + yPad)}" href="#${p[i++]}.${size}"/>`);
      }
    }
    return svgFrame(page.join('\n'));
  });
};
const printTokenPages = function(title,size,tokens) {
    const files = tokens.reduce((out, {token}) => {
      out[token.filename] = token.canvasURL;
      return out;
    }, {});
    const countedTokens = minisList.reduce((out, {token}) => {
      const step = Array(token.copyCount).fill(token.filename);
      return [].concat(out,step);
    }, []);
    const defs = buildDefs(size, files);
    const pages = buildPages(size, countedTokens);
    PrintJS.printSvgPages(title, 'portrait', defs, pages);
  }
  return { printTokenPages };
});