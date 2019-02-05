(function(){
  var codes = {"9":"\t","10":"\n","32":" "};
  var keys = {"0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"!":true,"\"":true,"#":true,"$":true,"%":true,"&":true,"'":true,"(":true,")":true,"*":true,"+":true,",":true,"-":true,".":true,"/":true,":":true,";":true,"<":true,"=":true,">":true,"?":true,"@":true,"A":true,"B":true,"C":true,"D":true,"E":true,"F":true,"G":true,"H":true,"I":true,"J":true,"K":true,"L":true,"M":true,"N":true,"O":true,"P":true,"Q":true,"R":true,"S":true,"T":true,"U":true,"V":true,"W":true,"X":true,"Y":true,"Z":true,"[":true,"\\":true,"]":true,"^":true,"_":true,"`":true,"a":true,"b":true,"c":true,"d":true,"e":true,"f":true,"g":true,"h":true,"i":true,"j":true,"k":true,"l":true,"m":true,"n":true,"o":true,"p":true,"q":true,"r":true,"s":true,"t":true,"u":true,"v":true,"w":true,"x":true,"y":true,"z":true,"{":true,"|":true,"}":true,"~":true};
  var charByChar = function(dom,chars,delay) {
    return function() {
      if (chars.length > 0) {
        var c = chars.shift();
        dom.innerHTML += c;
        dom.scrollTop = dom.scrollHeight;
        if (chars.length == 0) {
          dom.dispatchEvent(new Event("bufferClear"));
        }
      }
      setTimeout(charByChar(dom,chars,delay),delay);
    }
  }
  var buildPrinter = function(dom,delay) {
    var chars = [];
    setTimeout(charByChar(dom,chars,delay),delay);
    return {
      println:function(str) {
        if (!str) {str = "";}
        chars.push("");
        str.split("").forEach(function(c){chars.push(c);});
        chars.push("\n");
      },
      isBufferClear:function() {
        return chars.length == 0;
      },
      clearOutput:function() {
        dom.innerHTML = "";
      },
      after:function(fn) {
        var wrapped = function() {
          fn();
          dom.removeEventListener("bufferClear",wrapped);
        }
        dom.addEventListener("bufferClear",wrapped);
      },
      dom:dom
    };
  }
  var consoleInputAction = function(ui,actionHandler) {
    var action = "";
    return function(e) {
      if (ui.console.isBufferClear() && ui.output.isBufferClear()) {
        var code = e.keyCode;
        var key = e.key;
        if (code == 13 && e.shiftKey) {
          code = 10;
        }
        if (codes[code]) {
          ui.console.dom.innerHTML += String.fromCharCode(code);
          action += String.fromCharCode(code);
        } else if (keys[key]) {
          ui.console.dom.innerHTML += key;
          action += key;
        } else if (code == 13) {
          ui.console.dom.innerHTML += String.fromCharCode(10);
          actionHandler(action);
          action = "";
        } else if (code == 8 && action.length > 0) {
          ui.console.dom.innerHTML = ui.console.innerHTML.slice(0,-1);
          action = action.slice(0,-1);
        }
        ui.console.dom.scrollTop = ui.console.dom.scrollHeight;
      }
    }
  }
  window.Interface = function(outputDelay,consoleDelay,outputId,consoleId,ActionHandler) {
    var ui = {};
    var actionHandler = new ActionHandler(ui);
    this.init = function() {
      var output = document.getElementById(outputId);
      var console = document.getElementById(consoleId);
      ui.output = buildPrinter(output,outputDelay);
      ui.console = buildPrinter(console,consoleDelay);
      var keyPressListener = consoleInputAction(ui,actionHandler.handle);
      actionHandler.init();
      document.getElementsByTagName("body")[0].onkeydown =keyPressListener;
      output.onkeydown = keyPressListener;
      console.onkeydown = keyPressListener;
    }
  }
})();
