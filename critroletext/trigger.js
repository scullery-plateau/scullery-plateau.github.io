(function(){
  window.Trigger = function(dom,label) {
    var subscribers = [];
    this.fire = function(dataMap) {
      dom.dispatchEvent(new CustomEvent(label,{detail:dataMap}));
    }
    this.subscribe = function(fn) {
      var wrapped = function(e) {
        fn(e.detail)
      }
      subscribers.push(wrapped);
      dom.addEventListener(label,wrapped);
    }
    this.clear = function() {
      subscribers.forEach(function(fn) {
        dom.removeEventListener(label,fn);
      })
    }
    this.onNextFire = function(fn) {
      var wrapped = function(e) {
        fn(e.detail);
        dom.removeEventListener(label,wrapped);
      }
      dom.addEventListener(label,wrapped);
    }
  }
})()
