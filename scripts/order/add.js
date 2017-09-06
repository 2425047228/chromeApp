window.onload = function () {
    UI.createCrumbs([
        ['订单处理','./manage.html'],
        ['添加项目','#']
    ]);
    var param = core.paramToObject();
    var token = null;
    var data = null;
    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('getItems'),{token:token,orderid:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            var len = data.length;
            if (len < 1) return false;
            var content = '';
            var chosen = ' tab-chosen';
            for (var i = 0;i < len;++i) {
                content += '<span class="tab'+chosen+'">'+data[i].type_name+'</span>';
                chosen = '';
            }
            core.byClass('container')[0].innerHTML = content;
            UI.tabChange('tab','tab-chosen',function (tab) {
                console.log(tab);
            })
            console.log(jsonData);
        })
    });
    //tab切换


}
