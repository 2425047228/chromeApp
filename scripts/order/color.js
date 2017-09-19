'use strict';
window.onload = function () {
    var param = core.paramToObject();
    console.log(param);
    UI.createCrumbs([
        ['订单处理', './manage.html'],
        ['待清洗', './willClean.html'],
        ['衣物检查', './check.html?id='+param.id],
        ['颜色设置', '#']
    ]);
}
