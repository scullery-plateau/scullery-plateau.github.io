(function() {
  window.TabSet = function(tabMenuId, tabIds, initActive) {
    
    var tabContent = {};
    
    var tabMenu = [];
        
    this.select = function(id) {
      var content = tabContent[id];
      Object.entries(tabContent).forEach(function(entry) {
        if (id == entry[0]) {
          entry[1].content.style.display = "block";
          tabMenu[entry[1].index].classList.add("active");
        } else {
          entry[1].content.style.display = "none";
          tabMenu[entry[1].index].classList.remove("active");
        }
      });
    }
    
    this.init = function() {
      tabIds.forEach(function(tabId, index) {
        tabContent[tabId] = {
          content:document.getElementById(tabId),
          index:index
        };
      },{});
      tabMenu = Array.from(document.getElementById(tabMenuId).childNodes).filter((n) => (n.nodeName == "LI"));
      this.select(tabIds[initActive]);
    }
    
  }
})()