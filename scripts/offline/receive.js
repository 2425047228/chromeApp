"use strict";
window.onload = function () {
    UI.generateCrumbs([['收衣','#']]);
    var token,i,searchValue = '',id = null,
        name = core.byId('name'),    //用户名
        mobile = core.byId('mobile'),    //手机号
        time = core.byId('time'),    //上次入店时间
        orders = core.byId('orders'),    //未取订单
        platform_card_number = core.byId('card_number'),    //平台会员卡号
        platform_card_name = core.byId('card_name'),    //平台会员类型
        platform_card_balance = core.byId('card_balance'),    //平台会员余额
        merchant_card_number = core.byId('card2_number'),    //商家会员卡号
        merchant_card_name = core.byId('card2_name'),    //商家会员类型
        merchant_card_balance = core.byId('card2_balance');    //商家会员余额
    core.storage.get('token',function (result) {token = result.token;});
    core.byId('next').onclick = function () {
        if (null === id) return false;
    }
    UI.searchListener(function (value) {
        if (value === searchValue) return false;
        searchValue = value;
        var reg = /^(\d|\w)+$/;
        if (value.match(reg) !== null) {
            core.postFormData(api.getUrl('getUserInfo'),{token:token,number:value},function (json) {
                var jsonData = json.parseJson();
                if (jsonData.retVerify()) {
                    console.log(jsonData);
                    var data = jsonData.data;
                    id = data.id;
                    name.innerText = data.username;
                    mobile.innerText = data.mobile;
                    time.innerText = data.join_time;
                    if ('undefined' !== typeof data.platform_card.card_number) {
                        platform_card_number.innerText = data.platform_card.card_number;
                        platform_card_name.innerText = data.platform_card.card_type == 1 ? '金牌会员卡' : '钻石会员卡';
                        platform_card_balance.innerHTML = '&yen;' + data.platform_card.card_sum;
                    } else {
                        platform_card_number.innerText = platform_card_name.innerText = platform_card_balance.innerHTML = '';
                    }
                    merchant_card_number.innerText = data.card_number;
                    merchant_card_name.innerText = data.card_name;
                    merchant_card_balance.innerHTML = '&yen;' + data.balance;
                    var len = data.orders.length;
                    orders.innerHTML = null;
                    if (len > 0) {
                        for (i = 0;i < len;++i) {
                            orders.appendChild(core.e('div',null,data.orders[i]));
                        }
                    }
                } else {
                    return location.href = './register.html?mobile=' + searchValue;
                }
            });
        }
    });
};