window.onload = function () {
    //创建面包屑导航
    UI.createCrumbs([['订单处理', '#']]);
    //创建切换跳转
    UI.tabChange('tab','tab-chosen',function (tab) {return location.href = tab.dataset.url;});
    var token,data;
    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('orderHandle'),{token:token,state:2},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            dataView(data);
            console.log(data);
        })
    });
    
    
    function dataView(data) {
        var len = data.length;
        if (len < 1) return false;
        var itemsLen,j;
        var html = '';
        for (var i = 0;i < len;++i) {
            html += '<tr>';
            html += '<td>' +data[i].ordersn+ '</td>';
            html += '<td>';
            itemsLen = data[i].item.length;
            for (j = 0;j < itemsLen;++j) {
                html += data[i].item[j].g_name + '&emsp;&emsp;&emsp;×' + data[i].item[j].number +
                    '&emsp;&yen;' + data[i].item[j].price + '<br>';
            }
            html += '</td>';
            html += '<td>上门服务费&emsp;&emsp;&emsp;'+data[i].freight+'</td>';
            html += '<td>' +data[i].sum+ '件</td>';
            html += '<td class="red">' +data[i].amount+ '</td>';
            html += '<td>' +data[i].name+ '</td>';
            html += '<td>' +data[i].phone+ '</td>';
            html += '<td>' +data[i].adr+ '</td>';
            html += '<td>' +data[i].update_time+ '</td>';
            html += '<td><input type="button" value="衣物检查" class="tab-btn tab-small-btn"><br>' +
                '<input type="button" value="检查完成" class="tab-btn tab-small-btn"><br>' +
                '<input type="button" value="检查完成" class="tab-btn tab-small-btn tab-grey-btn" >' +
                '</td>';
            html += '</tr>';
        }
        core.byTagName('tbody')[0].innerHTML = html;
    }

}