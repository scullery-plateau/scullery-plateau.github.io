(function () {
  window.closeMenus = function (elem) {
    Array.from(elem.getElementsByClassName('show-menu')).forEach((menu) => {
      menu.classList.remove('show-menu');
    });
  };
  document.addEventListener('CloseMenus', () => closeMenus(document));
  window.toggleMenu = function (e, anchor) {
    e.preventDefault();
    let parent = anchor.parentNode;
    let classList = parent.querySelector('ul.dropdown-menu').classList;
    let isShown = classList.contains('show-menu');
    closeMenus(parent.parentNode);
    if (!isShown) {
      classList.add('show-menu');
    }
  };
  window.closeStrayMenu = function (e) {
    let bodyIndex = e.path.map((e) => e.tagName).indexOf('BODY');
    let bodyChildren = e.path.filter((e, i) => i < bodyIndex);
    let navBarNavCount = bodyChildren.filter((elem, index) => {
      return elem.classList.contains('navbar-nav') >= 0;
    }).length;
    if (navBarNavCount < 1) {
      document.dispatchEvent(new Event('CloseMenus'));
    }
  };
})();
