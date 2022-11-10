namespace('sp.minifier.About', () => {
  const about = [
    'Minifier is a tool for turning digital images into printable standing miniatures.',
    'Import your images and print them as miniatures of 1", 2", 3", or 4".',
    'Publish sheets of armies, soldiers, or minions by increasing the count of a an image.',
  ];
  return function (props) {
    return (
      <>
        <h3>About Minifier...</h3>
        {about.map((p, i) => (
          <p key={`about-${i}`}>{p}</p>
        ))}
        <div className="d-flex justify-content-end">
          <button className="btn btn-info" onClick={() => props.onClose()}>
            OK
          </button>
        </div>
      </>
    );
  };
});
