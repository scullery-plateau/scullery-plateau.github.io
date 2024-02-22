namespace("sp.spritelyHarvester.SpritelyHarvester",{
  'sp.common.Colors':'Colors',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities':'util',
  'sp.spritely.SpritelyUtil': 'SpritelyUtil'
},({ Colors, LoadFile, util, SpritelyUtil }) => {
  const spColors = util.range(6).reduce((out,red) => {
    return util.range(6).reduce((acc,green) => {
      return util.range(6).reduce((results,blue) => {
        const [r,g,b] = [red,green,blue].map((c) => (c*3).toString(16));
        const color = ['#',r,r,g,g,b,b].join('');
        results[color] = Colors.rgbFromHex(color);
        return results;
      }, acc);
    }, out);
  }, Colors.getAllNamedColors().reduce((out,color) => {
    out[color] = Colors.rgbFromHex(color);
    return out;
  }, {}));
  console.log({ spColors, count: Object.keys(spColors).length })
  const colors = ["red","green","blue"];
  const measurementSorter = (a,b) => {
    const compare = a.dist - b.dist;
    if (compare !== 0) {
      return compare;
    }
    return a.diff - b.diff;
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        spec:{
          rows:32,
          columns:32,
          imgTop:0,
          imgBottom:0,
          imgLeft:0,
          imgRight:0,
          pixTop:0,
          pixBottom:0,
          pixLeft:0,
          pixRight:0,
          maxDist:16,
          paletteMax:20
        }
      };
    }
    colorDist(a,b) {
      return Math.sqrt(colors.map(c => Math.pow((a[c] - b[c]),2)).reduce((sum,sqr) => sum + sqr, 0));
    }
    colorDiff(a,b) {
      return Math.abs(colors.map(c => (a[c] - b[c])).reduce((sum,sqr) => sum * sqr, 0));
    }
    gatherMeasurements(paletteA,paletteB) {
      return Object.entries(paletteA).reduce((out,[hexA,colorA]) => {
        return Object.entries(paletteB).reduce((acc,[hexB,colorB]) => {
          const dist = this.colorDist(colorA,colorB);
          const diff = this.colorDiff(colorA,colorB);
          acc.push({hexA,hexB,dist,diff});
          return acc;
        },out)
      },[]);
    }
    findShortestMappingFrom(palette,measurements,maxDistDiff) {
      const distMap = {};
      const paletteKeys = Object.keys(palette);
      const shortestDists = paletteKeys.reduce((out,hex) => {
        const myMeasurements = measurements.filter(m => m.hexB === hex);
        const ordered = myMeasurements.sort(measurementSorter);
        const shortestFrom = ordered[0];
        distMap[shortestFrom.dist] = true;
        return out.concat([shortestFrom]);
      }, []);
      console.log({ shortestDists });
      const dists = Object.keys(distMap).map((m) => {
        return parseFloat(m);
      }).sort((a,b) => {
        return a - b;
      });
      console.log({ dists });
      const distDiffs = util.range(dists.length - 1).map((i) => {
        const a = dists[i];
        const b = dists[i + 1];
        const diff = b - a;
        return { a, b, diff };
      }).sort((a,b) => {
        return b.diff - a.diff;
      });
      console.log({ distDiffs });
      if (distDiffs.length <= 0) {
        return {maxDistDiff,shortestMappings:{}};
      }
      if (distDiffs[0].diff < maxDistDiff && paletteKeys.length < this.state.spec.paletteMax) {
        return {maxDistDiff,shortestMappings:{}};
      }
      const maxDist = distDiffs[0].a;
      console.log({ maxDist, maxDistDiff, newMaxDistDiff: distDiffs[0].diff });
      return {
        maxDistDiff: distDiffs[0].diff,
        shortestMappings: shortestDists.reduce((out, sd) => {
          if (sd.dist <= maxDist) {
            out[sd.hexA] = sd.hexB;
          }
          return out;
        }, {})
      };
    }
    applyImageContext(data,width){
      const pixels = [];
      const palette = {};
      let rest = Array.from(data);
      while(rest.length > 0) {
        const [red, green, blue, alpha] = rest.slice(0,4);
        const hex = Colors.hexFromRGB(red, green, blue);
        const color = { red, green, blue };
        pixels.push(hex);
        palette[hex] = color;
        rest = rest.slice(4);
      }
      const rows = [];
      rest = Array.from(pixels);
      while(rest.length > 0) {
        rows.push(rest.slice(0,width));
        rest = rest.slice(width);
      }
      return { palette, data: rows };
    }
    downloadSpritelyFile(event, data) {
      event.preventDefault();
      util.triggerJSONDownload("harvested.json","harvested.json",data);
    }
    drawPixelsAsSVG(data,dim){
      console.log({ data, dim });
      const pixelSize = 5
      const height = data.length;
      const width = data.reduce((out,row) => Math.max(out,row.length),0);
      const spritelyData = {
        palette:[],
        pixels:{}
      };
      const svg = <svg width={dim} height={dim} viewBox={`0 0 ${width * pixelSize} ${height * pixelSize}`}>
        { data.map((row,y) => {
          return row.map((color,x) => {
            const pixelId = SpritelyUtil.getPixelId(x,y);
            let paletteIndex = spritelyData.palette.indexOf(color);
            if (paletteIndex < 0) {
              paletteIndex = spritelyData.palette.length;
              spritelyData.palette.push(color);
            }
            spritelyData.pixels[pixelId] = paletteIndex;
            return <rect x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill={color}/>
          })
        }) }
      </svg>;
      return <div className="d-flex flex-column">
        <a href="#" onClick={(e) => this.downloadSpritelyFile(e,spritelyData)}>{ svg }</a>
        <h5>Palette Size: { spritelyData.palette.length }</h5>
      </div>;
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
        const hex = Colors.hexFromRGB(p.red,p.green,p.blue);
        if (out[hex]) {
          out[hex]++;
        } else {
          out[hex] = 1;
        }
        return out;
      },{});
      const palette = Object.keys(colorCounts);
      const diffs = [];
      for(let j = 0; j < palette.length - 1; j++) {
        for(let k = j + 1; k < palette.length; k++) {
          const [jHex,kHex] = [j,k].map((i) => palette[i]);
          const [jColor,kColor]= [jHex, kHex].map((hex) => Colors.rgbFromHex(hex));
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
        return out;
      },{});
      const lowScore = Object.keys(scoreboard).sort()[0];
      const highCount = Object.keys(scoreboard[lowScore]).sort().reverse()[0];
      return this.pixelAverage(scoreboard[lowScore][highCount].map((hex) => Colors.rgbFromHex(hex)));
    }
    condensePixels() {
      const { data, palette, spec } = this.state;
      const { rows, columns, xRatio, yRatio } = spec;
      console.log({ xRatio, yRatio })
      const newPalette = {};
      const condensed = util.range(rows).map((rowNum) => {
        const yOff = rowNum * yRatio;
        return util.range(columns).map((colNum) => {
          const xOff = colNum * xRatio;
          const pixels = util.range(yRatio).reduce((out,y) => {
            return util.range(xRatio).reduce((acc,x) => {
              const color = data[yOff + y][xOff + x]
              acc[color] = palette[color];
              return acc;
            }, out);
          }, {});
          const rgb = this.bestPixel(Object.values(pixels))
          const hex = Colors.hexFromRGB(rgb.red,rgb.green,rgb.blue);
          if (newPalette[hex]) {
            newPalette[hex]++;
          } else {
            newPalette[hex] = 1;
          }
          return hex;
        });
      });
      console.log({ newPalette, count: Object.keys(newPalette).length})
      this.setState({ condensed, newPalette });
    }
    reducePalette(reduced, reducedPalette, distDiffMax) {
      console.log("reduce palette");
      const oldCount = Object.keys(reducedPalette).length;
      const usablePalette = Object.keys(reducedPalette).reduce((out,hex) => {
        out[hex] = Colors.rgbFromHex(hex);
        return out;
      }, {});
      const measurements = this.gatherMeasurements(usablePalette,usablePalette).filter((m) => m.hexA !== m.hexB).sort(measurementSorter);
      console.log({ measurements });
      const {shortestMappings, maxDistDiff} = this.findShortestMappingFrom(usablePalette,measurements,distDiffMax);
      distDiffMax = maxDistDiff;
      console.log({ shortestMappings });
      console.log({  count: (Object.keys(shortestMappings) || []).length });
      const flips = Object.entries(shortestMappings).reduce((out,[k,v]) => {
        if (!out[v] && !out[k] && shortestMappings[v] === k) {
          const kCount = Object.values(shortestMappings).filter((m) => m === k).length;
          const vCount = Object.values(shortestMappings).filter((m) => m === v).length;
          if ( kCount > vCount ) {
            out[k] = true;
          } else {
            out[v] = true;
          }
        }
        return out;
      }, {});
      Object.keys(flips).forEach((f) => {
        delete shortestMappings[f];
      });
      const roots = Object.values(shortestMappings).filter((hex) => !shortestMappings[hex]).sort();
      console.log({ flips, flipCount: Object.keys(flips).length, roots })
      reducedPalette = {};
      const traverse = function(c) {
        if (shortestMappings[c]) {
          return traverse(shortestMappings[c]);
        } else {
          return c;
        }
      }
      reduced = reduced.map((row) => row.map((c) => {
        const newHex = traverse(c);
        if (reducedPalette[newHex]) {
          reducedPalette[newHex]++;
        } else {
          reducedPalette[newHex] = 1;
        }
        return newHex;
      }));
      const count = Object.keys(reducedPalette).length;
      console.log({ reducedPalette, count })
      if (count < oldCount) {
        this.reducePalette(reduced, reducedPalette, distDiffMax);
      } else {
        this.setState({ reduced, reducedPalette });
      }
    }
    drawImageInCanvas(baseImg) {
      const dataShell = {};
      const url = util.drawCanvasURL('canvas',(canvas,ctx) => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.drawImage(baseImg,0,0,baseImg.width,baseImg.height);
        dataShell.data = ctx.getImageData(0,0,baseImg.width,baseImg.height);
      });
      const {data,palette} = this.applyImageContext(dataShell.data.data,baseImg.width);
      return {url,data,palette};
    }
    spritelyify() {

    }
    loadImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL, filename) => {
          util.initImageObj(dataURL,(baseImg) => {
            const {width,height} = baseImg;
            const {url,data,palette} = this.drawImageInCanvas(baseImg);
            console.log({ palette, count: Object.keys(palette).length });
            const spec = this.state.spec;
            spec.xRatio = width / spec.columns;
            spec.yRatio = height / spec.rows;
            this.setState({
              url, data, palette, width, height, spec,
              filename:filename.split(".")[0]
            });
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
      switch (fieldName) {
        case 'rows':
        case 'imgTop':
        case 'imgBottom':
          update.yRatio = (this.state.height - (update.imgTop + update.imgBottom)) / update.rows;
          break;
        case 'columns':
        case 'imgLeft':
        case 'imgRight':
          update.xRatio = (this.state.width - (update.imgLeft + update.imgRight)) / update.columns;
          break;
      }
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
        </>}
        { this.state.url && 
          <>
            <div className="rpg-box m-2 p-2 d-flex justify-content-center">
              <div className="d-flex flex-column justify-content-center">
                <h3 className="text-center">Image Size: {this.state.width} x {this.state.height}</h3>
                <hr/>
                <h3 className="text-center">Pixels:</h3>
                { this.buildSpecField("Rows","rows",{min:1}) }
                { this.buildSpecField("Columns","columns",{min:1}) }
                { this.buildSpecField("Max Dist","maxDist",{min:1}) }
                { this.buildSpecField("Palette Max","paletteMax",{min:1}) }
                <h3 className="text-center">Pixel Size: {this.state.spec.xRatio} x {this.state.spec.yRatio}</h3>
              </div>
              <div className="d-flex flex-column justify-content-center">
                <h3 className="text-center">Image Margin</h3>
                { this.buildSpecField("Top","imgTop",{}) }
                { this.buildSpecField("Bottom","imgBottom",{}) }
                { this.buildSpecField("Left","imgLeft",{}) }
                { this.buildSpecField("Right","imgRight",{}) }
              </div>
              <div className="d-flex flex-column justify-content-center">
                <h3 className="text-center">Pixel Margin</h3>
                { this.buildSpecField("Top","pixTop",{max:this.state.spec.yRatio - this.state.spec.pixBottom}) }
                { this.buildSpecField("Bottom","pixBottom",{max:this.state.spec.yRatio - this.state.spec.pixTop}) }
                { this.buildSpecField("Left","pixLeft",{max:this.state.spec.xRatio - this.state.spec.pixRight}) }
                { this.buildSpecField("Right","pixRight",{max:this.state.spec.xRatio - this.state.spec.pixLeft}) }
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
              <div className="rpg-box m-2 p-2 d-flex flex-column justify-content-center">
                <img src={this.state.url} style={{width:"15em",height:"15em"}}/>
              </div>
              <div className="rpg-box m-2 p-2 d-flex flex-column justify-content-center">
                { this.drawPixelsAsSVG(this.state.data,"15em") }
              </div>
              <button className="btn btn-success" onClick={() => {
                this.condensePixels();
              }}>&gt; Condense &gt;</button>
              { this.state.condensed &&
                <>
                  <div className="rpg-box m-2 p-2 d-flex flex-column justify-content-center">
                    { this.drawPixelsAsSVG(this.state.condensed,"15em") }
                  </div>
                  <button className="btn btn-success" onClick={() => {
                    let { condensed, newPalette } = this.state;
                    this.reducePalette(condensed, newPalette, 0);
                  }}>&gt; Reduce &gt;</button>
                  { this.state.reduced &&
                    <>
                      <div className="rpg-box m-2 p-2 d-flex flex-column justify-content-center">
                        { this.drawPixelsAsSVG(this.state.reduced,"15em") }
                      </div>
                      <button className="btn btn-success" onClick={() => {
                        this.spritelyify();
                      }}>&gt; Spritely-ify &gt;</button>
                    </>
                  }
                </>
              }
            </div>
          </> }
      </div>;
    }
  }
});