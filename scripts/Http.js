/**
 * 网络请求封装函数
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
        this.xhr.open("GET", url, true);
        this.xhr.onreadystatechange = function() {
            if (this.xhr.readyState == 4) {
                typeof callback === "function" && callback(xhr.responseText);
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
        this.xhr.open("POST", url, true);
        this.xhr.onreadystatechange = function() {
            if (this.xhr.readyState == 4) {
                typeof callback === "function" && callback(xhr.responseText);
            }
        }
        this.xhr.send(args);
    }

    window.Http = h;    //赋值全局window
})(window)
