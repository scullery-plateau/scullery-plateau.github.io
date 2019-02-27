(function() {
  var baseParse = DOMParser.prototype.parseFromString;
  DOMParser.prototype.parseFromString = function(xml,type) {
    var me = this;
    var result = baseParse.call(me,xml,type);
    var errors = Array.from(result.getElementsByTagName("parsererror")).map(function(error) {
      return error.getElementsByTagName("div")[0].innerHTML;
    });
    if (errors.length > 0) {
      throw errors;
    }
    return result;
  }
})()