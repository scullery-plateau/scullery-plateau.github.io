namespace("sp.tokenizer.Token",{
  'sp.common.Colors':'colors'
},({colors}) => {
  const initTokenState = function(patternId,url,filename,copyCount) {
    return {
      patternId,
      url,
      filename,
      copyCount,
      baseScale: 100,
      frameColor: colors['red'],
      backgroundColor: colors['black'],
      isTransparent: true,
      scale: 1.5,
      frameWidth: 1,
      sideCount: 2,
      xOffset: 0,
      yOffset: 0
    }
  }
  const getImageOrigin = function (data, offset) {
    let i = 1 - data.scale;
    i = i / 2;
    i = i * data.baseScale;
    return i + offset;
  };
  const getFrameRadius = function(data) {
    const i = data.baseScale / 2;
    return i - (data.frameWidth / 2);
  };
  const drawShape = function (s) {
    const n = s.sideCount;
    if (n > 2 && n < 50) {
      const a = (Math.PI * 2) / n;
      const first = a / 2;
      const points = Array(n)
        .fill(0)
        .map((e, i) => {
          let ai = first + a * i;
          return [
            s.cx + s.r * Math.sin(ai),
            s.cy + s.r * Math.cos(ai),
          ].join(',');
        })
        .join(' ');
      return <>
        { !s.isTransparent && <polygon points={points} fill={s.backgroundColor}/> }
        <polygon points={points} fill={`url(#${s.patternId})`} stroke={s.frameColor} strokeWidth={s.frameWidth}/>
      </>;
    } else {
      return <>
        { !s.isTransparent && <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.backgroundColor}/> }
        <circle cx={s.cx} cy={s.cy} r={s.r} fill={`url(#${s.patternId})`} stroke={s.frameColor} strokeWidth={s.frameWidth}/>
      </>;
    }
  };
  const Token = function(props) {
    const obj = Object.entries(props.token).reduce((out,[k,v]) => {
      out[k] = v;
      return out;
    }, {
      cx: props.token.baseScale / 2,
      cy: props.token.baseScale / 2,
      r: getFrameRadius(props.token)
    });
    const shape = drawShape(obj);
    return <svg width={ props.frameSize } height={ props.frameSize } viewBox={`0 0 ${ props.token.baseScale } ${ props.token.baseScale }`}>
      <defs>
        <pattern id={ props.token.patternId } x="0" y="0" width="100%" height="100%">
          <g transform={`translate(${getImageOrigin(props.token,props.token.xOffset)},${getImageOrigin(props.token,props.token.yOffset)}) scale(${props.token.scale})`}>
            <image
              x="0"
              y="0"
              width={props.token.baseScale}
              height={props.token.baseScale}
              href={props.token.url}/>
          </g>
        </pattern>
      </defs>
      { shape }
    </svg>;
  }
  Token.initTokenState = initTokenState;
  return Token;
});
