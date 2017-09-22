'use strict';
window.onload = function () {
    var param = core.paramToObject();
    console.log(param);
    UI.createCrumbs([
        ['订单处理', './manage.html'],
        ['待清洗', './willClean.html'],
        ['衣物检查', './check.html?id='+param.id],
        ['问题描述', '#']
    ]);
    var question = param.question.split(',');    //问题数组

    core.get('./../../scripts/order/question.json',function (json) {
        var data = json.parseJson();
        UI.createItemChecker(data,question);
    });
    core.byId('submit').onclick = function () {
        core.storage.get('token', function (result) {
            var items = core.byId('chosen').childNodes,
                content = core.byId('content').value,
                item_note = items.getNodesText().toString() + ',' + content;
            core.postFormData(
                api.getUrl('questionSubmit'),
                {token:result.token,id:param.item_id,item_note:item_note},
                function (json) {
                    if (json.parseJson().retVerify()) {
                        return location.href = './check.html?id='+param.id;
                    }
                }
            );
        });
    }
}
