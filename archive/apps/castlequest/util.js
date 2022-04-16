(function() {
  Object.prototype.merge = function(input) {
    var me = this;
    Object.keys(input).forEach(function(key){
      me[key] = input[key];
    });
  }

  Object.prototype.selectKeys = function(keys) {
    var me = this;
    var out = {};
    keys.forEach(function(key) {
      out[key] = me[key];
    });
    return out;
  }

  Object.prototype.copyData = function(input) {
    var me = this;
    Object.keys(input).forEach(function(key){
      me[key] = input[key];
    });
  }

  Object.prototype.copyFields = function(input) {
    var me = this;
    Object.keys(input).forEach(function(key){
      me[key] = me[input[key]];
    });
  }
})()
