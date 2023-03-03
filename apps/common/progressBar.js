namespace('sp.common.ProgressBar',{},() => {
  return function({ subject, progress }) {
    return <div className="d-flex flex-column">
      <p>Loading {subject}, please wait....</p>
      <div className="progress">
        <div className="progress-bar" style={{width: `${progress}%`}}>{progress}%</div>
      </div>
    </div>
  }
});