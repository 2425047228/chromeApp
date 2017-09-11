window.onload = function () {
    UI.createCrumbs([['订单处理','./manage.html'], ['添加项目','#']]);
    var param = core.paramToObject();
    var token,data;
    var isChanged,isFirst = false;
    var changeData = [];
    core.storage.get('token',function (result) {
        token = result.token;
        var totalNumber = 0;
        core.post(api.getUrl('getItems'),{token:token,orderid:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            console.log(data);
            var len = data.length;
            if (len < 1) return false;
            var content = '';
            var chosen = ' tab-chosen';
            var itemLen;
            for (var i = 0;i < len;++i) {
                itemLen = data[i].type.length;
                for (var j = 0;j < itemLen;++j) {
                    if (0 != data[i].type[j].state_type) {
                        totalNumber += data[i].type[j].num * 1;
                        changeData.push({
                            name:data[i].type[j].name,
                            orderid:param.id,
                            itemcount:data[i].type[j].num,
                            price:data[i].type[j].price,
                            type:data[i].type[j].id
                        });
                    }
                }
                content += '<span class="tab'+chosen+'">'+data[i].type_name+'</span>';
                chosen = '';
            }
            if (changeData.length < 1) isFirst = true;
            core.byClass('container')[0].innerHTML = content;
            UI.tabChange('tab','tab-chosen',function (tab) {
                var len = data.length;
                var key;
                for (var i = 0;i < len;++i) {
                    if (data[i].type_name == tab.innerText) {
                        key = i;
                        break;
                    }
                }
                changeView(key);
            });
            core.byId('total').innerText = totalNumber;    //渲染总件数
            console.log(changeData);
            //项目长度
            changeView(0);
        })
    });
    function changeView(key,pageNumber) {
        var itemLen = data[key].type.length;
        if (typeof pageNumber === "undefined") pageNumber = 1;
        var page = core.getPage(pageNumber,7);
        var pageData = data[key].type.limit(page[0],page[1]);
        dataView(pageData,data[key].type_name);
        UI.createPageView({maxPage:Math.ceil(itemLen/7),nowPage:pageNumber,callback:function (text, node) {
            //console.log(text);
            changeView(key,text);
        }});
    }

    //界面ui组成构建函数
    function dataView(resource,category) {
        var len = resource.length;
        var content = '';
        var checked = '';
        var tempNum;
        for (var i = 0;i < len;++i) {
            tempNum = hasChange(resource[i].id);
            if (tempNum != false) {
                resource[i].num = tempNum;
                checked = ' checked';
            } else {
                checked = resource[i].state_type == 0 ? '' : ' checked';
            }
            content += '<tr data-id="'+resource[i].id+'" data-price="'+resource[i].price+'" data-name="'+resource[i].name+'">';
            content += '<td><span class="option'+checked+'">'+resource[i].name+'</span></td>';
            content += '<td>'+category+'</td>';
            content += '<td class="red">'+resource[i].price+'</td>';
            content += '<td><em class="subtract"></em><span class="tiny-container">'+resource[i].num+'</span><em class="add"></em></td>';
            content += '</tr>';
        }
        core.byTagName('tbody')[0].innerHTML = content;
        core.byClass('option').bindClick(function () {
            //UI.toggleChecked(this);
            if (this.classList.contains('checked')) {
                this.classList.remove('checked');
            } else {
                this.classList.add('checked');
            }
        });
        core.byClass('subtract').bindClick(function () {    //减少数量
            var numberNode = this.parentNode.childNodes[1];
            if (numberNode.innerText == 0) return false;
            numberNode.innerText = numberNode.innerText * 1 - 1;
            var total = core.byId('total');
            total.innerText = total.innerText * 1 - 1;
            if (0 == numberNode.innerText) {
                this.parentNode.parentNode.childNodes[0].firstChild.classList.remove('checked');
            }
            subtractItem(this.parentNode.parentNode.dataset.id);
            console.log(changeData);
        });
        core.byClass('add').bindClick(function () {    //添加数量
            var numberNode = this.parentNode.childNodes[1];
            numberNode.innerText = numberNode.innerText * 1 + 1;
            var total = core.byId('total');
            total.innerText = total.innerText * 1 + 1;
            this.parentNode.parentNode.childNodes[0].firstChild.classList.add('checked');
            var dataSet = this.parentNode.parentNode.dataset;
            addItem({orderid:param.id,type:dataSet.id,price:dataSet.price,itemcount:1,name:dataSet.name});
            console.log(changeData);
        });
    }

    //判断原数据是否已修改
    function hasChange(id) {
        var len = changeData.length;
        if (len < 1) return false;
        for (var i = 0;i < len;++i) {
            if (id == changeData[i].type) return changeData[i].itemcount;
        }
        return false;
    }
    
    function addItem(object) {    //添加项目
        if (typeof object !== "object") return false;
        var len = changeData.length;
        isChanged = true;
        if (len < 1) {
            return changeData.push(object);
        } else {
            for (var i = 0;i < len;++i) {
                if (changeData[i].type == object.type) {
                    return ++changeData[i].itemcount;
                }
            }
            return changeData.push(object);
        }
    }
    function subtractItem(type) {    //删除项目
        if (typeof type === "undefined") return false;
        var len = changeData.length;
        if (len < 1) return false;
        isChanged = true;
        for (var i = 0;i < len;++i) {
            if (changeData[i].type == type) {
                if (changeData[i].itemcount == 1) {
                    return changeData.splice(i,1);
                } else {
                    return --changeData[i].itemcount;
                }
            }
        }


    }
    core.byId('next').onclick = function () {
        if (isChanged === false) return location.href = './editor.html?id='+param.id;    //判断是否更改
        if (changeData.length < 1) {
            var notice = UI.createNotice('请选择项目!');
            document.body.appendChild(notice);
            var position = core.getCenterPosition(notice.offsetWidth,notice.offsetHeight);
            notice.style.position = 'fixed';
            notice.style.left = position.left + 'px';
            notice.style.top = position.top + 'px';
            window.setTimeout(function(){document.body.removeChild(notice)},3000);
        }
        var url = isFirst ? api.getUrl('addItems') : api.getUrl('getItems');    //第一次调用addItems否则调用getItems
        core.post(url,{token:token,val:JSON.stringify(changeData),id:param.id},function (data) {
            var jsonData = core.jsonParse(data);
            console.log(jsonData);
            if (core.apiVerify(jsonData)) {
                return location.href = './editor.html?id='+param.id;
            }
        })
    }
}
