namespace('sp.common.Header', { 'sp.common.Menu': 'Menu' }, ({ Menu }) => {
  return function (props) {
    return (
      <div className="navbar d-flex justify-content-start">
        <Menu items={props.menuItems} />
        <h3 className="fs-2 align-middle">
          <a href="../../index.html" className="ms-3 navbar-brand text-light">
            Scullery Plateau:
          </a>
          <span className="navbar-brand">{props.appTitle}</span>
        </h3>
      </div>
    );
  };
});
