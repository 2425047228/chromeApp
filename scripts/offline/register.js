'use strict';
window.onload = function () {
    UI.generateCrumbs([['收衣','./receive.html'],['散客信息', '#']]);
    var mobile = core.paramToObject().mobile,token,ucode,
        showArea = core.byClass('select-show')[0],
        showDataArr = showArea.innerText.split('-'),
        yearShow = false,monthShow = false,date = null;    //select标签显示隐藏控制变量
    core.byId('mobile').innerText = mobile;
    core.storage.get('token',function (result) { //ucode
        token = result.token;
        core.postFormData(api.getUrl('getNewUcode'),{token:token},function (json) {
            ucode = json.parseJson(true).ucode;
            core.byId('ucode').innerText = ucode;
        })
    });
    UI.radioListener(function (node) {});
    core.byId('submit').onclick = function () {
        var postData = {
            token:token,
            ucode:ucode,
            uname:core.byId('name').value.trim(),
            sex:core.byClass('radio-checked')[0].innerText,
            mobile:mobile,
            birthday:core.byClass('select-show')[0].innerText
        };
        if ('' === postData.uname) return core.notice('姓名不能为空!');
        core.postFormData(api.getUrl('addNewMember'),postData,function (json) {
            var jsonData = json.parseJson();
            if (jsonData.retVerify()) {
                var userId = jsonData.data.user;
            } else {
                core.notice(jsonData.status)
            }
        })

    }
    core.byClass('select-postfix')[0].onclick = function () {
        if (!yearShow) {
            var select = core.e('select','select-children select-normal'),
                fullYearList = Number(1980).getFullYearList(),
                options = UI.createNodesForText('option',fullYearList.length,fullYearList),
                that = this;
            select.appendChildren(options);
            that.parentNode.appendChild(select);
            UI.selectListener(function (value) {
                showDataArr[0] = value;
                showArea.innerText = showDataArr.join('-');
                if (!monthShow) {
                    var monthList = core.getMonthList();
                    var select2 = core.e('select','select-children select-normal');
                    var previousWidth = select.offsetWidth;
                    var space = 6 * 2;
                    select2.style.left = 'calc(100% + ' + previousWidth + 'px + ' + space + 'px)';
                    var options2 = UI.createNodesForText('option',12,monthList);
                    select2.appendChildren(options2);
                    that.parentNode.appendChild(select2);
                    UI.selectListener(function (value) {
                        showDataArr[1] = value;showDataArr[2] = 1;
                        showArea.innerText = showDataArr.join('-');
                        if (null !== date) that.parentNode.removeChild(date);
                        var dateList = core.getMaxDate(showDataArr[0],showDataArr[1]).getNumberList();
                        date = core.e('select','select-children select-normal');
                        var spaceWidth = previousWidth + select2.offsetWidth;
                        var space = 6 * 3;
                        date.style.left = 'calc(100% + ' + spaceWidth + 'px + ' + space + 'px)';
                        var options3 = UI.createNodesForText('option',dateList.length,dateList);
                        date.appendChildren(options3);
                        that.parentNode.appendChild(date);
                        UI.selectListener(function (value) {
                            showDataArr[2] = value;
                            showArea.innerText = showDataArr.join('-');
                        },2);
                    },1);
                    monthShow = !monthShow;
                }
                /*<select class="select-children select-normal" style="left: calc(100% + 6px + 6px + 64px);">
                 <option>1</option>
                 <option>2</option>
                 <option>3</option>
                 <option>4</option>
                 </select>*/
            });
        } else {
            this.parentNode.removeChildByTagName('select');
            monthShow = false;
            date = null;
        }
        yearShow = !yearShow;

        /*<select class="select-children select-normal">
         <option>1998</option>
         <option>1992</option>
         <option>1938</option>
         <option>1994</option>
         </select>*/
    };

};
