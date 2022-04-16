(function() {
  window.TI85 = function(drawId,portraitId,lcdId,menuId) {
    var print = function(message) {
      var output = document.getElementById(lcdId);
      output.innerHTML = output.innerHTML + "<span>" + message + "</span><br/>";
      output.scrollTop = output.scrollHeight;
    }
    var canvasDim = new Object();
    this.dimCanvas = function(xMin, xMax, yMin, yMax) {
      canvasDim.merge({
        xMin:xMin,
        xMax:xMax,
        yMin:yMin,
        yMax:yMax
      });
      document.getElementById(drawId).setAttribute("viewBox",[xMin, yMin, xMax - xMin, yMax - yMin].join(" "));
    };
    this.RcPic = function(picName) {
      document.getElementById(portraitId).innerHTML = "<img src=\"image/" + picName + ".png\"/>"
    };
    var wrapFn = function(fn) {
      return function() {
        delete window.menu;
        document.getElementById(menuId).innerHTML = "";
        fn();
      }
    };
    var menufy = function(dest, after) {
      if (after) {
        return function(index) {
          dest[index]();
          after();
        }
      } else {
        return function(index) {
          dest[index]();
        }
      }
    }
    this.Menu = function(opts, after) {
      var menu = "";
      var dest = {};
      Object.keys(opts).forEach(function(key) {
        if (key != " ") {
          dest[key] = wrapFn(opts[key]);
          menu += '<button onClick="menu(\'' + key + '\')">' + key + '</button>';
        }
      });
      window.menu = menufy(dest, after);
      document.getElementById(menuId).innerHTML = menu;
    };
    this.Disp = function(message) {
      print(message);
    };
    this.Line = function(x1, y1, x2, y2) {
      var output = document.getElementById(drawId);
      output.innerHTML = output.innerHTML + '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" fill="none" stroke="black" stroke-width="1"/>';
    };
    this.InpST = function(message, varname) {
      var out = {};
      out[varname] = prompt(message);
      return out;
    }
  };
})()
