namespace("Menu",() => {
    const closeMenus = function (elem) {
        elem = elem || document;
        Array.from(elem.getElementsByClassName('show-menu')).forEach((menu) => {
            menu.classList.remove('show-menu');
        });
    };
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
    const MenuItem = function(props) {
        const { id, label, callback } = props;
        let isDisabled = props.isDisabled || (() => false);
        return <li key={ `${id}-li` } >
            <a key={ `${id}-a` }  href="#" className={`dropdown-item${isDisabled()?" disabled":''}`} onClick={ (e) => {
                e.preventDefault();
                callback();
                closeMenus();
            }}>{label}</a>
        </li>;
    };
    const SubMenu = function(props) {
        const { id, label, items } = props;
        return <li key={ `${id}-li` } className="dropdown-submenu">
            <a key={ `${id}-a` } href="#" className="dropdown-item dropdown-toggle" onClick={(e) => { toggleMenu(e) }}>{ label }</a>
            <DropDownMenu id={ `${id}-ul` } items={ items }/>
        </li>;
    };
    const GroupMenu = function(props) {
        const { id, label, groupClassName, options, getter, setter } = props;
        return <li key={ `${id}-li` } className="dropdown-submenu">
            <a key={ `${id}-a` } href="#" className="dropdown-item dropdown-toggle" onClick={(e) => { toggleMenu(e) }}>{ label }</a>
            <ul key={ `${id}-ul` } className={`dropdown-menu rpg-box ${groupClassName?groupClassName:""}`}>
                { options.map(({ label, value }) => {
                    return <MenuItem key={id+value} id={id+value} isDisabled={() => (getter() === value)} label={label} callback={() => { setter(value) }}/>
                }) }
            </ul>
        </li>;
    };
    const DropDownItem = function(item) {
        if ("items" in item) {
            const { id, label, items } = item;
            return <SubMenu id={id} label={label} items={items}/>;
        } else if ("options" in item) {
            const { id, label, groupClassName, options, getter, setter } = item;
            return <GroupMenu id={id} label={label} groupClassName={groupClassName} getter={getter} setter={setter} options={options}/>;
        } else if ("callback" in item) {
            const { id, label, callback } = item;
            return <MenuItem id={id} label={label} callback={callback}/>
        }
    }
    const DropDownMenu = function(props) {
        return <ul key={ props.id } className="dropdown-menu rpg-box"> { props.items.map(item => DropDownItem(item)) }</ul>;
    }
    return function(props) {
        return <div className="menu-root">
            <ul className="navbar-nav">
                <li className="nav-item active dropdown">
                    <a href="#" className="rpg-box p-3 text-light nav-link dropdown-toggle" onClick={(e) => { toggleMenu(e) }}></a>
                    <DropDownMenu id={'root'} items={props.items}/>
                </li>
            </ul>
        </div>;
    }
});