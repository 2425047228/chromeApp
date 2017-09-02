"use strict"
window.onload = function () {
    var paramObj = core.paramToObject(location.search.substr(1));
    //传递订单总数
    if (typeof paramObj.order !== "undefined") core.byId("order").innerText = paramObj.order;
    //传递金额总价
    if (typeof paramObj.amount !== "undefined") {
        paramObj.amount = paramObj.amount.toString();
        var numberArr =  paramObj.amount.split('.');
        if (numberArr[0] > 0) core.byId("int").innerText = numberArr[0];
        if (numberArr.length > 1 && numberArr[1] > 0) core.byId("float").innerText = '.' + numberArr[1];
    }

}
