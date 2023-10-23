namespace("sp.common.EditMode",{},() => {
    const defaultMessage = "This page is currently being edited...";
    const buildHandler = function(message) {
        return function(event) {
            const outVal = (message || defaultMessage);
            (event || window.event).returnValue = outVal;
            return outVal;
        }
    }
    const EditMode = function(handler) {
        this.disable = function(){
            window.removeEventListener("beforeunload",handler);
        }
    }
    return {
        enable:function(message) {
            const handler = buildHandler(message);
            window.addEventListener("beforeunload",handler);
            return new EditMode(handler);
        }
    }
});