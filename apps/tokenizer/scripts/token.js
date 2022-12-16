namespace("sp.tokenizer.Token",{},() => {
  const initTokenState = function(url) {
    return {
      url,
      baseScale: 100,
      frameColor: 'red',
      id: "bergrum.png",
      scale: 1,
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
    return i - 1;
  };
  const drawShape = function (s) {
    const n = s.numberOfSides;
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
        <polygon points={points} fill={s.bgColor}/>
        <polygon points={points} fill={`url(#${s.patternId})`} stroke={s.frameColor} strokeWidth="1"/>
      </>;
    } else {
      return <>
        <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.bgColor}/>
        <circle cx={s.cx} cy={s.cy} r={s.r} fill={`url(#${s.patternId})`} stroke={s.frameColor} strokeWidth="1"/>
      </>;
    }
  };
  const Token = function(props) {
    const patternId = "myImage";
    const shape = drawShape({
      patternId,
      numberOfSides: props.token.sideCount,
      cx: props.token.baseScale / 2,
      cy: props.token.baseScale / 2,
      r: getFrameRadius(props.token),
      bgColor: props.token.backgroundColor,
      frameColor: props.token.frameColor,
    });
    return <svg width={props.frameSize} height={props.frameSize} viewBox={`0 0 ${ props.token.baseScale } ${ props.token.baseScale }`}>
      <defs>
        <pattern id={ patternId } x="0" y="0" width="100%" height="100%">
          <image
            x="0"
            y="0"
            width={props.token.baseScale}
            height={props.token.baseScale}
            href={props.token.url}
            transform={`translate(${getImageOrigin(props.token,props.token.xOffset)},${getImageOrigin(props.token,props.token.yOffset)}) scale(${props.token.scale})`}/>
        </pattern>
      </defs>
      { shape }
    </svg>;
  }
  Token.initTokenState = initTokenState;
  return Token;
});
