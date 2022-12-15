namespace("sp.tokenizer.Token",{"sp.common.Constants":"c"},({c}) => {
  const baseScale = 100;
  const r = (baseScale / 2) - 1;
  const cxy = baseScale / 2;
  const buildInitState = function(patternId,url,filename,count) {
    return {
      patternId,
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
      return <>
        { !isTransparent && <circle cx={cxy} cy={cxy} r={r} fill={backgroundColor}/>}
        <circle cx={cxy} cy={cxy} r={r} fill={`url(#${patternId})`} stroke={frameColor} strokeWidth={1}/>
      </>;
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
      return <>
        { !isTransparent && <polygon points={points} fill={backgroundColor}/>}
        <polygon points={points} fill={`url(#${patternId})`} stroke={frameColor} strokeWidth={1}/>
      </>;
    }
  }
  const Token = function(props) {
    const { token, frameSize } = props;
    const { patternId, url, xOffset, yOffset, scale, sideCount, frameColor, backgroundColor, isTransparent } = token;
    const [x, y] = [xOffset, yOffset].map((offset) => ((cxy * (1 - scale)) + offset));
    const dim = scale * baseScale;
    const shape = drawShape(sideCount,patternId,frameColor,backgroundColor, isTransparent);
    console.log({ token, dim, });
    if (url) {
      return <svg width={frameSize} height={frameSize} viewBox={`0 0 ${baseScale} ${baseScale}`}>
        <defs>
          <pattern id={ patternId } x="0" y="0" width="100%" height="100%">
            <image x="0" y="0" width={baseScale} height={baseScale} href={url} transform={`translate(${x}, ${y}) scale(${scale})`}/>
          </pattern>
        </defs>
        { shape }
      </svg>;
    }
  }
  Token.buildInitState = buildInitState;
  return Token;
});