namespace('sp.common.Header', { 'sp.common.Menu': 'Menu' }, ({ Menu }) => {
  return function (props) {
    return (
      <div className="navbar d-flex justify-content-start">
        <Menu items={props.menuItems} />
        <a href="../index.html" className="navbar-brand text-light">
          Scullery Plateau:
        </a>
        <span className="navbar-brand">{props.appTitle}</span>
      </div>
    );
  };
});
