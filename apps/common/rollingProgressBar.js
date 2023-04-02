namespace('sp.common.RollingProgressBar',{
    "sp.common.ProgressBar":"ProgressBar",
},({ ProgressBar }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                subject:"",
                count:0,
                outOf:1
            };
            props.trigger.subscribe((state) => this.setState(state));
        }
        render() {
            return <ProgressBar subject={this.state.subject} progress={100 * this.state.count / this.state.outOf}/>;
        }
    }
});