(function(){
  var delay = function(cond,onComplete,interval) {
    if (cond()) {
      onComplete();
    } else {
      setTimeout(function() {
        delay(cond,onComplete,interval);
      }, interval);
    }
  }
  window.loadFile = function(input,onComplete) {
    var file = input.files[0];
    if (!file) {
      return;
    }
    var filedata = {};
    Array.from(input.files).forEach(function(file){
      var reader = new FileReader();
      reader.onload = function(e) {
        filedata[file.name] = e.target.result;
      };
      reader.readAsText(file);
    });
    delay(function() {
      return Object.keys(filedata).length == input.files.length;
    }, function() {
      onComplete(filedata);
    }, 500)
  }
  window.makeDownloadLink = function(label,filename,type,encoding,data) {
    var link = document.createElement("a");
    link.innerHTML = label;
    link.setAttribute("download",filename);
    link.setAttribute("href","data:"+type+";"+encoding+","+encodeURI(data));
    return link;
  }
})()
