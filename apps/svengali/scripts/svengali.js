namespace('sp.svengali.Svengali',{

},() => {
    const sizeUnits = "mm";
    const cardSize = { min: 64, max: 89 };
    const pageSize = { min: 216, max: 279 };
    const buildTemplateFn = function(columns, markdown) {
        return eval("({" + columns.join(",") + "}) => marked.parse(`" + markdown + "`)");
    }
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {};
        }
        render() {
            return <></>;
        }
    }
});