window.onload = function () {
    //创建面包屑导航
    UI.createCrumbs([['订单处理', '#']]);
    //创建切换跳转
    UI.tabChange('tab','tab-chosen',function (tab) {return location.href = tab.dataset.url;});
}
