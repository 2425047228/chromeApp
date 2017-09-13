/**
 * 核心工具封装函数对象
 * @author yangyunlong
 */
'use strict';

(function(window){
    /****************************************js原型封装**********************************************/
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g,'');
    }
    Array.prototype.limit = function (index,length) {
        var len = this.length;
        if (len < index + 1) return [];    //判断开始索引是否超出当前数组长度
        var retArr = [];
        var tempIndex;
        for (var i = 0;i < length;++i) {
            tempIndex = index+i;
            if (typeof this[tempIndex] === "undefined") break;
            retArr.push(this[tempIndex]);
        }
        return retArr;
    };

    /****************************************js原型封装**********************************************/
    var formValidator = function() {
        this.__proto__ = null;
        this.required = function(node){    //验证必填项方法
            if (node.getAttribute('required') !== null) {
                if (node.value.trim() === "") return false;
            }
            return true;
        }
        this.number = function (node) {
            if (node.getAttribute('number') !== null) {
                if (isNaN(node.value)) return false;
            }
            return true;
        }
    }
    var c = {
        storage:chrome.storage.local,    //需在manifest中注册storage权限
        byId:function (id) {return document.getElementById(id);},    //获取指定id节点
        e:function (nodeName) {return document.createElement(nodeName);},    //创建节点
        byClass:function (className) {return document.querySelectorAll('.' + className);},
        byTagName:function (tagName) {return document.getElementsByTagName(tagName);},
        iframe:function () {return this.byTagName("iframe")[0];},
        show:function (node) {node.setAttribute("style","display:block");},
        hide:function (node) {node.setAttribute("style","display:none");},
        formValidator:new formValidator(),    //表单验证器
        validatorSwitch:true    //表单验证器开关，默认开启
    };

    /**
     * 对获取的列表数组添加函数时间
     * @param callback 绑定函数
     */
    c.__proto__.bindClick = function (callback) {
        var len = this.length;
        if (typeof callback === "function") {
            for (var i = 0;i < len;++i) {
                this[i].onclick = callback;
            }
        }
    }
    /**
     * 分页函数数据获取
     * @param page 页码
     * @param number 每页记录数
     * @return Array 分页数组
     */
    c.getPage = function (page,number) {
        if (typeof number === "undefined") number = 7;
        if (typeof page === "undefined") page = 1;
        page = (page - 1) * number;
        return [page,number];
    }

    /**
     *多节点操作封装函数
     * @param nodes 节点数组
     * @param exec 回调函数
     */
    c.nodesExec = function (nodes,exec) {
        var len = nodes.length;
        if (len > 1) {
            for (var i = 0;i < len;++i) {typeof exec === "function" && exec(nodes[i],i);}
        }
    }

    /**
     * 节点中寻找指定class的子节点
     * @param node 指定节点
     * @param className class名称
     * @return boolean 找寻到的节点
     */
    c.findBycClass = function (node,className) {
        var children = node.childNodes;
        var name = null;
        for (var index in children) {
            name = children[index].className;
            if (typeof name !== "undefined" &&  name.indexOf(className) !== -1) return children[index];
        }
        return false;
    }

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
        var tempNode,validation = null;
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

    c.getCenterPosition = function(width,height,parent) {
        if (typeof parent === "undefined") parent = document.body;
        return {
            left:(parent.offsetWidth-width)/2,
            top:(parent.offsetHeight-height)/2
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
    c.closeListener = function (stream,callback) {
        var closer = this.byId("close");    //获取close节点
        if (typeof closer !== "undefined") {    //判断节点是否存在
            var that = this;
            if (typeof stream !== "boolean") stream = true;
            closer.addEventListener(
                "click",
                function(){
                    typeof callback === "function" && callback();
                    that.close();
                }, 
                stream);
        }
    }
    //获取当前窗口
    c.current = function () {return chrome.app.window.current();}
    //获取指定id的窗口
    c.windowById = function (id) {return chrome.app.window.get(id);}
    /********************************iframe操作*******************************/
    //iframe 点击加载iframe页面事件监听    class="redirect"    data-url="跳转地址"
    c.iframeRedirectListener = function(callback) {
        var nodes = this.byClass("redirect");
        if ("object" !== typeof nodes) return false;
        var len = nodes.length;
        if (len > 0) {
            var iframe = this.iframe();
            for (var i = 0;i < len;++i) {
                nodes[i].onclick = function () {
                    var url = this.getAttribute("data-url");
                    if (url !== null && url.length > 1) iframe.src = url;
                    typeof callback === "function" && callback(this,nodes);
                }
            }
        }
    }

    /***************************网络请求操作*****************************/
    /**
    * get方式发送http请求
    * @param url 
    * @param callback 回调函数
    */
    c.get = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                typeof callback === "function" && callback(xhr.responseText);
            }
        }
        xhr.send();
    }

    /**
    * post方式发送http请求
    * @param url 
    * @param args 请求参数
    * @param callback 回调函数
    */
    c.post = function(url, args, callback) {
        var xhr = new XMLHttpRequest();
        if (typeof args === "object") args = this.toParamString(args);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (4 == xhr.readyState) {
                typeof callback === "function" && callback(xhr.responseText);
            }
        }
        xhr.send(args);
    }

    /**
     * chrome只允许使用本地资源，网络资源只能以chrome封装的方式请求，封装请求图片方法
     * @param url resource链接地址
     * @param imgNode tag节点
     */
    c.getImage = function (url,imgNode,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",url,true);
        xhr.responseType = "blob";    //声明响应类型为二进制
        xhr.onload = function () {
            var url = window.URL.createObjectURL(this.response);    //chromeURL对象类，仅限于app扩展使用
            if (typeof imgNode !== "undefined" && imgNode !== null) imgNode.src = url;
            typeof callback === "function" && callback(url,this.response);
        }
        xhr.send();
    }

   /**
    * 对象转参数字符串
    * @param obj 对象参数
    * @return string 参数字符串
    */ 
     c.toParamString = function (obj) {
        if (typeof obj !== "object") return obj;
         obj.__proto__ = null;    //防止原型链继承
        var param = '';
        for (var k in obj) {
            //使用encodeURIComponent将参数值中的特殊字符进行转义防止ajax发送请求时缺省掉特殊字符
            param += k+'='+encodeURIComponent(obj[k])+'&';
        }
        //console.log(param);
        return param;
    }

    /**
     * 参数字符串转对象
     * @param string 参数字符串
     * @return object
     */
    c.paramToObject = function (string) {
        //判断是否传入参数，传入则使用，不传入则使用当前url的参数
        if (typeof string === "undefined") string = location.search.substr(1);
        var paramArr = string.split('&');
        var len = paramArr.length;
        var obj = {};
        if (len < 1) return obj;
        var tempArr = null;
        for (var i = 0;i < len;++i) {
            tempArr = paramArr[i].split('=');
            obj[tempArr[0]] = tempArr[1];
        }
        return obj;
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
