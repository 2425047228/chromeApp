(function(window){
    var c = {};
    c.byId = function (id) {
        return document.getElementById(id);
    }
    window.core = c;
})(window);