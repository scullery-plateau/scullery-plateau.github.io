(function(){
  var codes = {"9":"\t","10":"\n","32":" "};
  var keys = {"0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"!":true,"\"":true,"#":true,"$":true,"%":true,"&":true,"'":true,"(":true,")":true,"*":true,"+":true,",":true,"-":true,".":true,"/":true,":":true,";":true,"<":true,"=":true,">":true,"?":true,"@":true,"A":true,"B":true,"C":true,"D":true,"E":true,"F":true,"G":true,"H":true,"I":true,"J":true,"K":true,"L":true,"M":true,"N":true,"O":true,"P":true,"Q":true,"R":true,"S":true,"T":true,"U":true,"V":true,"W":true,"X":true,"Y":true,"Z":true,"[":true,"\\":true,"]":true,"^":true,"_":true,"`":true,"a":true,"b":true,"c":true,"d":true,"e":true,"f":true,"g":true,"h":true,"i":true,"j":true,"k":true,"l":true,"m":true,"n":true,"o":true,"p":true,"q":true,"r":true,"s":true,"t":true,"u":true,"v":true,"w":true,"x":true,"y":true,"z":true,"{":true,"|":true,"}":true,"~":true};
  var charByChar = function(dom,trigger,chars,delay) {
    return function() {
      if (chars.length > 0) {
        var c = chars.shift();
        dom.innerHTML += c;
        dom.scrollTop = dom.scrollHeight;
        if (chars.length == 0) {
          trigger.fire();
        }
      }
      setTimeout(charByChar(dom,trigger,chars,delay),delay);
    }
  }
  var buildPrinter = function(dom,delay) {
    var chars = [];
    var trigger = new Trigger("bufferClear");
    setTimeout(charByChar(dom,trigger,chars,delay),delay);
    return {
      println:function(str) {
        if (str == undefined) {str = "";}
        if (typeof str == "string") {
          str = str.split("");
        }
        if (!Array.isArray(str)) {
          throw str;
        }
        chars.push("");
        str.forEach(function(c){chars.push(c);});
        chars.push("\n");
      },
      isBufferClear:function() {
        return chars.length == 0;
      },
      clearOutput:function() {
        dom.innerHTML = "";
      },
      after:function(fn) {
        trigger.onNextFire(fn);
      },
      flush:function() {
        dom.innerHTML += chars.splice(0,chars.length).join("");
        dom.scrollTop = dom.scrollHeight;
        trigger.fire();
      },
      dom:dom
    };
  }
  var consoleInputAction = function(ui,actionHandler,allowKeyEntryFn) {
    var action = "";
    return function(e) {
      if (ui.console.isBufferClear() && ui.output.isBufferClear() && allowKeyEntryFn()) {
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
          ui.console.dom.innerHTML = ui.console.dom.innerHTML.slice(0,-1);
          action = action.slice(0,-1);
        }
        ui.console.dom.scrollTop = ui.console.dom.scrollHeight;
      } else if (!ui.console.isBufferClear()) {
        ui.console.flush();
      } else if (!ui.output.isBufferClear()) {
        ui.output.flush();
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
      var values = {allowKeyEntry:true}
      ui.toggleEntry = function() {
        values.allowKeyEntry = !values.allowKeyEntry;
      }
      ui.allowEntry = function() {
        values.allowKeyEntry = true;
      }
      ui.disallowEntry = function() {
        values.allowKeyEntry = false;
      }
      var keyPressListener = consoleInputAction(ui,actionHandler.handle,function() {return values.allowKeyEntry;});
      actionHandler.init();
      document.getElementsByTagName("body")[0].onkeydown =keyPressListener;
      output.onkeydown = keyPressListener;
      console.onkeydown = keyPressListener;
    }
  }
})();
