(function(window){
    var c = {};
    c.byId = function (id) {
        return document.getElementById(id);
    }
    c.close = function (id) {
        if (typeof id !== "undefined") {
            chrome.app.window.get(id).close();
        } else {
            this.current().close();
        }
    }
    c.current = function () {
        return chrome.app.window.current();
    }
    window.core = c;
})(window);