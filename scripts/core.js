/**
 * 核心工具封装函数对象
 * @author yangyunlong
 */
'use strict';

(function(window){
    /****************************************js原型封装**********************************************/
    Number.prototype.getFullYearList = function () {
        var currentYear = new Date().getFullYear(),retArr = [],number = this;
        while (number <= currentYear)
        {
            retArr.push(number);
            ++number;
        }
        return retArr;
    };
    Number.prototype.getNumberList = function () {
        var retArr = [];
        if (this > 0) {
            for (var i = 1;i <= this;++i) {
                retArr.push(i);
            }
        }
        return retArr;
    };
    String.prototype.inArrayObject = function (array,type) {
        var len = array.length;
        if (len < 1) return -1;
        for (var i = 0;i < len;++i) {
            if (this === array[i][type]) return i;
        }
        return -1;
    }
    String.prototype.inArray = function (array) {
        var len = array.length;
        if (len < 1) return -1;
        for (var i = 0;i < len;++i) {
            if (this === array[i]) return i;
        }
        return -1;
    };
    String.prototype.base64toBlob = function () {
        var splitArray = this.split(',');    //分割base64数据的头与内容
        var byteString = atob(splitArray[1]);    //base64解码
        var mimeString = splitArray[0].split(':')[1].split(';')[0];    //data:image/png;base64，获取mime类型
        var bufferSize = byteString.length;    //获取数据的大小
        var buffer = new ArrayBuffer(bufferSize);    //创建同等于数据大小的内存区域
        var dataView = new Uint8Array(buffer);    //创建一个8位无符号整数，长度1个字节的数据视图，并分配buffer
        for (var i = 0; i < byteString.length; i++) {
            dataView[i] = byteString.charCodeAt(i);    //获取每个字节Unicode编码并追加数据视图数组
        }
        return new Blob([buffer], {type: mimeString});    //返回原数据类型对象
    };
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g,'');
    };
    String.prototype.parseJson = function (retdata) {
        try {
            var obj =  JSON.parse(this);
        } catch (e) {
            console.log(e.message);
            return {};
        }
        if (typeof retdata !== "undefined" && retdata) return obj.data;
        return obj;
    };
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
    Array.prototype.filtration = function (key, string, isStrict) {
        var len = this.length, retArr = [];
        if (len < 1) return retArr;
        if (typeof isStrict !== "boolean") isStrict = false;
        for (var i = 0;i < len;++i) {
            if (isStrict) {
                if (this[i][key] === string) retArr.push(this[i]);
            } else  {
                if (this[i][key].indexOf(string) !== -1) retArr.push(this[i]);
            }
        }
        return retArr;
    };
    Object.prototype.getNodesText = function () {
        var len = this.length;
        var retArr = [];
        if (len < 1) return retArr;
        for (var i = 0;i < len;++i) {
            if (1 === this[i].nodeType) retArr.push(this[i].innerText);
        }
        return retArr;
    };
    Object.prototype.retVerify = function () {
        if (0 === this.retcode || "0" === this.retcode) return true;    //判断返回数据是否正常
        return false;
    };
    Node.prototype.removeChildByTagName = function (tagName) {
        var nodes = this.childNodes,len = nodes.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                if (1 === nodes[i].nodeType && nodes[i].nodeName === tagName.toUpperCase()) {
                    this.removeChild(nodes[i]);--i;--len;    //nodes动态减少
                }
            }
        }
    };
    Node.prototype.appendChildren = function (nodeList) {
        var len = nodeList.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                1 === nodeList[i].nodeType && this.appendChild(nodeList[i]);
            }
        }
    };
    NodeList.prototype.delete = function () {
        if ('undefined' !== typeof this.nodeType && 1 === this.nodeType) {
            this.parentNode.removeChild(this);
        }
    };
    NodeList.prototype.addClass = function (className) {
        var len = this.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                1 === this[i].nodeType && this[i].classList.add(className);
            }
        }
    };
    NodeList.prototype.removeClass = function (className) {
        var len = this.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                1 === this[i].nodeType && this[i].classList.remove(className);
            }
        }
    };

    NodeList.prototype.filtrationForDataSet = function (key,value) {
        var len = this.length,retArr = [];
        if (len < 1) return retArr;
        for (var i = 0;i < len;++i) {
            1 === this[i].nodeType &&
            'undefined' !== typeof this[i].dataset[key] &&
            this[i].dataset[key] === value &&
            retArr.push(this[i]);
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
        e:function (nodeName,className,text) {
            var node = document.createElement(nodeName);
            if (typeof className === "string") node.className = className;
            if ('string' === typeof text || 'number' === typeof text) node.innerText = text;
            return node
        },    //创建节点
        byClass:function (className) {return document.querySelectorAll('.' + className);},
        byTagName:function (tagName) {return document.getElementsByTagName(tagName);},
        iframe:function () {return this.byTagName("iframe")[0];},
        show:function (node) {node.setAttribute("style","display:block");},
        hide:function (node) {node.setAttribute("style","display:none");},
        formValidator:new formValidator(),    //表单验证器
        validatorSwitch:true,    //表单验证器开关，默认开启
        getMonthList:function () {return [1,2,3,4,5,6,7,8,9,10,11,12];},
        getMaxDate:function (year,month) {return new Date(year,month,0).getDate();}
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
    c.findByClassForFirstChild = function (node,className) {
        var children = node.childNodes;
        for (var index in children) {
            if (
                typeof children[index].classList !== "undefined"
                &&
                children[index].classList.contains(className)
            ) return children[index];
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
        xhr.open("POST", url, true);
        if (typeof args === "object") {
            if (!(args instanceof FormData)) {
                args = this.toParamString(args);
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            }
        }
        xhr.send(args);
        xhr.onreadystatechange = function() {
            if (4 == xhr.readyState) {
                typeof callback === "function" && callback(xhr.responseText);
            }
        }

    };

    /**
     * 基于FormData发送post请求
     * @param url
     * @param argsObj 请求参数对象
     * @param callback 回调函数
     */
    c.postFormData = function (url,argsObj,callback) {
        if (typeof argsObj !== "object") throw new Error('该方法第二个参数必须是一个对象!');
        var xhr = new XMLHttpRequest(),fd = new FormData();
        delete fd.__proto__.__proto__.bindClick;    //删除原型bindClick成员方法
        xhr.open('POST',url,true);
        for (var k in argsObj) {
            if (typeof argsObj[k] === "object") {    //判断是否为文件对象
                fd.append(k, argsObj[k].file, argsObj[k].name);
            } else {
                fd.append(k, argsObj[k]);
            }
        }
        xhr.send(fd);
        xhr.onreadystatechange = function () {
            if (4 == xhr.readyState) typeof callback === "function" && callback(xhr.responseText);
        }
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
    
    c.chooseImage = function (callback) {
        chrome.fileSystem.chooseEntry(
            {
                type: 'openFile',
                accepts:[
                    {
                        mimeTypes:['image/jpeg','image/png'],
                        extensions:['jpeg','jpg','JPEG','JPG','png','PNG']
                    }
                ],
                acceptsMultiple:true
            },
            function (fileEntries) {
                typeof callback === "function" && callback({
                    fileEntries:fileEntries,
                    error:chrome.runtime.lastError
                });
            }
        );
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
            obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
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
        return data.retVerify();
    }

    window.core = c;
})(window);
