/**
 * 接口数据函数封装
 * @author yangyunlog
 */
(function(window){
    //"http://xiyi.wzj.dev.shuxier.com",    //测试域名
    //"http://clean.shuxier.com"            //正式域名
    var a = {
        //host:"http://clean.shuxier.com",    //生产环境域名
        host:"http://xiyi.wzj.dev.shuxier.com/",    //测试环境域名
        login:"app.php/Home/Login/login",    //登陆uri
    };
    /**
     * 获取指定成员属性的url
     * @param uri 指定成员属性
     * @return string url
     */
    a.getUrl = function(uri) {return this.host + this[uri];}
    window.api = a;
})(window);