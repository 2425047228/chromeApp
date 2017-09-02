/**
 * ui组件封装函数库,使用前需引入core.js
 * @author yangyunlong
 */
(function(window) {
    var u = {};
    /**
     * 面包屑组件生成器
     * @param arr 二维数组，二维数组中的数组索引，0是导航名称 1是跳转地址
     * @param index 首页跳转地址
     */
    u.createCrumbs = function (arr, index) {
        var len = arr.length;
        if (len < 1) return false;
        if (typeof index === "undefined") index = '../index/index.html';
        var tag = '<em>&gt;</em>';
        var content = '位置&nbsp;:<a href="'+index+'">首页</a>';
        for (var i = 0;i < len;++i) {
            content += tag + '<a href="'+arr[i][1]+'">'+arr[i][0]+'</a>';
        }
        core.byId('crumbs').innerHTML = content;
    }
    window.UI = u;
})(window);
