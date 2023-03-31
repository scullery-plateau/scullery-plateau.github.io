namespace('sp.common.RollingProgressBar',{
    "sp.common.ProgressBar":"ProgressBar",
},({ ProgressBar }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            props.trigger.subscribe((state) => this.setState(state));
        }
        render() {
            return <>{this.state.outOf && this.state.subject && typeof this.state.count === 'number' &&
            <ProgressBar subject={subject} progress={100 * this.state.count / this.state.outOf}></ProgressBar>}</>
        }
    }
});