namespace('sp.common.Spinner',() => {
    return function() {
        return <svg className="svgCommonSpinner" width="100%" height="100%" viewBox="0 0 100 100">
            <rect x="0" y="0" rx="2" ry="2" width="100" height="100" fill="lightblue"/>
            <rect x="10" y="10" rx="2" ry="2" width="35" height="35" fill="green">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="0 0; 0 0; 0 0; 45 0; 45 0; 45 0; 45 45; 45 45; 45 45; 0 45; 0 45; 0 45; 0 0"
                    dur="4s"
                    repeatCount="indefinite"/>
            </rect>
            <rect x="55" y="10" rx="2" ry="2" width="35" height="35" fill="red">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="0 0; 0 0; 0 45; 0 45; 0 45; -45 45; -45 45; -45 45; -45 0; -45 0; -45 0; 0 0; 0 0"
                    dur="4s"
                    repeatCount="indefinite"/>
            </rect>
            <rect x="55" y="55" rx="2" ry="2" width="35" height="35" fill="yellow">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="0 0; -45 0; -45 0; -45 0; -45 -45; -45 -45; -45 -45; 0 -45;  0 -45;  0 -45; 0 0; 0 0; 0 0"
                    dur="4s"
                    repeatCount="indefinite"/>
            </rect>
        </svg>;
    }
});