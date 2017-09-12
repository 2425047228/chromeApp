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
            html += '<td style="max-width: 150px;">' +data[i].ordersn+ '</td>';
            html += '<td>';
            itemsLen = data[i].item.length;
            for (j = 0;j < itemsLen;++j) {
                html += '<div class="clearfix" style="padding: 4px 0;">' +
                    '<div class="left">'+ data[i].item[j].g_name + '</div>' +
                    '<div class="right" style="padding:0 22px;">&yen;' + data[i].item[j].price + '</div>' +
                    '<div class="right">×' + data[i].item[j].number + '</div>' +
                    '</div>';
            }
            html += '</td>';
            html += '<td>' +
                '<div style="padding: 4px 0;" class="clearfix">上门服务费<div class="right" style="padding-right: 24px;">&yen;'+data[i].freight+'</div></div>' +
                '<div style="padding: 4px 0;" class="clearfix">特殊工艺加价<div class="right" style="padding-right: 24px;">&yen;'+data[i].special+'</div></div>' +
                '<div style="padding: 4px 0;" class="clearfix">保值洗<div class="right" style="padding-right: 24px;">&yen;'+data[i].hedging+'</div></div>' +
                '<div style="padding: 4px 0;" class="clearfix">优惠金额<div class="right" style="padding-right: 24px;">&yen;'+data[i].coupon_price+'</div></div>' +
                '</td>';
            html += '<td style="max-width: 50px;">' +data[i].sum+ '件</td>';
            html += '<td class="red" style="max-width: 80px;">' +data[i].amount+ '</td>';
            html += '<td style="max-width: 100px;">' +data[i].name+ '<br>' +data[i].phone+ '</td>';
            html += '<td style="max-width: 170px;">' +data[i].adr+ '</td>';
            html += '<td style="max-width: 170px;">' +data[i].update_time+ '</td>';
            html += '<td data-id="'+data[i].id+'"><input type="button" value="衣物检查" class="tab-btn tab-small-btn check"><br>';
            if (1 == data[i].pay_state) {
                html += '<input type="button" value="检查完成" class="tab-btn tab-small-btn done"><br>';
            } else {
                html += '<div style="display: inline-block;position: relative;"><input type="button" value="检查完成" class="tab-btn tab-small-btn tab-grey-btn" ></div>';
            }
            html += '</td></tr>';
        }
        core.byTagName('tbody')[0].innerHTML = html;
        core.byClass('tab-grey-btn').bindClick(function (e) {
            var notice = UI.createNotice('用户尚未付款，您暂时不能做此操作');
            var parent = this.parentNode;
            parent.appendChild(notice);
            notice.style.position = 'absolute';
            notice.style.top = this.offsetHeight + 10 + 'px';
            notice.style.width =  '257px';
            notice.style.left = (notice.offsetWidth - this.offsetWidth) * -1 + 'px';
            window.setTimeout(function(){parent.removeChild(notice);},3000);
        });
        core.byClass('check').bindClick(function () {
            return location.href = './check.html?id='+this.parentNode.dataset.id;
        });
    }

}