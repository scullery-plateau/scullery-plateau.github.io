(function(){
  registry.apply("Interface",["Trigger"],function(Trigger){
    var codes = {"9":"\t","10":"\n","32":" "};
    var keys = {
      "0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,
      "8":true,"9":true,"!":true,"\"":true,"#":true,"$":true,"%":true,"&":true,
      "'":true,"(":true,")":true,"*":true,"+":true,",":true,"-":true,".":true,
      "/":true,":":true,";":true,"<":true,"=":true,">":true,"?":true,"@":true,
      "A":true,"B":true,"C":true,"D":true,"E":true,"F":true,"G":true,"H":true,
      "I":true,"J":true,"K":true,"L":true,"M":true,"N":true,"O":true,"P":true,
      "Q":true,"R":true,"S":true,"T":true,"U":true,"V":true,"W":true,"X":true,
      "Y":true,"Z":true,"[":true,"\\":true,"]":true,"^":true,"_":true,"`":true,
      "a":true,"b":true,"c":true,"d":true,"e":true,"f":true,"g":true,"h":true,
      "i":true,"j":true,"k":true,"l":true,"m":true,"n":true,"o":true,"p":true,
      "q":true,"r":true,"s":true,"t":true,"u":true,"v":true,"w":true,"x":true,
      "y":true,"z":true,"{":true,"|":true,"}":true,"~":true};
    var charByChar = function(dom,trigger,chars,delay) {
      return function() {
        var c = chars.shift();
        if (c) {
          dom.append(c);
          if (chars.length == 0) {
            trigger.fire();
          }
          dom.scrollTop = dom.scrollHeight;
        }
        setTimeout(charByChar(dom,trigger,chars,delay),delay);
      }
    }
    var flush = function(chars,trigger,dom) {
      return function(){
        if (chars.length > 2) {
          var buffer = chars.splice(0,chars.length);
          buffer.forEach(function(c){
            dom.append(c);
          });
          if (buffer.length > 0) {
            trigger.fire();
            dom.scrollTop = dom.scrollHeight;
          }
        }
      }
    }
    var after = function(chars,trigger,dom) {
      return function(fn) {
        var size = chars.length;
        trigger.onNextFire(fn);
        if (size <= 0) {
          trigger.fire();
        }
      }
    }
    var buildPrinter = function(dom,delay) {
      var chars = [];
      var trigger = new Trigger("bufferClear");
      setTimeout(charByChar(dom,trigger,chars,delay),delay);
      return {
        logPeek:function() {
          console.log(chars);
        },
        println:function(str) {
          if (str == undefined) {str = "";}
          if (typeof str == "string") {
            str = str.split("");
          }
          if (!Array.isArray(str)) {
            throw str;
          }
          chars.push("");
          str.forEach(function(c){
            chars.push(c);
          });
          chars.push("\n");
        },
        isBufferClear:function() {
          return chars.length == 0;
        },
        clearOutput:function() {
          dom.innerHTML = "";
        },
        after:after(chars,trigger,dom),
        flush:flush(chars,trigger,dom),
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
            ui.console.dom.append(String.fromCharCode(code));
            action += String.fromCharCode(code);
          } else if (keys[key]) {
            ui.console.dom.append(key);
            action += key;
          } else if (code == 13) {
            ui.console.dom.append(String.fromCharCode(10));
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
    return function(outputDelay,consoleDelay,outputId,consoleId,ActionHandler) {
      var ui = {};
      var actionHandler = new ActionHandler(ui);
      this.init = function() {
        var output = document.getElementById(outputId);
        var consoleObj = document.getElementById(consoleId);
        ui.output = buildPrinter(output,outputDelay);
        ui.console = buildPrinter(consoleObj,consoleDelay);
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
        ui.buildOptionsList = function(options) {
          if (options) {
            var menu = document.createElement("span");
            var domOpts = options.reduce(function(out,entry){
              var option = document.createElement("a");
              option.innerHTML = entry;
              out[entry] = {dom:option};
              return out;
            },{})
            Object.keys(domOpts).forEach(function(key){
              var eventAction = function() {
                Object.values(domOpts).forEach(function(value){
                  value.dom.removeEventListener("click",value.event);
                });
                ui.console.println(key);
                ui.console.after(function(){
                  actionHandler.handle(key);
                });
              }
              domOpts[key].event = eventAction;
              domOpts[key].dom.addEventListener("click",eventAction);
            });
            var items = Object.values(domOpts).map(function(v){return v.dom;});
            menu.append(items.shift());
            items.forEach(function(item) {
              menu.append(",");
              menu.append(item);
            })
            ui.console.println([menu]);
          }
        }
        ui.buildActiveSprite =  function(label,action) {
          var sprite = document.createElement("a");
          sprite.innerHTML = label;
          var eventAction = function(){
            sprite.removeEventListener("click",eventAction);
            actionHandler.handle(action);
          }
          sprite.addEventListener("click",eventAction);
          return sprite;
        }
        var keyPressListener = consoleInputAction(ui,actionHandler.handle,function() {return values.allowKeyEntry;});
        actionHandler.init();
        document.getElementsByTagName("body")[0].addEventListener("keydown",keyPressListener);
        ui.output.dom.addEventListener("keydown",keyPressListener);
        ui.console.dom.addEventListener("keydown",keyPressListener);
        var clickListener = function(e) {
          if (e.target.tagName.toLowerCase() != "a") {
            if (!ui.console.isBufferClear()) {
              ui.console.flush();
            } else if (!ui.output.isBufferClear()) {
              ui.output.flush();
            }
          }
        }
        document.getElementsByTagName("body")[0].addEventListener("mouseup",clickListener);
        ui.output.dom.addEventListener("mouseup",clickListener);
        ui.console.dom.addEventListener("mouseup",clickListener);
      }
    }
  });
})();
