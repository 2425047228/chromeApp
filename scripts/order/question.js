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
    var len = question.length,
        chosenArr = [],
        contentArr,
        chosenNode = core.byId('chosen');
    /*if (len > 0) {
        for (var i = 0;i < len;++i) {
            //<div class="flex-center-item">有羽绒服内胆<em class="delete"></em></div>
            chosenArr[i] = {item:core.e('div'), em:core.e('em')};
            chosenArr[i].item.className = 'flex-center-item';
            chosenArr[i].item.innerText = question[i];
            chosenArr[i].em.className = 'delete';
            chosenArr[i].item.appendChild(chosenArr[i].em);
            chosenNode.appendChild(chosenArr[i].item);
        }
    }*/

    var data;
    core.get('./../../scripts/order/question.json',function (json) {
        data = json.parseJson();
        console.log(data);
        contentArr = UI.createItemChecker(data,question);
        console.log('#################################');
        console.log(contentArr);
    });
}
