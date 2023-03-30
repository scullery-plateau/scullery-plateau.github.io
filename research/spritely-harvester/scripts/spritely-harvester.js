namespace("sp.spritelyHarvester.SpritelyHarvester",{
  'sp.common.Utilities':'util',
  'sp.common.LoadFile':'LoadFile'
},({ util, LoadFile }) => {
  const colors = ["red","green","blue"]
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    applyImageContext(data,width){
      const pixels = [];
      let rest = Array.from(data);
      while(rest.length > 0) {
        const [red, green, blue, alpha] = rest.slice(0,4);
        pixels.push({ red, green, blue, alpha });
        rest = rest.slice(4);
      }
      const rows = [];
      rest = Array.from(pixels);
      while(rest.length > 0) {
        rows.push(rest.slice(0,width));
        rest = rest.slice(width);
      }
      return rows;
    }
    drawPixelsAsSVG(data,dim){
      console.log({rows:data});
      const pixelSize = 5
      const height = data.length;
      const width = data.reduce((out,row) => Math.max(out,row.length),0);
      return <svg width={dim} height={dim} viewBox={`0 0 ${width * pixelSize} ${height * pixelSize}`}>
        { data.map((row,y) => {
          return row.map((color,x) => {
            return <rect x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill={util.hexFromRGB(color.red,color.green,color.blue)}/>
          })
        }) }
      </svg>;
    }
    pixelAverage(pixels) {
      const totals = pixels.reduce((sums,pix) => {
        colors.forEach((color) => {
          sums[color] += pix[color];
        });
        return sums;
      },{red:0,green:0,blue:0});
      colors.forEach((color) => {
        totals[color] = Math.floor(totals[color] / pixels.length);
      });
      return totals;
    }
    bestPixel(pixels) {
      const colorCounts = pixels.reduce((out,p) => {
        const hex = util.hexFromRGB(p.red,p.green,p.blue);
        if (out[hex]) {
          out[hex]++;
        } else {
          out[hex] = 1;
        }
      },{});
      const palette = Object.keys(colorCounts);
      const diffs = [];
      for(let j = 0; j < palette.length - 1; j++) {
        for(let k = j + 1; k < palette.length; k++) {
          const [jHex,kHex] = [j,k].map((i) => palette[i]);
          const [jColor,kColor]= [jHex, kHex].map((hex) => util.rgbFromHex(hex));
          const diff = colors.reduce((prod,color) => {
            return prod * Math.abs(jColor[color] - kColor[color])
          },1);
          diffs.push({jHex,kHex,diff})
        }
      }
      const scoreboard = Object.entries(colorCounts).reduce((out,[hex,count]) => {
        const score = diffs.filter(({jHex,kHex}) => (hex === jHex || hex === kHex)).reduce((out,{diff}) => out * diff,1);
        if (out[score]) {
          if (out[score][count]) {
            out[score][count].push(hex);
          } else {
            out[score][count] = [hex];
          }
        } else {
          out[score] = {}
          out[score][count] = [hex];
        }
      },{});
      const lowScore = Object.keys(scoreboard).sort()[0];
      const highCount = Object.keys(scoreboard[lowScore]).sort().reverse()[0];
      return this.pixelAverage(scoreboard[lowScore][highCount].map((hex) => util.rgbFromHex(hex)));
    }
    averagePixels(data,pixelCount){
      const height = data.length;
      const width = data.reduce((out,row) => Math.max(out,row.length),0);
      const xRatio = width / pixelCount;
      const yRatio = height / pixelCount;
      return util.range(pixelCount).map((y) => {
        const y1 = Math.ceil(y * yRatio);
        const y2 = Math.min(Math.floor((y + 1) * yRatio), height);
        return util.range(pixelCount).map((x) => {
          const x1 = Math.ceil(x * xRatio);
          const x2 = Math.min(Math.floor((x + 1) * xRatio), width);
          const pixels = [];
          for (let _y = y1; _y < y2; _y++) {
            for (let _x = x1; _x < x2; _x++) {
              pixels.push(data[_y][_x]);
            }
          }
          return this.pixelAverage(pixels);
        });
      });
    }
    condensePalette(data){
      const palette = data.reduce((out,row) => {
        return row.reduce((acc,color) => {
          const hex = util.hexFromRGB(color.red,color.green,color.blue);
          if (acc[hex]) {
            acc[hex]++;
          } else {
            acc[hex] = 1;
          }
          return acc;
        },out)
      },{});
      console.log({ palette })
      return data;
    }
    drawImageInCanvas(baseImg) {
      const dataShell = {};
      const url = util.drawCanvasURL('canvas',(canvas,ctx) => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.drawImage(baseImg,0,0,baseImg.width,baseImg.height);
        dataShell.data = ctx.getImageData(0,0,baseImg.width,baseImg.height);
      });
      const data = this.applyImageContext(dataShell.data.data,baseImg.width);
      return {url,data}
    }
    loadImage() {
      LoadFile(
        true,
        'dataURL',
        (dataURL, filename) => {
          util.initImageObj(dataURL,(baseImg) => {
            const spec = util.merge(this.state.spec);
            spec.tileWidth = baseImg.width;
            spec.tileHeight = baseImg.height;
            this.setState({ baseImg, spec, filename:filename.split(".")[0] });
          });
        },
        (filename, error) => {
          console.log({filename, error});
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    render() {
      return <div className="d-flex flex-column justify-content-center">
        { !this.state.baseImg && <button className="btn btn-success" onClick={() => this.loadImage()}>Load Image To Harvest</button>}
        { this.state.baseImg && <></> }
      </div>;
    }
  }
});