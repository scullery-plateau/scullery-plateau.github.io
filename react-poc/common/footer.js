namespace("Footer",() => {
    return function() {
        const now = new Date();
        return <>
            <p>Built by Daniel Allen Johnson &#169; 2019 - { now.getFullYear() }</p>
            <p><a href="https://github.com/scullery-plateau/scullery-plateau.github.io" className="btn btn-outline-info">See the code on GitHub.</a></p>
        </>
    }
});