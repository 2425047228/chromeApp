/**
 * 接口数据函数对象封装
 * @author yangyunlog
 */
(function(window){
    //"http://xiyi.wzj.dev.shuxier.com",    //测试域名
    //"http://clean.shuxier.com"            //正式域名
    var a = {
        //host:"http://clean.shuxier.com",    //生产环境域名
        host:"http://xiyi.wzj.dev.shuxier.com",    //测试环境域名
        login:"/app.php/Home/Login/login",    //登陆uri
        index:"/app.php/Home/Merchant/index",    //首页接口
        statusSwitchover:"/app.php/Home/Merchant/state_change",    //店铺状态切换 1-营业中 3-休息中
        orderHandle:"/app.php/Home/Merchant/orderHandle",    //订单处理接口 state:0-待处理;1-代取;2-待清洗;3-清洗中;4-代送达
        orderCancel:"/app.php/Home/Merchant/cause",    //取消订单接口
        getItems:"/app.php/Home/Merchant/mod_item_add",    //获取商家项目列表 orderid-订单id
        addItems:"/app.php/Offline/Merchant/item_add",    //添加项目接口:val json:orderid type price itemcount
        done:"/app.php/Home/Merchant/wancheng",    //送件完成 id 订单id
        editorPrice:"/app.php/Home/Merchant/edit_price"     //编辑价格 id 订单id
    };
    /**
     * 获取指定成员属性的url
     * @param uri 指定成员属性
     * @return string url
     */
    a.getUrl = function(uri) {return this.host + this[uri];};
    a.getHost = function () {return this.host;};

    window.api = a;
})(window);