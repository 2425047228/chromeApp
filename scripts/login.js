"use strict"
window.onload = function () {
    core.closeListener();
    core.byId("verify").onclick = function () {
        var args = core.dataByIds(["account","username"],["passwd","password"]);
        var params = http.toParamString(args);
        http.post(api.getUrl("login"),params,function(data){
            //console.log(eval('('+data+')'));
            //console.log(data.paresJSON());
        });
    }
}