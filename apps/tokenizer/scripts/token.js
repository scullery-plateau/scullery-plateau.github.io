namespace("sp.tokenizer.Token",{"sp.common.Constants":"c"},({c}) => {
  const baseScale = 100;
  const r = (baseScale / 2) - 1;
  const cxy = baseScale / 2;
  const buildInitState = function(url,filename,count) {
    return {
      url,
      filename,
      count,
      xOffset: 0,
      yOffset: 0,
      scale: 1.0,
      sideCount: 2,
      frameColor: c.defaultColor(),
      backgroundColor: c.defaultColor(),
      isTransparent: true,
    }
  }
  const drawShape = function(n, patternId, frameColor, backgroundColor, isTransparent ) {
    if (n <= 2 || n>= 50) {
      return [<>
        { !isTransparent && <circle cx={cxy} cy={cxy} r={r} fill={backgroundColor}/>}
        <circle cx={cxy} cy={cxy} r={r} fill={`url(#${patternId})`} stroke={frameColor} strokeWidth={1}/>
      </>];
    } else {
      const a = (Math.PI * 2) / n;
      const first = a / 2;
      const points = Array(n).fill(0).map((e, i) => {
        let ai = first + a * i;
        return [
          cxy + r * Math.sin(ai),
          cxy + r * Math.cos(ai),
        ].join(',');
      }).join(' ');
      return [<>
        { !isTransparent && <polygon points={points} fill={backgroundColor}/>}
        <polygon points={points} fill={`url(#${patternId})`} stroke={frameColor} strokeWidth={1}/>
      </>, points];
    }
  }
  const drawCanvas = function(url,point,setter) {

  }
  const Token = class extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.state = {canvasURL:""};
    }
    render() {
      const { index, token, frameSize } = this.props;
      const { url, xOffset, yOffset, scale, sideCount, frameColor, backgroundColor, isTransparent, filename } = token;
      const [x, y] = [xOffset, yOffset].map((offset) => ((cxy * (1 - scale)) + offset));
      const dim = scale * baseScale;
      const patternId = `pattern-${index}`;
      const [shape, points] = drawShape(sideCount,patternId,frameColor,backgroundColor, isTransparent);
      drawCanvas(url,points,((canvasUrl) => { this.setState({ canvasURL }); }));
      console.log({ index, token, dim, });
      if (url) {
        return <a href={this.state.canvasURL.length>0?this.state.canvasURL:"#"} download={this.state.canvasURL.length>0?`token-${filename}`:''} onClick={ (e) => {
          if (this.state.canvasURL.length > 0) {
            e.preventDefault();
          }
        }}>
          <svg width={frameSize} height={frameSize} viewBox={`0 0 ${baseScale} ${baseScale}`}>
            <defs>
              <pattern id={ patternId } x="0" y="0" width="100%" height="100%">
                <image x="0" y="0" width={baseScale} height={baseScale} href={url} transform={`translate(${x}, ${y}) scale(${scale})`}/>
              </pattern>
            </defs>
            { shape }
          </svg>
        </a>;
      }
    }
  }
  Token.buildInitState = buildInitState;
  return Token;
});