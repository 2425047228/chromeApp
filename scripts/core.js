/**
 * 核心工具封装函数对象
 * @author yangyunlong
 */
(function(window){
    var formValidator = function() {
        this.required = function(node){    //验证必填项方法
            if (node.getAttribute("required") !== null) {
                if (c.trim(node.value) === "") return false;
            }
            return true;
        }
    }
    var c = {
        xhr:new XMLHttpRequest(),    //创建ajax对象
        storage:chrome.storage.local,    //需在manifest中注册storage权限
        byId:function (id) {return document.getElementById(id);},    //获取指定id节点
        formValidator:new formValidator(),    //表单验证器
        validatorSwitch:true    //表单验证器开关，默认开启
    };

    /******************************表单操作***********************************/
    /**
     * 获取表单id列表的值
     * @param arguments id值列表，当参数为数组时，索引:0的值为id值，1的值为别名属性
     * @return object 对应id为属性的对象 
     */
    c.dataByIds = function () {
        var len = arguments.length;
        var obj = {valid:false,data:{}};
        if (len < 1) return false;
        var tempNode,validation = null
        for (var i = 0;i < len;++i) {
            if (typeof arguments[i] === "object") {
                tempNode = this.byId(arguments[i][0]);
                validation = this.formVerify(tempNode);
                if (validation !== true) {
                    obj.Msg = validation;
                    return obj;
                };
                obj.data[arguments[i][1]] = tempNode.value;
            } else {
                tempNode = this.byId(arguments[i]);
                validation = this.formVerify(tempNode);
                if (validation !== true) {
                    obj.Msg = validation;
                    return obj;
                };
                obj.data[arguments[i]] = tempNode.value;
            } 
        }
        obj.valid = true;
        return obj;
    }
    //去除内容空白字符
    c.trim = function(str) {return str.replace(/(^\s*)|(\s*$)/g, "");}
    //调用表单验证器 返回验证结果 boolean值
    c.formVerify = function(node) {
        if (!this.validatorSwitch) return true;    //判断表单验证器是否开启状态
        for (var k in this.formValidator) {
            if (!this.formValidator[k](node)) return {    //返回验证失败信息
                element:node,
                notice:node.getAttribute("data-notice"),
                option:k
            };
        }
        return true;
    }
    /************************样式操作***************************/
    /**
     * 提示框
     * @param str 提示文字
     * @param position 距离页面顶部（top），左边（left）的距离
     * @return void
     */
    c.notice = function(str,position) {
        var body = document.body;
        var node = document.createElement("div");
        node.style.color = "rgb(255,255,255)";
        node.style.borderRadius = "3px";
        node.style.background = "black";
        node.style.fontSize = "16px";
        node.style.maxWidth = body.offsetWidth + "px";
        node.style.padding = "5px 18px";
        node.style.display = "inline-block";
        node.style.position = "fixed";
        node.innerText = str;
        body.appendChild(node);
        if (typeof position !== "object") {
            position = this.getCenterPosition(node.offsetWidth,node.offsetHeight);
        } else {
            var tempPosition = this.getCenterPosition(node.offsetWidth,node.offsetHeight);
            if (typeof position.left === "undefined") position.left = tempPosition.left;
            if (typeof position.top === "undefined") position.top = tempPosition.top;
        }
        node.style.left = position.left + "px";
        node.style.top = position.top + "px";
        window.setTimeout(function(){body.removeChild(node);},3000);
    }

    c.getCenterPosition = function(width,height) {
        return {
            left:(document.body.offsetWidth-width)/2,
            top:(document.body.offsetHeight-height)/2
        }
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
    c.current = function () {return chrome.app.window.current();}
    //获取指定id的窗口
    c.windowById = function (id) {return chrome.app.window.get(id);}

    /***************************网络请求操作*****************************/
    /**
    * get方式发送http请求
    * @param url 
    * @param callback 回调函数
    */
    c.get = function(url, callback) {
        var xmlHttp = this.xhr;
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                typeof callback === "function" && callback(xmlHttp.responseText);
            }
        }
        xmlHttp.send();
    }

    /**
    * post方式发送http请求
    * @param url 
    * @param args 请求参数
    * @param callback 回调函数
    */
    c.post = function(url, args, callback) {
        var xmlHttp = this.xhr;
        if (typeof args === "object") args = this.toParamString(args);
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = function() {
            if (4 == xmlHttp.readyState) {
                typeof callback === "function" && callback(xmlHttp.responseText);
            }
        }
        xmlHttp.send(args);
    }

   /**
    * 对象转参数字符串
    * @param obj 对象参数
    * @return string 参数字符串
    */ 
    c.toParamString = function (obj) {
        if (typeof obj !== "object") return obj;
        var param = '';
        for (var k in obj) {
            param += k+'='+obj[k]+'&';
        }
        return param;
    }

    /**
     * json数据解析并防止报错信息
     * @param json json数据
     * @return 数据数组对象
     */
    c.jsonParse = function(json) {
        try {
            return JSON.parse(json);
        } catch (e) {console.log(e.message);}
        return {};
    }
    //搭配jsonParse验证数据返回码
    c.apiVerify = function (data) {
        if (
            (0 === data.retcode || "0" === data.retcode)
             && 
            "OK" === data.status
        ) return true;    //判断返回数据是否正常
        return false;
    }

    window.core = c;
})(window);