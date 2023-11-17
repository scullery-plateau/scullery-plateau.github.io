namespace("sp.font-awesome-sampler.FontAwesomeSampler", {
  "sp.font-awesome-sampler.Brands":"brands",
  "sp.font-awesome-sampler.Favorites":"favorites",
  "sp.font-awesome-sampler.Irregular":"irregular",
  "sp.font-awesome-sampler.Regular":"regular",
  "sp.font-awesome-sampler.Solid":"solid",
}, ({ brands, favorites, irregular, regular, solid }) => {
  const allIcons = {};
  regular.forEach((key) => {
    if (allIcons[key]) {
      allIcons[key].push("far")
    } else {
      allIcons[key] = ["far"];
    }
  });
  solid.forEach((key) => {
    if (allIcons[key]) {
      allIcons[key].push("fas")
    } else {
      allIcons[key] = ["fas"];
    }
  });
  const keys = Object.keys(allIcons);
  keys.sort();
  return class extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (<>
        <h2 className="text-center">FontAwesome Sampler</h2>
        <div className="d-flex flex-wrap">
          { irregular.map((key) => {
            return (<>
              <div className="rpg-box text-light d-flex flex-column text-center">
                <h5><i className={`far fa-${key} fa-2x`}></i></h5>
                <h5>{key}</h5>
              </div>
            </>);
          }) }
        </div>
        <div className="d-flex flex-wrap">
          { favorites.map((key) => {
            return (<>
              <div className="rpg-box text-light d-flex flex-column text-center">
                <h5><i className={`fas fa-${key} fa-2x`}></i></h5>
                <h5>{key}</h5>
              </div>
            </>);
          }) }
        </div>
        <hr/>
        <div className="d-flex flex-wrap">
          { keys.map((key) => {
            return (<>
              <div className="rpg-box text-light d-flex flex-column text-center">
                <h5>{key}</h5>
                <div className="d-flex justify-content-center">
                  <ul>
                  { allIcons[key].map((header) => {
                    return <li><i className={`${header} fa-${key} fa-2x`}></i>&nbsp;<span>{header}</span></li>
                  })}
                  </ul>
                </div>
              </div>
            </>);
          }) }
        </div>
        <hr/>
        <div className="d-flex flex-wrap">
          { brands.map((key) => {
            return (<>
              <div className="rpg-box text-light d-flex flex-column text-center">
                <h4><i className={`fab fa-${key} fa-2x`}></i></h4>
                <h5>{key}</h5>
              </div>
            </>);
          }) }
        </div>
      </>);
    }
  }
});