"use strict"
window.onload = function () {
    core.closeListener();
    core.byId("verify").onclick = function () {
        //获取表单信息并使用别名
        var args = core.dataByIds(["account","username"],["passwd","password"]);
        //判断表单验证
        if (args.valid === false) return core.notice(args.Msg.notice,{top:240});
        //发送数据请求
        core.post(api.getUrl("login"),args.data,function(json){
            var data = core.jsonParse(json);
            if (!core.apiVerify(data)) return core.notice(data.status,{top:240});
            var result = data.data;
            core.storage.set({role:result.role,token:result.token,clerk:result.uid});
        });
    }
}