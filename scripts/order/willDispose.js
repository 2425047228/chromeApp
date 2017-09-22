window.onload = function () {
    //创建面包屑导航
    UI.createCrumbs([['订单处理', '#']]);
    //创建切换跳转
    UI.tabChange('tab','tab-chosen',function (tab) {return location.href = tab.dataset.url;});

    var willDispose = new willDispose();
    var orderList,token;
    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('orderHandle'),{token:token,state:1,page:1,limit:10000},function (json) {
            var jsonData = core.jsonParse(json);
            orderList = jsonData.data;
            willDispose.list(orderList);
            willDispose.bindClick(result.token);
        })
    })
    //搜索处理
    core.byId('search').onclick = function () {
        var searchValue = core.byId('search_value').value.trim();
        if (searchValue == '') return false;
        willDispose.list(orderList,function (ordersn) {
            if (ordersn.indexOf(searchValue) === -1) return false;
            return true;
        });
        willDispose.bindClick(token);
    }

    //待处理数据
    function willDispose() {
        this.list = function (data,middleWare) {
            var len = data.length;
            if (len < 1) return false;
            var content = '';
            for (var i = 0;i < len;++i) {
                if (typeof middleWare === "function" && !middleWare(data[i].ordersn)) break;
                content += '<tr>';
                content += '<td>' +data[i].ordersn+ '</td>';
                content += '<td class="red">' +data[i].time+ '</td>';
                content += '<td>' +data[i].name+ '</td>';
                content += '<td>' +data[i].phone+ '</td>';
                content += '<td>' +data[i].adr+ '</td>';
                content += '<td>' +data[i].create_time+ '</td>';
                content += '<td data-id="' +data[i].id+ '">' +
                    '<input type="button" class="btn btn-cancel" value="取消订单">' +
                    '&emsp;<input type="button" class="btn btn-confirm" value="添加项目">';
                content += '</td></tr>';
            }
            core.byTagName('tbody')[0].innerHTML = content;
        }
        this.bindClick = function (token) {
            var buttons = core.byClass('btn');
            var len = buttons.length;
            if (len < 1) return false;
            for (var i = 0;i < len;++i) {
                buttons[i].onclick = function () {
                    var id = this.parentNode.dataset.id;
                    if (this.classList.contains('btn-cancel')) {
                        core.post(api.getUrl('orderCancel'),{token:token},function (json) {
                            var jsonData = core.jsonParse(json);
                            UI.createAlertCheckbox({
                                title:'取消订单原因',
                                button:'取消订单',
                                options:jsonData.data,
                                callback:function (options) {
                                    var len = options.data.length;
                                    if (len < 1) return false;
                                    var content = '';
                                    for (var i = 0;i < len;++i) {
                                        content += options.data[i] + ',';
                                    }
                                    core.post(api.getUrl('orderCancel'),{token:token,quxiao:content.replace(/,$/g,''),id:id});
                                    return location.reload();
                                }
                            });
                        })

                    }
                    if (this.classList.contains('btn-confirm')) {
                        return location.href = './add.html?id='+id;
                    }
                }
            }
        }
    }
}
