(function () {
  let keyEventFields = [
    'altKey',
    'code',
    'ctrlKey',
    'shiftKey',
    'key',
    'keyCode',
    'target',
    'type',
  ];

  let keyHolds = {};

  let eventMap = {
    keyup: {
      hold: false,
      event: 'keyrelease',
      suffix: 'release',
    },
    keydown: {
      hold: true,
      event: 'keyhold',
      suffix: 'hold',
    },
  };

  let handleKeyEvent = (e) => {
    let event = keyEventFields.reduce((out, field) => {
      out[field] = e[field];
      return out;
    }, {});
    if (event.type in eventMap) {
      let mapped = eventMap[event.type];
      event.type = mapped.event;
      event.original = e;
      if (keyHolds[event.keyCode] != mapped.hold) {
        let keyEvent = event.code.toLowerCase() + mapped.suffix;
        let keyEventStack = [];
        ['ctrlKey', 'altKey', 'shiftKey'].forEach((field) => {
          if (event[field]) {
            keyEventStack.push(field.replace('Key', ''));
          }
        });
        keyEventStack.push(keyEvent);
        document.dispatchEvent(
          new CustomEvent(mapped.event, { detail: event })
        );
        document.dispatchEvent(new CustomEvent(keyEvent, { detail: event }));
        document.dispatchEvent(
          new CustomEvent(keyEventStack.join(''), { detail: event })
        );
      }
      keyHolds[event.keyCode] = mapped.hold;
    }
  };

  window.initKeyEventWrapper = function () {
    document.addEventListener('keydown', handleKeyEvent);
    document.addEventListener('keyup', handleKeyEvent);
    document.addEventListener('keypress', handleKeyEvent);
  };
})();
