namespace('sp.tokenizer.About', () => {
  const about = [
    'Tokenizer is a tool for reframing digital images into printable and downloadable tokens.',
    'Import your images, apply a frame, and download them or print them as tokens of 1", 2", 3", or 4".',
    'Publish sheets of currency, potions, scrolls, and conditions by increasing the count of a an image.',
  ];
  return function (props) {
    return (
      <>
        <h3>About Tokenizer...</h3>
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
