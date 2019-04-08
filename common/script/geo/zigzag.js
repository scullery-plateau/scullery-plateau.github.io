(function(){
  var template = function(width,height,fill,points) {
    return `
<svg width="${width}" height="${height}">
  <polygon points="${points.join(' ')}" fill="${fill}" stroke="black" stroke-width="1"/>
</svg>
    `;
  }
  var makePoints = function(width,height,count) {
    var points = [];
    points.push([Math.floor(Math.random() * width),
      Math.floor(Math.random() * height)]);
    var toggle = false;
    while (points.length < (count - 1)) {
      var lastY = points[points.length-1][1];
      var nextX = Math.floor(Math.random() * width);
      var nextY = Math.floor(Math.random() * height);
      points.push([nextX,lastY]);
      points.push([nextX,nextY]);
    }
    points.pop();
    points.push([points[points.length-1][0],points[0][1]]);
    return points;
  }
  registry.apply("ZigZag",[
  ],function(){
    return function(width,height,count,fill) {
      var points = makePoints(width,height,count);
      this.draw = function(canvasId) {
        document.getElementById(canvasId).innerHTML = template(width,height,fill,points);
      }
    }
  })
})()
