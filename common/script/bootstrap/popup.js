(function(){
  window.PopupHandler = function(modalIds) {
    
    var body;
    var modals = {};
    
    this.init = function() {
      body = document.getElementsByTagName("body")[0];
      modalIds.forEach(function(id){
        modals[id] = document.getElementById(id);
      })
    }
    
    this.open = function(id) {
      modals[id].style.display = "block";
    }
    
    this.close = function(id) {
      modals[id].style.display = "none";
    }
  }
})()