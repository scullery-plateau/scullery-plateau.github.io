namespace("Menues",() => {
    const closeMenus = function (elem) {
        elem = elem || document;
        Array.from(elem.getElementsByClassName('show-menu')).forEach((menu) => {
            menu.classList.remove('show-menu');
        });
    };
    document.addEventListener('CloseMenus', () => closeMenus(document));
    const toggleMenu = function (e) {
        e.preventDefault();
        let parent = e.target.parentNode;
        let classList = parent.querySelector('ul.dropdown-menu').classList;
        let isShown = classList.contains('show-menu');
        closeMenus(parent.parentNode);
        if (!isShown) {
            classList.add('show-menu');
        }
    };
    const closeStrayMenu = function (e) {
        let bodyIndex = e.path.map((e) => e.tagName).indexOf('BODY');
        let bodyChildren = e.path.filter((e, i) => i < bodyIndex);
        let navBarNavCount = bodyChildren.filter((elem, index) => {
            return elem.classList.contains('navbar-nav');
        }).length;
        if (navBarNavCount < 1) {
            document.dispatchEvent(new Event('CloseMenus'));
        }
    };
    return { closeMenus, toggleMenu, closeStrayMenu };
});