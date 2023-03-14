namespace('sp.common.QueryParams',{},() => {
  const read = function(str) {
    str = str || location.search;
    return str.slice(1).split("&").filter(s => s.length > 0).reduce((out,pairStr) => {
      const [ k, v ] = pairStr.split("=");
      if (k in out) {
        if (Array.isArray(out[k])) {
          out[k].push(decodeURIComponent(v));
        } else {
          out[k] = [out[k],decodeURIComponent(v)];
        }
      } else {
        out[k] = decodeURIComponent(v);
      }
      return out;
    },{});
  }
  const write = function(obj) {
    return "?" + Object.entries(obj).reduce((out,[k,v]) => {
      if (Array.isArray(v)) {
        return out + "&" + v.map((i) => k + "=" + encodeURIComponent(i)).join("&");
      } else {
        return out + "&" + k + "=" + encodeURIComponent(v);
      }
    },"");
  }
  return { read, write };
});