window.onload = function () {
    var param = core.paramToObject();
    UI.createCrumbs([
        ['订单处理','./manage.html'],
        ['添加项目','./add.html?id='+param.id],
        ['工艺加价','#']
    ]);
    core.byId('back').onclick = function () {location.href = './add.html?id='+param.id;}
    var token,data;
    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('editorPrice'),{token:token,id:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            core.byId('freight').innerText = data.freight;
            core.byId('amount').innerText = data.amount;
            core.byId('number').innerText = data.total_num;
            core.byId('total').innerText = data.total;
            dataView(data.list);
        })
    })
    
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
            table.td[3].innerHTML = '&yen;'+data[i].hedging;
            data[i].hedging_amount = 0;
            if (0 != data[i].hedging) {
                data[i].hedging_amount = Math.ceil(data[i].hedging * rate) / 100;
            }
            table.td[4].innerHTML = '&yen;'+data[i].hedging_amount;
            table.td[5].innerHTML = '&yen;'+data[i].special;
            table.td[6].innerHTML = data[i].special_comment;
            table.td[7].innerHTML = '<input type="button" value="编辑" class="btn btn-editor">';
            tbody.appendChild(table.tr);
            core.getImage(host+data[i].url,img);
        }
    }
}
