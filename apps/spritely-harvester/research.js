(function() {
  const extractPixelsFromCanvas = function() {
    const image = new Image();
    image.src = 'image.jpg'; // TODO
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const alpha = pixels[i + 3];

        // Process the pixel color data (e.g., log it, modify it, etc.)
        console.log(`Pixel ${i / 4}: RGBA(${red}, ${green}, ${blue}, ${alpha})`);
      }
    };
  };
  const resize = function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();

    img.onload = function () {

    // set size proportional to image
      canvas.height = canvas.width * (img.height / img.width);

      // step 1 - resize to 50%
      var oc = document.createElement('canvas'), octx = oc.getContext('2d');

        oc.width = img.width * 0.5;
        oc.height = img.height * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        // step 2
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        // step 3, resize to final size
        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);
    }
    img.src = "//i.imgur.com/SHo6Fub.jpg";// todo
  }
  const colorDist = function(c1, c2) {
    return "rgb".split("").reduce((sum, c) => sum + Math.pow((c1[c] - c2[c]), 2), 0);
  }
  const findNearestColor = function(rgb, newPalette) {
    return newPalette.reduce((out, c) => {
      out[c] = colorDist(c, rgb);
      return out;
    }, {}).toSorted((a,b) => a[1] - b[1])[0][0];
  }
})