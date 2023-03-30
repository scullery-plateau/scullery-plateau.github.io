namespace('sp.texturePackHarvester.TexturePackHarvester',{
  'sp.common.Utilities':'util',
  'sp.common.LoadFile':'LoadFile'
},({ util, LoadFile }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        spec:{
          rows:1,
          columns:1,
          mTop:0,
          mLeft:0,
          mRight:0,
          mBottom:0,
          mFrame:0,
          sampleRow:0,
          sampleCol:0,
          pixelCount:1
        }
      };
    }
    loadTexturePackImage() {
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
    calcX(update, fieldName){
      const span = (this.state.baseImg.width - (update.mLeft + update.mRight))
      update.tileWidth = span/update.columns;
    }
    calcY(update, fieldName){
      const span = (this.state.baseImg.height - (update.mTop + update.mBottom))
      update.tileHeight = span/update.rows;
    }
    updateSpec(fieldName,value) {
      const update = util.merge(this.state.spec);
      update[fieldName] = value;
      switch (fieldName) {
        case "rows":
        case "mTop":
        case "mBottom":
          this.calcY(update, fieldName);
          break;
        case "columns":
        case "mLeft":
        case "mRight":
          this.calcX(update, fieldName);
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
    getImageFrame(row,col) {
      return {
        baseImg: this.state.baseImg,
        xOffset: Math.ceil(this.state.spec.mLeft + (col * this.state.spec.tileWidth) + this.state.spec.mFrame),
        yOffset: Math.ceil(this.state.spec.mTop + (row * this.state.spec.tileHeight) + this.state.spec.mFrame),
        frameWidth: Math.floor(this.state.spec.tileWidth - (2 * this.state.spec.mFrame)),
        frameHeight: Math.floor(this.state.spec.tileHeight - (2 * this.state.spec.mFrame))
      }
    }
    drawSampleImage() {
      const { baseImg, xOffset, yOffset, frameWidth, frameHeight } = this.getImageFrame(this.state.spec.sampleRow, this.state.spec.sampleCol);
      return <div style={{width:"20em"}}>
        <svg width="100%" height="100%" viewBox={`0 0 ${frameWidth} ${frameHeight}`}>
          <image x={-xOffset} y={-yOffset} width={baseImg.width} height={baseImg.height} href={baseImg.src}/>
        </svg>
      </div>
    }
    generateTileImages() {
      this.setState({ gallery: util.range(this.state.spec.rows).reduce((out,rowIndex) => {
          return util.range(this.state.spec.columns).reduce((acc,colIndex) => {
            const { baseImg, xOffset, yOffset, frameWidth, frameHeight } = this.getImageFrame(rowIndex, colIndex);
            const url = util.drawCanvasURL('canvas',(canvas,ctx) => {
              canvas.width = frameWidth;
              canvas.height = frameHeight;
              ctx.drawImage(baseImg,-xOffset,-yOffset,baseImg.width,baseImg.height);
            });
            return acc.concat([{
              url,
              index: `${colIndex}x${rowIndex}`
            }])
          },out);
        },[]) });
    }
    downloadImage({url,index}){
      const filename = this.state.filename + "_" + index;
      util.triggerPNGDownload(filename,filename,url);
    }
    render() {
      return <div className="d-flex flex-column justify-content-center">
        { !this.state.baseImg && <button className="btn btn-success text-center" onClick={() => this.loadTexturePackImage()}>Load Texture Pack Image</button> }
        { this.state.baseImg &&
          <>
            <h2 className="text-center">{this.state.baseImg.width} x {this.state.baseImg.height}</h2>
            <div className="d-flex justify-content-center">
              <div className="rpg-box m-2 p-2 w-50 d-flex flex-column justify-content-center">
                <h3 className="text-center">Tile size: {this.state.spec.tileWidth} x {this.state.spec.tileHeight}</h3>
                <div className="d-flex justify-content-center">
                  { this.buildSpecField("Rows","rows",{min:1,style:{width:"3em"}}) }
                  { this.buildSpecField("Columns","columns",{min:1,style:{width:"3em"}}) }
                </div>
                <div className="d-flex justify-content-center">
                  { this.buildSpecField("Top", "mTop",{min:0,style:{width:"3em"}}) }
                  { this.buildSpecField("Bottom", "mBottom",{min:0,style:{width:"3em"}}) }
                </div>
                <div className="d-flex justify-content-center">
                  { this.buildSpecField("Left", "mLeft",{min:0,style:{width:"3em"}}) }
                  { this.buildSpecField("Right", "mRight",{min:0,style:{width:"3em"}}) }
                </div>
                { this.buildSpecField("Frame Margin", "mFrame",{min:0,style:{width:"3em"}}) }
                { this.buildSpecField("Pixel Count", "pixelCount",{min:1,style:{width:"3em"}}) }
                <h3 className="text-center">Pseudopixel size: { (() => {
                  const { frameWidth, frameHeight } = this.getImageFrame(this.state.spec.sampleRow,this.state.spec.sampleCol);
                  const dim = Math.min(frameWidth, frameHeight);
                  return dim / this.state.spec.pixelCount;
                })() }</h3>
              </div>
              <div className="rpg-box m-2 p-2 w-50 d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-center">
                  { this.buildSpecField("Sample Row","sampleRow",{min:0,max:(this.state.spec.rows - 1),style:{width:"3em"}}) }
                  { this.buildSpecField("Sample Column","sampleCol",{min:0, max:(this.state.spec.columns - 1),style:{width:"3em"}}) }
                </div>
                { this.drawSampleImage() }
              </div>
            </div>
            <button className="btn btn-success" onClick={() => this.generateTileImages()}>Generate Tiles For Download</button>
            { this.state.gallery && this.state.gallery.length > 0 &&
              <div className="d-flex flex-wrap justify-content-center">
                { this.state.gallery.map((img) => {
                  return <div className="rpg-box m-2 p-2">
                    <a href="#"
                       onClick={(e) => {
                         e.preventDefault();
                         this.downloadImage(img);
                       }}>
                      <img className="p-2" style={{width:"7em",height:"7em"}} alt={img.index} src={img.url}/>
                    </a>
                  </div>;
                })}
              </div> }
          </>
        }
      </div>;
    }
  }
});