(function(){
  var getAttrs = function(element) {
    return element.getAttributeNames().reduce(function(out,name){
      out[name] = element.getAttribute(name);
      return out;
    },{});
  }
  var mapChildren = function(element,func) {
    return Array.from(element.childNodes).map(func)
  }
  if (!XMLDocument.prototype.toSimpleJSON) {
    var toSimple = function(element) {
      if ((typeof element) == "string") {
        return element;
      }
      return {
        tag:element.tagName,
        attrs:getAttrs(element),
        content:mapChildren(element,toSimple)
      };
    }
    XMLDocument.prototype.toSimpleJSON = function() {
      return toSimple(this.documentElement);
    }
  }
  if (!XMLDocument.prototype.toObjectJSON) {
    var makeMap = function(key,val) {
      var out = {};
      out[key] = val;
      return out;
    }
    var toObject = function(element) {
      if ((typeof node) == "string") {
        return {"_text":element};
      }
      var out = mapChildren(element,toObject).reduce(function(out,child) {
        return Object.entries(child).reduce(function(out,entry) {
          var key = entry[0];
          var val = entry[1];
          if (!out[key]) {
            out[key] = val;
          } else {
            out[key] = [].concat(out[key],val);
          }
          return out;
        }, out);
      }, getAttrs(element));
      var keys = Object.keys(out);
      if (keys.length == 1 && keys[0] == "_text" && (typeof out._text) == "string") {
        out = out._text;
      } else if (keys.length == 1 && keys[0] == "_text" && out._text.every(function(value) {
          return (typeof value) == "string";
        })) {
        out = out._text.join("");
      }
      return makeMap(element.tagName, out);
    }
    XMLDocument.prototype.toObjectJSON = function() {
      var retval = toObject(this.documentElement);
      return retval[this.documentElement.tagName];
    }
  }
})()
