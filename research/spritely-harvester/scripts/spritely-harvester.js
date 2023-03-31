namespace("sp.spritelyHarvester.SpritelyHarvester",{
  'sp.common.Colors':'Colors',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.RollingProgressBar':'RollingProgressBar',
  'sp.common.Trigger':'Trigger',
  'sp.common.Utilities':'util',
},({ Colors, LoadFile, RollingProgressBar, Trigger, util }) => {
  const trigger = new Trigger("SpritelyHarvesterProgressTrigger" + Date.now());
  const spColors = util.range(6).reduce((out,red) => {
    return util.range(6).reduce((acc,green) => {
      return util.range(6).reduce((results,blue) => {
        const [r,g,b] = [red,green,blue].map((c) => (c*3).toString(16));
        const color = ['#',r,r,g,g,b,b].join('');
        results[color] = util.rgbFromHex(color);
        return results;
      }, acc);
    }, out);
  }, Colors.getAllNamedColors().reduce((out,color) => {
    out[color] = util.rgbFromHex(color);
    return out;
  }, {}));
  console.log({ spColors });
  const colors = ["red","green","blue"];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {spec:{}};
    }
    colorDist(a,b) {
      return Math.sqrt(colors.map(c => Math.pow((a[c] - b[c]),2)).reduce((sum,sqr) => sum + sqr, 0));
    }
    colorDiff(a,b) {
      return colors.map(c => (a[c] - b[c])).reduce((sum,sqr) => sum + sqr, 0);
    }
    applyImageContext(data,width){
      const pixels = [];
      const palette = {};
      let rest = Array.from(data);
      trigger.publish({
        subject: "bytes to colors",
        outOf: data.length / 4,
        count: 0
      });
      let count = 0;
      while(rest.length > 0) {
        const [red, green, blue, alpha] = rest.slice(0,4);
        const hex = util.hexFromRGB(red, green, blue);
        const color = { red, green, blue };
        pixels.push(hex);
        palette[hex] = color;
        rest = rest.slice(4);
        trigger.publish({
          subject: "bytes to colors",
          outOf: data.length / 4,
          count: ++count
        });
        }
      trigger.publish({
        subject: "measuring distances between sp colors and image colors",
        outOf:  Object.keys(spColors).length * Object.keys(palette).length,
        count: 0
      });
      count = 0
      const measurements = Object.entries(spColors).reduce((out,[spHex,spc]) => {
        return Object.entries(palette).reduce((acc,[imgHex,imgC]) => {
          const dist = this.colorDist(spc,imgC);
          const diff = this.colorDiff(spc,imgC);
          acc.push({spHex,imgHex,dist,diff});
          trigger.publish({
            subject: "measuring distances between sp colors and image colors",
            outOf:  Object.keys(spColors).length * Object.keys(palette).length,
            count: ++count
          });
              return acc;
        },out)
      },[]);
      trigger.publish({
        subject: "finding nearest sp colors",
        outOf: Object.keys(palette).length,
        count: 0
      });
      count = 0;
      const imgToSP = Object.keys(palette).reduce((out,hex) => {
        const myMeasurements = measurements.filter(m => m.imgHex === hex);
        const spHex = myMeasurements.sort((a,b) => {
          const compare = b.dist - a.dist;
          if (compare != 0) {
            return compare;
          }
          return a.diff - b.diff;
        })[0].spHex;
        out[hex] = spHex;
        trigger.publish({
          subject: "finding nearest sp colors",
          outOf: Object.keys(palette).length,
          count: ++count
        });
        return out;
      }, {});
      const rows = [];
      rest = Array.from(pixels);
      trigger.publish({
        subject: "mapping pixel colors to new color",
        outOf: Math.ceil(rest.length / width),
        count: 0
      });
      count = 0;
      while(rest.length > 0) {
        rows.push(rest.slice(0,width).map(h => imgToSP[h]));
        rest = rest.slice(width);
        trigger.publish({
          subject: "mapping pixel colors to new color",
          outOf: Math.ceil(rest.length / width),
          count: ++count
        });
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
        console.log("drawing image");
        dataShell.data = ctx.getImageData(0,0,baseImg.width,baseImg.height);
        console.log("image data received");
      });
      console.log("applying image context");
      const data = this.applyImageContext(dataShell.data.data,baseImg.width);
      console.log("image context applyed");
      return {url,data};
    }
    loadImage() {
      LoadFile(
        true,
        'dataURL',
        (dataURL, filename) => {
          console.log("loading image")
          util.initImageObj(dataURL,(baseImg) => {
            console.log("initializing image")
            const {width,height} = baseImg;
            const {url,data} = this.drawImageInCanvas(baseImg);
            this.setState({ url, data, width, height, filename:filename.split(".")[0] });
          });
        },
        (filename, error) => {
          console.log({filename, error});
          alert(filename + ' failed to load. See console for error.');
        });
    }
    updateSpec(fieldName,value) {
      const update = util.merge(this.state.spec);
      update[fieldName] = value;
      this.setState({ spec: update });
    }
    buildSpecField(label,fieldName,opts){
      return util.buildNumberInputGroup(fieldName,label,opts,() => {
        return this.state.spec[fieldName];
      },(value) => {
        this.updateSpec(fieldName,parseFloat(value));
      })
    }
    render() {
      return <div className="d-flex flex-column justify-content-center">
        { !this.state.url && <>
        <button className="btn btn-success" onClick={() => this.loadImage()}>Load Image To Harvest</button>
        <RollingProgressBar trigger={trigger}/>
        </>}
        { this.state.url && 
          <div className="rpg-box m-2 p-2 w-50 d-flex justify-content-center">
            <div className="d-flex flex-column justify-content-center">
              <h3 className="text-center">Image Size: {this.state.width} x {this.state.height}</h3>
              <h3 className="text-center"></h3>
              <div className="d-flex justify-content-center">
                { this.buildSpecField("Rows","rows",{min:1,style:{width:"3em"}}) }
                { this.buildSpecField("Columns","columns",{min:1,style:{width:"3em"}}) }
              </div>
            </div>
          </div> }
      </div>;
    }
  }
});