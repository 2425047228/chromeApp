window.onload = function () {
    var param = core.paramToObject();
    UI.createCrumbs([
        ['订单处理','./manage.html'],
        ['添加项目','./add.html?id='+param.id],
        ['工艺加价','#']
    ]);
    var token,data,tempNode = {};
    core.byId('back').onclick = function () {location.href = './add.html?id='+param.id;}
    core.byId('confirm').onclick = function () {
        core.post(api.getUrl('gotIt'),{token:token,id:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            if (core.apiVerify(jsonData)) return location.href = './willDispose.html';

        })
    };

    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('editorPrice'),{token:token,id:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            console.log(data);
            core.byId('freight').innerText = data.freight;
            core.byId('amount').innerText = data.amount;
            core.byId('number').innerText = data.total_num;
            core.byId('total').innerText = data.total;
            console.log(data.list);
            dataView(data.list);
            core.byClass('btn-editor').bindClick(function () {
                var tr = this.parentNode.parentNode;
                tempNode.special = tr.childNodes[5];
                tempNode.comment = tr.childNodes[6];
                tempNode.hedging_amount = tr.childNodes[4];
                tempNode.hedging = tr.childNodes[3];
                tempNode.id = this.dataset.id;
                UI.createAlertInput(function (input,alertBg) {
                    input[3].cancel.onclick = function () {document.body.removeChild(alertBg);}
                    input[3].confirm.onclick = function () {
                        var special = core.byId('special').value,
                            hedging = core.byId('hedging').value,
                            comment = core.byId('comment').value;
                        if (special.trim() != '' && !isNaN(special) && comment.trim() != '') {
                            core.post(api.getUrl('modifySpecial'),{id:tempNode.id,special:special,special_comment:comment,token:token},function (json) {
                                var jsonData = core.jsonParse(json);
                                if (!core.apiVerify(jsonData)) return false;
                                core.byId('total').innerText = jsonData.data.total;
                                tempNode.special.innerHTML = '&yen;'+special;
                                tempNode.comment.innerText = comment;
                                if (typeof alertBg !== "undefined") {
                                    document.body.removeChild(alertBg);
                                    alertBg = false;
                                }
                            })
                        }
                        if (hedging.trim() != '' && !isNaN(hedging)) {
                            var real_amount = Math.ceil(hedging*100/20)/100;
                            core.post(api.getUrl('modifyHedging'),{id:tempNode.id,hedging:real_amount,token:token},function (json) {
                                var jsonData = core.jsonParse(json);
                                if (!core.apiVerify(jsonData)) return false;
                                core.byId('total').innerText = jsonData.data.total;
                                tempNode.hedging.innerHTML = '&yen;'+hedging;
                                tempNode.hedging_amount.innerHTML = '&yen;'+real_amount;
                                if (typeof alertBg !== "undefined") {
                                    document.body.removeChild(alertBg);
                                    alertBg = false;
                                }
                            })
                        }
                    }
                });
            })
        })
    });
    
    function dataView(data) {
        var len = data.length;
        if (len < 1) return false;
        var host = api.getHost();
        var tbody = core.byTagName('tbody')[0];
        var table,img;
        var rate = 5;     //保值清洗费比率百分之5
        tbody.innerHTML = '';    //清空原数据
        for (var i = 0;i < len;++i) {
            img = document.createElement('img');
            table = UI.createTds(8);
            table.td[0].appendChild(img);table.td[0].style.maxWidth = '390px';
            table.td[0].appendChild(document.createTextNode(data[i].name));
            table.td[1].innerText = data[i].number;table.td[1].style.maxWidth = '60px';
            table.td[2].innerHTML = '&yen;'+data[i].price;
            table.td[3].innerHTML = '&yen;'+data[i].hedging * 20;
            table.td[4].innerHTML = '&yen;'+data[i].hedging;
            table.td[5].innerHTML = '&yen;'+data[i].special;
            table.td[6].innerHTML = data[i].special_comment;
            table.td[7].innerHTML = '<input type="button" value="编辑" class="btn btn-editor" data-id="'+data[i].id+'">';
            tbody.appendChild(table.tr);
            core.getImage(host+data[i].url,img);
        }
    }
}
