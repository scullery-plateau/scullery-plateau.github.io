namespace('sp.cobblestone.Publish',{
  "sp.common.ColorPicker":'ColorPicker',
  "sp.common.Colors":'colors',
  "sp.common.Dialog":'Dialog',
  "sp.common.Utilities":"util",
  "sp.cobblestone.CobblestoneUtil":'cUtil',
  "sp.cobblestone.TileDefs":"TileDefs"
},({ ColorPicker, Dialog, util, cUtil, TileDefs }) => {
  const emptyCellId = cUtil.getEmptyCellId();
  const oppositeOrientation = { portrait: 'landscape', landscape: 'portrait' };
  const defaultColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FF7700', '#FF0077',
    '#77FF00', '#00FF77', '#7700FF', '#0077FF',
    '#FF7777', '#77FF77', '#7777FF', '#FFFF77',
    '#FF77FF', '#77FFFF' ];
  const pageSize = { min: 8, max: 10 };
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pages:[],
        placements:{},
        printOrientation:'portrait',
        selectedIndex:-1
      };
      this.onClose = props.onClose();
      props.setOnOpen(({images,tiles,placements,size,orientation,pages}) => {
        pages = pages || [];
        const printOrientation = orientation;
        const selectedIndex = ((pages.length > 0) ? 0 : -1);
        const fullWidth = util.getWidth(size, orientation);
        const fullHeight = util.getHeight(size, orientation);
        this.setState({images,tiles,placements,size,orientation,pages,fullWidth,fullHeight,printOrientation,selectedIndex});
      });
      this.modals = Dialog.factory({
        pageOutlinePicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            const pages = this.state.pages.map((p) => util.merge(p));
            pages[index].pageOutlineColor = color;
            this.setState({ pages });
          }
        },
      });
    }
    togglePrintOrientation() {
      this.setState({ printOrientation: oppositeOrientation[this.state.printOrientation] })
    }
    displayPrintOrientation() {
      const p = this.state.printOrientation;
      return p.charAt(0).toUpperCase() + p.slice(1);
    }
    pageDisplay(page) {
      return [page.pageOutlineColor, page.x, page.y, page.width, page.height].join(", ");
    }
    addPage() {
      const pages = Array.from(this.state.pages);
      pages.push({ pageOutlineColor: defaultColors[pages.length % defaultColors.length], x:0, y:0, width:0, height:0 });
      this.setState({ pages });
    }
    removePage() {
      if (this.state.selectedIndex >= 0) {
        const pages = Array.from(this.state.pages).splice(this.state.selectedIndex,1);
        const selectedIndex = this.state.selectedIndex - (this.state.selectedIndex >= pages.length ? 1 : 0);
        this.setState({ pages, selectedIndex });
      }
    }
    updateCurrentPage(updates) {
      const pages = Array.from(this.state.pages);
      pages[this.state.selectedIndex] = util.merge(pages[this.state.selectedIndex],updates);
      this.setState({ pages });
    }
    publish() {
      /* todo */
    }
    getTileImage(x,y,coordId,tileDim) {
      const tile = this.state.placements[coordId];
      const tileId = tile ? this.getTileID(tile[0], tile[1]) : emptyCellId;
      return <use x={tileDim * x} y={tileDim * y} href={`#${tileId}`} stroke="black" strokeWidth="2"/>;
    }
    render() {
      const tileDim = cUtil.getTileDim();
      const current = ((this.state.selectedIndex >= 0)?this.state.pages[this.state.selectedIndex]:undefined);
      const [pageWidth, pageHeight] = [cUtil.getWidth, cUtil.getHeight].map((f) => f(pageSize,this.state.printOrientation));
      const pageDim = {
        x: -tileDim/2,
        y: -tileDim/2,
        w: tileDim * (pageWidth + 0.5),
        h: tileDim * (pageHeight + 0.5)
      };
      return <div className="d-flex flex-columns">
        <div className="d-flex justify-content-center">
          <button className="btn btn-success" onClick={ () => this.addPage() }>Add</button>
          <div className="form-inline m-1">
            <label htmlFor="page-select" className="m-1">Page:</label>
            <select id="page-select" className="form-control" onChange={(e) => {
              this.setState({ selectedIndex: e.target.value });
            }}>
              { this.state.pages.map((p,i) => <option key={`page-option-${i}`} value={i}>{i}: { this.pageDisplay(p) }</option>) }
            </select>
          </div>
          <button className="btn btn-danger" onClick={ () => this.removePage() }>Remove</button>
        </div>
        { this.state.selectedIndex >= 0 &&
          <div className="d-flex justify-content-center">
            <button
              className="rounded w-25"
              style={{
                backgroundColor: current.pageOutlineColor,
                color: util.getForegroundColor(current.pageOutlineColor),
              }}
              onClick={() => {
                this.modals.bgColorPicker.open({
                  color: current.pageOutlineColor,
                  index: this.state.selectedIndex
                });
              }}>Page Outline Color</button>
            <div className="form-inline">
              <label htmlFor="current-x">X:</label>
              <input
                type="number"
                min="0"
                max={ this.state.fullWidth - 1 }
                className="form-control"
                id="current-x"
                value={ current.x }
                onChange={(e) => {
                  this.updateCurrentPage({ x: e.target.value });
                }}/>
            </div>
            <div className="form-inline">
              <label htmlFor="current-y">Y:</label>
              <input
                type="number"
                min="0"
                max={ this.state.fullHeight - 1 }
                className="form-control"
                id="current-y"
                value={ current.y }
                onChange={(e) => {
                  this.updateCurrentPage({ y: e.target.value });
                }}/>
            </div>
            <div className="form-inline">
              <label htmlFor="current-width">Width:</label>
              <input
                type="number"
                min="0"
                max={ Math.min(util.getWidth( pageSize, this.state.printOrientation ), this.state.fullWidth - current.x) }
                className="form-control"
                id="current-width"
                value={ current.width }
                onChange={(e) => {
                  this.updateCurrentPage({ width: e.target.value });
                }}/>
            </div>
            <div className="form-inline">
              <label htmlFor="current-height">Height:</label>
              <input
                type="number"
                min="0"
                max={ Math.min(util.getHeight( pageSize, this.state.printOrientation ), this.state.fullHeight - current.y) }
                className="form-control"
                id="current-height"
                value={ current.height }
                onChange={(e) => {
                  this.updateCurrentPage({ height: e.target.value });
                }}/>
            </div>
          </div>
        }
          <TileDefs tiles={this.state.tiles} tileDim={tileDim}/>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-columns">
            <button className="btn btn-secondary" onClick={() => this.togglePrintOrientation() }>{ this.displayPrintOrientation() }</button>
            <div className="">
              <svg width="40%" height="40%" viewBox={`${pageDim.x} ${pageDim.y} ${pageDim.w} ${pageDim.h}`}>
                <rect x={pageDim.x} y={pageDim.y} width={pageDim.w} height={pageDim.h} fill="white" stroke="none"/>
                { this.state.selectedIndex >= 0 && 
                  <>
                    {
                      util.range(current.width).map((x) => util.range(current.height).map((y) => {
                        return this.getTileImage(x,y,cUtil.getCoordinateId(current.x + x, current.y + y),tileDim);
                      }))
                    }
                  </>
                }
              </svg>
            </div>
          </div>
          <div className="">
            <svg width="40%" height="40%" viewBox={`0 0 ${this.state.fullWidth * tileDim} ${this.state.fullHeight * tileDim}`}>
              { 
                util.range(this.state.fullWidth).map((x) => util.range(this.state.fullHeight).map((y) => {
                  return this.getTileImage(x,y,cUtil.getCoordinateId(x, y),tileDim);
                }))
              }
              {
                this.state.pages.map((p) => {
                  return <rect x={current.x * tileDim} y={current.y * tileDim} width={current.width * tileDim} height={current.height * tileDim} fill="none" stroke={current.pageOutlineColor} stroke-width={tileDim/10}/>
                })
              }
            </svg>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-info" onClick={() => this.publish() }>Publish</button>
          <button className="btn btn-success" onClick={() => this.onClose({ pages: this.state.pages }) }>Apply Pages</button>
          <button className="btn btn-danger" onClick={() => this.onClose() }>Cancel</button>
        </div>
      </div>;
    }
  }
});