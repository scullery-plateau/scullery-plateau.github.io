namespace('sp.svengali.buckshot.App', {
  'sp.common.PrintJS': 'PrintJS',
  'sp.svengali.buckshot.Renderer': 'Renderer',
  'sp.svengali.buckshot.Context': 'Context'
}, ({ PrintJS, Renderer, Context }) => {
  const { useState } = React;

  const App = () => {
    const [selectedKey, setSelectedKey] = useState(null);
    const [orientation, setOrientation] = useState('landscape');

    const publish = () => {
      const pkg = Renderer.getPrintPackage(selectedKey, orientation);
      PrintJS.printSvgPages(pkg.title, pkg.orientation, pkg.defs, pkg.pages);
    };

    return (
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Svengali Print Shell</h1>
        
        <div className="row mb-5 justify-content-center">
          <div className="col-md-6 text-center">
            <h5>Select Orientation</h5>
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${orientation === 'landscape' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setOrientation('landscape')}
              >
                Landscape
              </button>
              <button 
                type="button" 
                className={`btn ${orientation === 'portrait' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setOrientation('portrait')}
              >
                Portrait
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-5 justify-content-center">
          <div className="col-md-8 text-center">
            <h5>Select Card Set</h5>
            <div className="d-flex justify-content-center gap-3">
              {Object.keys(Context).map(key => (
                <button 
                  key={key}
                  className={`btn ${selectedKey === key ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedKey(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            className="btn btn-success btn-lg" 
            disabled={!selectedKey}
            onClick={publish}
          >
            Publish to Print Tab
          </button>
        </div>
        
        {!selectedKey && (
          <div className="alert alert-info mt-4 text-center">
            Select a card set to enable publishing.
          </div>
        )}
      </div>
    );
  };

  return { App };
});
