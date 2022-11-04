namespace('SizePickerMenu',["Menues"],({ Menues }) => {
    return function(props) {
        const {setSize, options} = props;
        const [localSize, setLocalSize] = React.useState(16);
        return <>{
            options.map((opt, i) => {
                return <li key={`li${i}`}><a
                    key={`a${i}`}
                    href="react-poc/spritely/scripts/sizePicker#"
                    className={`dropdown-item${ (localSize === opt)?" disabled":""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setLocalSize(opt);
                        setSize(opt);
                        Menues.closeMenus();
                    }}>{opt} X {opt}</a></li>;
            })
        }</>;
    }
});