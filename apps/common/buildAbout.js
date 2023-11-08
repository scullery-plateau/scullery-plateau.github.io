namespace("sp.common.BuildAbout",{},() => {
  return function(label,lines) {
    return function (props) {
      return (
        <>
          <h3>About {label}...</h3>
          {lines.map((p, i) => (
            <p key={`about-${i}`}>{p}</p>
          ))}
          <div className="d-flex justify-content-end">
            <button className="btn btn-info" onClick={() => props.close()}>
              OK
            </button>
          </div>
        </>
      );
    };
  };
});