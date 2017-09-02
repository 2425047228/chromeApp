"use strict"
window.onload = function () {
    var paramObj = core.paramToObject(location.search.substr(1));
    //传递订单总数
    if (typeof paramObj.order !== "undefined") core.byId("order").innerText = paramObj.order;

    //传递金额总价
    if (typeof paramObj.amount !== "undefined") {
        paramObj.amount = "100.54";
        var int = parseInt(paramObj.amount);
        var float = paramObj.amount.split('.')[1];
        if (int > 0) core.byId("int").innerText = int;
        if (float > 0) core.byId("float").innerText = '.' + float;

    }

}
