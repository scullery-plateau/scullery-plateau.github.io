(function () {
  let appendPopupMenuButton = function (popup) {
    return function (menu, buttonSpec) {
      let button = document.createElement('button');
      button.innerHTML = buttonSpec.label;
      button.setAttribute('class', 'btn btn-' + buttonSpec.class);
      let listener = () => {
        buttonSpec.handler();
        popup.close();
        popup.parentNode.removeChild(popup);
      };
      button.addEventListener('click', listener);
      menu.appendChild(button);
      return menu;
    };
  };
  window.initPopup = function (formContents, buttonSpecs) {
    let popup = document.createElement('dialog');
    popup.setAttribute('class', 'rpg-box text-light w-75');
    let content = document.createElement('div');
    popup.appendChild(content);
    content.innerHTML = formContents;
    let menu = document.createElement('menu');
    popup.appendChild(menu);
    menu.setAttribute('class', 'd-flex justify-content-end');
    buttonSpecs = buttonSpecs || [];
    if (buttonSpecs.length == 0) {
      buttonSpecs.push({
        label: 'OK',
        class: 'info',
        handler: () => {},
      });
    }
    buttonSpecs.reduce(appendPopupMenuButton(popup), menu);
    document.getElementsByTagName('body')[0].appendChild(popup);
    popup.showModal();
  };
})();
