namespace('sp.svengali.wizard.Wizard', {
  'sp.common.FileLoader': 'FileLoader',
  'sp.common.PrintJS': 'PrintJS',
  'sp.svengali.Renderer': 'Renderer'
}, ({ FileLoader, PrintJS, Renderer }) => {
  const { useState, useEffect } = React;

  const Wizard = () => {
    const [layout, setLayout] = useState(null);
    const [data, setData] = useState(null);
    const [icons, setIcons] = useState({});
    const [orientation, setOrientation] = useState('landscape');

    // Status flags based on wizard logic
    const hasLayout = !!layout;
    const hasData = !!data;
    const isReady = hasLayout && hasData; // Icon validation will come later

    const loadLayout = () => {
      FileLoader.loadFile(setLayout, 'json');
    };

    const loadData = () => {
      FileLoader.loadFile(setData, 'json');
    };

    const publish = () => {
      const pkg = Renderer.getPrintPackage(layout, data, icons, orientation);
      PrintJS.printSvgPages(pkg.title, pkg.orientation, pkg.defs, pkg.pages);
    };

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-5">Svengali Wizard</h1>

        <div className="row justify-content-center">
          <div className="col-md-8">
            
            {/* Step 1: Layout */}
            <div className={`card mb-4 ${hasLayout ? 'border-success' : 'border-primary'}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">1. Load Layout</h5>
                  <small className="text-muted">Required to generate data schema</small>
                </div>
                <button className="btn btn-primary" onClick={loadLayout}>
                  {hasLayout ? 'Change Layout' : 'Select File'}
                </button>
              </div>
            </div>

            {/* Step 2: Data (Requires Layout) */}
            <div className={`card mb-4 ${hasData ? 'border-success' : (hasLayout ? 'border-primary' : 'text-muted opacity-50')}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">2. Load Data</h5>
                  <small className="text-muted">Validated against layout requirements</small>
                </div>
                <button className="btn btn-primary" onClick={loadData} disabled={!hasLayout}>
                  {hasData ? 'Change Data' : 'Select File'}
                </button>
              </div>
            </div>

            {/* Settings & Publish */}
            {isReady && (
              <div className="card border-success bg-dark text-light">
                <div className="card-body">
                  <h5 className="text-center mb-4">Finalize & Publish</h5>
                  
                  <div className="mb-4 text-center">
                    <label className="d-block mb-2">Orientation</label>
                    <div className="btn-group" role="group">
                      <button 
                        className={`btn ${orientation === 'landscape' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setOrientation('landscape')}
                      >
                        Landscape
                      </button>
                      <button 
                        className={`btn ${orientation === 'portrait' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setOrientation('portrait')}
                      >
                        Portrait
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <button className="btn btn-success btn-lg px-5" onClick={publish}>
                      Publish Cards
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isReady && (
              <div className="alert alert-info text-center mt-5">
                Complete the steps above to enable publishing.
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  return { Wizard };
});
