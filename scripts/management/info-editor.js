'use strict';
window.onload = function () {
    UI.generateCrumbs([['门店信息','./info.html'],['编辑','#']]);
    var token,data;
    core.byId('confirm').onclick = function () {};
    core.storage.get('token',function (result) {
        token = result.token;
        core.postFormData(api.getUrl('merchantInfo'),{token:token},function (json) {
            data = json.parseJson(true);
            console.log(data);
            //core.byId('id').innerText = data.id;
            //core.byId('mname').innerText = data.mname;
            //core.byId('address').innerText = data.address;
            core.getImage(data.qrcode,core.byId('qrcode'));
            core.byId('phone').value = data.phone;
            core.byId('round').value = data.round;
            core.byId('amount').value = data.fuwu_amount;
            core.byId('piece').value = data.fuwu_num;
            core.byId('reduce').value = data.fuwu_total;

            /*core.byId('service').innerHTML = '上门服务费:' + data.fuwu_amount + '元<br>' +
                '满减数:' + data.fuwu_num + '件<br>满减金额:' + data.fuwu_total + '元<br>';
            var len = data.cards.length,html = '',discount;
            for (var i = 0;i < len;++i) {
                discount = 10 == Number(data.cards[i].discount) ? '无折扣' : (data.cards[i].discount + '折');
                html += data.cards[i].card_name + '&nbsp;:&nbsp;' + discount;
                html += '&emsp;&emsp;' + '充值' + data.cards[i].price + '元<br>';
            }
            core.byId('card').innerHTML = html;*/

        })
    });

};