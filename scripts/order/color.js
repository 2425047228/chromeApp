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
    var question = param.color.split(',');    //问题数组
    core.get('./../../scripts/order/color.json',function (json) {
        var data = json.parseJson();
        UI.createItemChecker(data,question,true);
    });
    core.byId('submit').onclick = function () {
        core.storage.get('token', function (result) {
            var color = core.byId('chosen').childNodes,
                colorString = color.getNodesText().toString();
            console.log(color);
            console.log(colorString);
            core.postFormData(
                api.getUrl('colorSubmit'),
                {token:result.token,id:param.item_id,color:colorString},
                function (json) {
                    if (json.parseJson().retVerify()) {
                        return location.href = './check.html?id='+param.id;
                    }
                }
            );
        });
    }
}
