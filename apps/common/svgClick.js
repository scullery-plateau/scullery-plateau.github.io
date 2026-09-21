namespace("sp.common.SVGClick", {}, () => {
  const validSvgClickNameRegex = /^[a-zA-Z0-9_]+$/;
  const registry = {};
  return {
    setup: function(svgClickName, callback, clearOnSetup = false) {
      if (!validSvgClickNameRegex.test(svgClickName)) {
        throw new Error(`SVGClick: ${svgClickName} is not a valid SVG click name`);
      }
      if (registry[svgClickName]) {
        if (clearOnSetup) {
          document.removeEventListener(svgClickName, registry[svgClickName]);
        } else {
          throw new Error(`SVGClick: ${svgClickName} already registered`);
        }
      }
      registry[svgClickName] = function(e) {
        callback.apply(null, e.detail);
      };
      document.addEventListener(svgClickName, registry[svgClickName]);
      window[svgClickName] = function(){
        const args = Array.from(arguments);
        const e = args.shift();
        if (e.type !== 'click' && e.target.tagName.toLowerCase() !== 'a') {
          throw new Error(`SVGClick: ${svgClickName} only supports click events or <a> tags`);
        }
        e.preventDefault();
        document.dispatchEvent(new CustomEvent(svgClickName, { detail: args }));
      }
    }
  };
});