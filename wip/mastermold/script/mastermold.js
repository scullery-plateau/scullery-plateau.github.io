(function(){
  var imageTag = function(src,alt) {
    return `<img src="${src}" alt="${alt}" title="${alt}"/>`;
  }
  var frameSVG = function(fileName,imgURL,x,y,r,color,size) {
    var img = document.createElement("img");
    img.src = imgURL;
    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;
    var d = r * 2;
    return `
<svg width="${size}in" height="${size}in" viewbox="0 0 ${d} ${d}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="${fileName}" x="${x-r}" y="${y-r}" width="${r}" height="${r}">
      <image xlink:href="${imgURL}" x="0" y="0" height="${imgHeight}" width="${imgHeight}">
    </pattern>
  </defs>
  <circle cx="${r}" cy="${r}" fill="url(#${fileName})" stroke="${color}" stroke-width="1"/>
</svg>
    `;
  }
  registry.apply("Mastermold",[
    "Selector"
  ],function(Selector) {
    return function(uiIds){
      var files = {};
      var ui = Object.entries(uiIds).reduce(function(out,entry) {
        out[entry[0]] = document.getElementById(entry[1]);
        return out;
      }, {});
      var drawSingle = function() {
        var fileName = Selector.selectedValue(ui.imageSelector);
        var file = files[fileName];
        if (file) {
          ui.selectedDisplay.innerHTML = imageTag(file.img,fileName);
          if (file.token) {
            // todo - draw framed
            frameSVG(fileName,file.img,file.token.x,file.token.y,file.token.r,file.token.color);
          }
        }
      }
      var redraw = function() {
        Selector.loadSelector(ui.imageSelector,Object.keys(files),"Select an image to edit.",function(option,fileName) {
          option.text = fileName;
          option.value = fileName;
        });
        ui.imageGallery.innerHTML = Object.entries(files).map(function(entry) {
          console.log(entry);
          return imageTag(entry[1].img,entry[0]);
        }).join("");
        // todo - draw standing pages
        // todo - draw circle pages
      }
      this.addFiles = function() {
        loadImages(ui.fileLoader,function(fileData) {
          Object.entries(fileData).forEach(function(entry) {
            if (!(files[entry[0]])) {
              files[entry[0]] = {img:entry[1]};
            }
          });
          console.log(fileData);
          redraw();
        })
      }
      this.selectImage = function() {
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
      this.update = function() {
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
