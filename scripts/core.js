(function(window){
    var c = {};
    //获取指定id节点
    c.byId = function (id) {
        return document.getElementById(id);
    }
    //关闭指定id窗口或当前窗口
    c.close = function (id) {
        if (typeof id !== "undefined") {
            this.windowById(id).close();
        } else {
            this.current().close();
        }
    }
    //监听id=close的节点为窗口关闭    stream为事件流 默认true
    c.closeListener = function (stream) {
        var closer = this.byId("close");    //获取close节点
        if (typeof closer !== "undefined") {    //判断节点是否存在
            var that = this;
            if (typeof stream !== "boolean") stream = true;
            closer.addEventListener("click",function(){that.close();}, stream);
        }
    }
    //获取当前窗口
    c.current = function () {
        return chrome.app.window.current();
    }
    //获取指定id的窗口
    c.windowById = function (id) {
        return chrome.app.window.get(id)
    }
    window.core = c;
})(window);