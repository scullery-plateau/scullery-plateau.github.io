if (!JSON.toXML) {
  JSON.toXML = function(xmljson) {
    if ((typeof xmljson) == "string") {
      return xmljson;
    } else {
      xmljson.attrs = xmljson.attrs || {};
      xmljson.content = xmljson.content || [];
      var attrs = Object.entries(xmljson.attrs).map(function(attr){
        return " " + attr[0] + '="' + attr[1] + '"';
      }).join("");
      var out = "<" + xmljson.tag + attrs;
      if (xmljson.content.length > 0) {
        out += ">" + xmljson.content.map(JSON.toXML).join("") + "</" + xmljson.tag + ">";
      } else {
        out += "/>"
      }
      return out;
    }
  }
}