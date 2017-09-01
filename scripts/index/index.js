"use strict"
window.onload = function () {
    var paramObj = core.paramToObject(location.search.substr(1));
    //传递订单总数
    if (typeof paramObj.order !== "undefined") core.byId("order").innerText = paramObj.order;

    //传递金额总价
    if (typeof paramObj.amount !== "undefined") {
        var int = paramObj.amount.parseInt();
        var float = paramObj.amount.split('.')[1];
        if (int > 0) core.byId("int").innerText = '.' + float;

    }

}
