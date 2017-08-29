/**
 * 网络请求封装函数对象
 * @author yangyunlong
 */
(function(window) {
    var h = {};                      //声明函数内置对象
    h.xhr = new XMLHttpRequest();    //创建ajax对象
    /**
    * get方式发送http请求
    * @param url 
    * @param callback 回调函数
    */
    h.get = function(url, callback) {
        var xmlHttp = this.xhr;
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                typeof callback === "function" && callback(xmlHttp.responseText);
            }
        }
        this.xhr.send();
    }

    /**
    * post方式发送http请求
    * @param url 
    * @param args 请求参数
    * @param callback 回调函数
    */
    h.post = function(url, args, callback) {
        var xmlHttp = this.xhr;
        if (typeof args === "object") args = this.toParamString(args);
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = function() {
            if (4 == xmlHttp.readyState) {
                typeof callback === "function" && callback(xmlHttp.responseText);
            }
        }
        this.xhr.send(args);
    }

   /**
    * 对象转参数字符串
    * @param obj 对象参数
    * @return string 参数字符串
    */ 
    h.toParamString = function (obj) {
        if (typeof obj !== "object") return obj;
        var param = '';
        for (var k in obj) {
            param += k+'='+obj[k]+'&';
        }
        return param;
    }

    window.http = h;    //赋值全局window
})(window)
