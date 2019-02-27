(function(){
  if (!Object.prototype.keys) {
    Object.prototype.keys = function() {
      return Object.keys(this);
    }
  }
  if (!Object.prototype.entries) {
    Object.prototype.entries = function() {
      return Object.entries(this);
    }
  }
  if (!Object.prototype.values) {
    Object.prototype.values = function() {
      return Object.values(this);
    }
  }
  if (!Object.prototype.merge) {
    Object.prototype.merge = function(myMap) {
      var me = this;
      Object.entries(myMap).forEach(function(entry){
        me[entry[0]] = entry[1];
      });
      return me;
    }
  }
  if (!Object.prototype.assoc) {
    Object.prototype.assoc = function() {
      var me = this;
      var args = Array.from(arguments);
      while(args.length > 1) {
        var key = args.shift();
        var value = args.shift();
        me[key] = value;
      }
      return me;
    }
  }
  if (!Object.prototype.dissoc) {
    Object.prototype.dissoc = function() {
      var me = this;
      Array.from(arguments).forEach(function(arg) {
        delete me[arg];
      });
      return me;
    }
  }
  if (!Object.map) {
    Object.map = function() {
      var args = Array.from(arguments);
      var out = {};
      while (args.length > 0) {
        out[args.shift()] = args.shift();
      }
      return out;
    }
  }
})()