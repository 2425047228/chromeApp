/**
 * 核心工具封装函数对象
 * @author yangyunlong
 */
(function(window){
    var c = {};
    /**************************节点操作*******************************/
    //获取指定id节点
    c.byId = function (id) {
        return document.getElementById(id);
    }
    /**
     * 获取表单id列表的值
     * @param arguments id值列表，当参数为数组时，索引:0的值为id值，1的值为别名属性
     * @return object 对应id为属性的对象 
     */
    c.dataByIds = function () {
        var len = arguments.length;
        var obj = {};
        if (len < 1) return obj;
        for (var i = 0;i < len;++i) {
            if (typeof arguments[i] === "object") {
                obj[arguments[i][1]] = this.byId(arguments[i][0]).value;
            } else {
                obj[arguments[i]] = this.byId(arguments[i]).value;
            } 
        }
        return obj;
    }
    /**********************窗口操作****************************/
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