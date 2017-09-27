'use strict';
window.onload = function () {
    UI.generateCrumbs([['门店信息','#']]);
    core.byId('editor').onclick = function () {return location.href = './info-editor.html';};
    const qq = 1;
    var token,data;
    core.storage.get('token',function (result) {
        token = result.token;
        core.postFormData(api.getUrl('merchantInfo'),{token:token},function (json) {
            data = json.parseJson(true);
            core.byId('id').innerText = data.id;
            core.byId('mname').innerText = data.mname;
            core.byId('address').innerText = data.address;
            core.getImage(data.qrcode,core.byId('qrcode'));
            core.byId('phone').innerText = data.phone;
            core.byId('round').innerText = data.round + 'km';
            core.byId('service').innerHTML = '上门服务费:' + data.fuwu_amount + '元<br>' +
                    '满减数:' + data.fuwu_num + '件<br>满减金额:' + data.fuwu_total + '元<br>';
            var len = data.cards.length,html = '',discount;
            for (var i = 0;i < len;++i) {
                discount = 10 == Number(data.cards[i].discount) ? '无折扣' : (data.cards[i].discount + '折');
                html += data.cards[i].card_name + '&nbsp;:&nbsp;' + discount;
                html += '&emsp;&emsp;' + '充值' + data.cards[i].price + '元<br>';
            }
            core.byId('card').innerHTML = html;

        })
    });
};
