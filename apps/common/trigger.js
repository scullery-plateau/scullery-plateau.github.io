namespace('sp.common.Trigger',{},() => {
    return function(uid) {
        this.publish = function(payload) {
            document.dispatchEvent(new CustomEvent(uid,{ detail: payload }))
        }
        this.subscribe = function(handler) {
            document.addEventListener(uid,(e) => {
                handler(e.detail);
            })
        }
    }
})