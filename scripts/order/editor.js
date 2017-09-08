window.onload = function () {
    var param = core.paramToObject();
    UI.createCrumbs([
        ['订单处理','./manage.html'],
        ['添加项目','./add.html?id='+param.id],
        ['工艺加价','#']
    ]);
}
