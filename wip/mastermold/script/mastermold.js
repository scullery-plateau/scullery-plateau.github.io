(function(){
  var imageTag = function(src,alt) {
    return `<img src="${src}" alt="${alt}" title="${alt}"/>`;
  }
  var imageLink = function(src,alt,instanceName) {
    return `<a href="#" onclick="${instanceName}.setSelectedImage('${alt}')"><img src="${src}" alt="${alt}" title="${alt}"/></a>`;
  }
  var frameSVG = function(fileName,img) {
    var d = img.token.r * 2;
    var svg = `
<svg width="${96 * img.token.size}" height="${96 * img.token.size}" viewbox="0 0 ${d} ${d}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="${fileName}pattern" patternUnits="userSpaceOnUse" x="${img.token.x - img.token.r}" y="${img.token.y - img.token.r}" width="${img.width}" height="${img.height}">
      <image id="${fileName}Img" xlink:href="${img.img}" x="0" y="0" height="${img.height}" width="${img.width}"/>
    </pattern>
  </defs>
  <circle cx="${img.token.r}" cy="${img.token.r}" r="${img.token.r - 3}" fill="url(#${fileName}pattern)" stroke="${img.token.frameColor}" stroke-width="5"/>
</svg>`;
    return svg;
  }
  registry.apply("Mastermold",[
    "Selector"
  ],function(Selector) {
    return function(uiIds,instanceName){
      var files = {};
      var ui = Object.entries(uiIds).reduce(function(out,entry) {
        out[entry[0]] = document.getElementById(entry[1]);
        return out;
      }, {});
      var drawSingle = function() {
        var fileName = Selector.selectedValue(ui.imageSelector);
        var file = files[fileName];
        if (file) {
          console.log(file);
          ui.selectedDisplay.innerHTML = imageTag(file.img,fileName);
          if (file.token) {
            ui.frameDisplay.innerHTML = frameSVG(fileName,file);
          }
        }
      }
      var redraw = function() {
        ui.imageGallery.innerHTML = Object.entries(files).map(function(entry) {
          return imageLink(entry[1].img,entry[0],instanceName);
        }).join("");
        // todo - draw standing pages
        // todo - draw circle pages
      }
      var buildImgData = function(files,fileName,imgData,img) {
        return function() {
          var imgWidth = img.naturalWidth;
          var imgHeight = img.naturalHeight;
          var d = Math.min(imgWidth,imgHeight);
          var r = Math.floor(d/2);
          var x = Math.floor(imgWidth/2);
          var y = r;
          var color = "#000000";
          var size = "1";
          files[fileName] = {
            img:imgData,
            width:imgWidth,
            height:imgHeight,
            token:{
              x:x,
              y:y,
              r:r,
              frameColor:color,
              size:size
            }
          };
          ui.imageGallery.innerHTML += imageLink(imgData,fileName,instanceName);
        }
      }
      this.addFiles = function() {
        loadImages(ui.fileLoader,function(fileData) {
          Selector.loadSelector(ui.imageSelector,Object.keys(fileData),"Select an image to edit.",function(option,fileName) {
            option.text = fileName;
            option.value = fileName;
          });
          Object.entries(fileData).forEach(function(entry) {
            if (!(files[entry[0]])) {
              var img = document.createElement("img");
              img.onload = buildImgData(files,entry[0],entry[1],img);
              img.src = entry[1];
            }
          });
        })
      }
      var selectImage = function() {
        var fileName = Selector.selectedValue(ui.imageSelector);
        var file = files[fileName];
        if (file) {
          if (file.isStanding) {
            ui.standingCheck.checked = true;
          }
          if (file.token) {
            ui.tokenCheck.checked = true;
            ui.centerX.value = file.token.x;
            ui.centerY.value = file.token.y;
            ui.radius.value = file.token.r;
            Selector.setSelectedValue(ui.sizeSelector,file.token.size);
            ui.frameColorPicker.value = file.token.frameColor;
          }
          drawSingle();
          redraw();
        }
      }
      this.setSelectedImage = function(key) {
        Selector.setSelectedValue(ui.imageSelector,key);
        selectImage();
      }
      this.selectImage = function() {
        selectImage();
      }
      this.update = function(input) {
        console.log(input);
        var fileName = Selector.selectedValue(ui.imageSelector);
        var file = files[fileName];
        if (file) {
          if (ui.standingCheck.checked) {
            file.isStanding = true;
          }
          if (ui.tokenCheck.checked) {
            file.token = Object.assign(file.token || {},{
              x:ui.centerX.value,
              y:ui.centerY.value,
              r:ui.radius.value,
              size:Selector.selectedValue(ui.sizeSelector),
              frameColor:ui.frameColorPicker.value
            });
          }
          drawSingle();
          redraw();
        }
      }
    };
  });
})();
