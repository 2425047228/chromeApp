/**
 * ui组件封装函数库,使用前需引入core.js
 * @author yangyunlong
 */
'use strict';

(function(window) {
    var u = {};
    /**
     * 面包屑组件生成器
     * @param array 二维数组，二维数组中的数组索引，0是导航名称 1是跳转地址
     * @param index 首页跳转地址
     */
    u.createCrumbs = function (array, index) {
        var len = array.length;
        if (len < 1) return false;
        if (typeof index === "undefined") index = '../index/index.html';
        var tag = '<em>&gt;</em>';
        var html = '位置&nbsp;:<a href="'+index+'">首页</a>';
        for (var i = 0;i < len;++i) {
            html += tag + '<a href="'+array[i][1]+'">'+array[i][0]+'</a>';
        }
        core.byId('crumbs').innerHTML = html;
    }
    u.generateCrumbs = function (array,index) {
        var body = document.body;
        var crumbsContainer = core.e('nav');
        crumbsContainer.id = 'crumbs';
        body.insertBefore(crumbsContainer,body.children[0]);
        this.createCrumbs(array,index);
    };
    u.searchListener = function (callback) {
        if (typeof callback === "function") {
            core.byId('search').onclick = function () {
                var searchValue = core.byId('search_value').value.trim();
                if ('' === searchValue) return;
                callback(searchValue);
            }
        }
    };

    /**
     * 创建多个节点
     * @param nodeName 节点名称
     * @param number 节点数量
     * @return Array
     */
    u.createNodes = function (nodeName,number,className) {
        var retArr = [];
        if (number < 1) return retArr;
        for (var i = 0;i < number;++i) {
            retArr.push(core.e(nodeName));
            if (typeof className !== "undefined") retArr[i].className = className;
        }
        return retArr;
    };

    /**
     * table td生成器
     * @param array 二维数组
     * @return string 生成html结果
     */
    u.createTd = function (array) {
        var len = array.length;
        if (len < 1) return '';
        var dataLen = array[0].length;    //获取单列长度
        var content = '';
        for (var i = 0;i < len;++i) {
            content += '<tr>';
            for (var j = 0;j < dataLen;++j) {
                content += '<td>' + array[i][j] + '</td>';    //填充每列内容
            }
            content += '</tr>';
        }
        return content;
    }

    /**
     * 创建单行多列的表格行
     * @param length 列数
     * @return object 包含td td 的对象
     */
    u.createTds = function (length) {
        if (isNaN(length) || length < 1) return false;
        var table = {};
        table.tr = document.createElement('tr');
        table.td = [];
        for (var i = 0;i < length;++i) {
            table.td[i] = document.createElement('td');
            table.tr.appendChild(table.td[i]);
        }
        return table;
    }

    /**
     * 创建图片节点
     * @param url string 图片链接地址
     * @return object 返回图片对象
     */
    u.createImg = function (url) {
        if (typeof url !== "string" || url.length < 1) return false;
        var img = document.createElement('img');
        img.src = url;
        return img;
    }

    /**
     * tab切换效果函数及切换后回调处理
     * @param className tab所属的类名称
     * @param switchoverClass 点击切换效果增减的class
     * @param callback 针对于点击后处理的回调函数
     */
    u.tabChange = function (className,switchoverClass,callback) {
        var tabs = core.byClass(className);
        var len = tabs.length;
        if (len < 1) return false;
        for (var i = 0;i < len;++i) {
            tabs[i].onclick = function () {
                if (this.classList.contains(switchoverClass)) return false;    //判断该tab是否处于选中状态
                for (var j = 0;j < len;++j) {tabs[j].classList.remove(switchoverClass);}    //移除所有其他tab选中样式
                this.classList.add(switchoverClass);    //添加选中样式效果
                typeof callback === "function" && callback(this);    //选中tab回调处理
            }
        }
    }

    /**
     * 创建弹出框背景组件
     * @return object
     */
    u.createAlertBg = function () {
        var alertBg = core.e('div');
        alertBg.className = 'alert-bg';
        return alertBg;
    }

    /**
     * 定位相对于背景为中心的弹出框
     * @param alertBg 背景节点
     * @param alerter 弹出框节点
     * @return void
     */
    u.positionInBg = function (alertBg,alerter) {
        var position = core.getCenterPosition(alerter.offsetWidth,alerter.offsetHeight,alertBg);
        alerter.style.position = 'absolute';
        alerter.style.top = position.top + 'px';
        alerter.style.left = position.left + 'px';
    }
    /**
     * 创建弹出复选框组件
     * @param obj 参数对象 属性:title=标题,button=确认按钮内容,options=内容数组,callback=回调函数默认参数选中数组
     */
    u.createAlertCheckbox = function (obj) {
        var len = obj.options.length;
        if (len < 1) return false;
        //创建背景节点
        var alertBg = this.createAlertBg();
        //创建复选框节点并追加至背景
        var checkbox = document.createElement('div');
        checkbox.className = 'checkbox';
        alertBg.appendChild(checkbox);
        //创建标题节点并追加至复选框节点中
        var titleArea = document.createElement('div');
        titleArea.className = 'checkbox-title';
        titleArea.innerText = obj.title;
        checkbox.appendChild(titleArea);
        //创建取消节点,绑定取消事件，并追加至标题部位
        var cancel = document.createElement('i');
        cancel.className = 'checkbox-cancel';
        titleArea.appendChild(cancel);
        cancel.onclick = function () {document.body.removeChild(alertBg);}
        //创建复选框内容部分并追加至复选框节点中
        var bodyArea = document.createElement('div');
        bodyArea.className = 'checkbox-body';
        checkbox.appendChild(bodyArea);
        //创建复选节点，绑定样式事件，并追加至复选框内容部分节点中
        var optionNodes = [];
        for (var i = 0;i < len;++i) {
            optionNodes[i] = document.createElement('div');
            optionNodes[i].className = 'checkbox-option';
            optionNodes[i].innerText = obj.options[i];
            bodyArea.appendChild(optionNodes[i]);
            optionNodes[i].onclick = function () {
                u.toggleChecked(this);
            }
        }
        //创建按钮节点并追加至复选框内容部分节点中
        var button = document.createElement('input');
        button.type = 'button';
        button.className = 'btn btn-larger-confirm';
        button.value = obj.button;
        bodyArea.appendChild(button);
        //将背景节点追加至body节点中，并将复选框节点定位至背景节点中心
        document.body.appendChild(alertBg);
        this.positionInBg(alertBg,checkbox);
        //绑定确认按钮后的回调函数
        if (typeof obj.callback === "function") {
            button.onclick = function () {
                var chosenNodes = core.byClass('checked');
                var len = chosenNodes.length;
                var data = [];
                for (var i = 0;i < len;++i) {
                    data.push(chosenNodes[i].innerText);
                }
                var callbackParam = {nodes:chosenNodes,data:data};
                obj.callback(callbackParam);
            }
        }
    };

    /**
     * 创建弹出输入框组件
     * @param callback 回调函数
     * @return void
     */
    u.createAlertInput = function (callback) {
        var alertBg = this.createAlertBg();    //创建背景节点
        var alerter = core.e('div');    //创建弹出框节点
        alerter.className = 'alert-input-area';
        alertBg.appendChild(alerter);
        document.body.appendChild(alertBg);
        var input = [{},{},{},{}];
        for (var i = 0;i < 4;++i) {
            input[i].line = core.e('div');    //创建单行
            input[i].line.className = 'clearfix';
            alerter.appendChild(input[i].line);
            if (i != 3) {    //判断否为button区域
                input[i].inputArea = core.e('div');    //创建input 区域
                input[i].inputArea.className = 'input-area right';
                input[i].label = core.e('label');    //创建label 区域
                input[i].label.className = 'right label';
                input[i].postfix = core.e('em');    //创建后缀节点
                input[i].postfix.className = 'postfix';
                input[i].inputArea.appendChild(input[i].postfix);
                if (2 == i) {    //判断是否为textarea
                    input[i].postfix.innerText = '0/40';
                    input[i].inputArea.classList.add('text-area');
                    input[i].inputText = core.e('textarea');
                    input[i].inputText.setAttribute('cols','30');
                    input[i].inputText.setAttribute('rows','10');
                    input[i].inputText.setAttribute('maxlength','40');
                    input[i].inputText.setAttribute('id','comment');
                    input[i].label.setAttribute('for','comment');
                    input[i].label.innerText = '备注：';
                    var postfix = input[i].postfix;
                    input[i].inputText.onkeydown = input[i].inputText.onkeyup = function () {
                        postfix.innerText = this.value.length + '/40';
                    }
                } else {
                    input[i].postfix.innerText = '元';
                    input[i].inputText = core.e('input');
                    input[i].inputText.setAttribute('type','text');
                    if (0 == i) {
                        input[i].inputText.setAttribute('id','special');
                        input[i].label.setAttribute('for','special');
                        input[i].label.innerText = '特殊工艺加价：';
                    } else {
                        input[i].inputText.setAttribute('id','hedging');
                        input[i].label.setAttribute('for','hedging');
                        input[i].label.innerText = '保值金额：';
                    }
                }
                //追加节点
                input[i].inputArea.appendChild(input[i].inputText);
                input[i].line.appendChild(input[i].inputArea);
                input[i].line.appendChild(input[i].label);
            } else {
                //创建按钮区域
                input[i].line.classList.add('button-area');
                input[i].cancel = core.e('input');
                input[i].confirm = core.e('input');
                input[i].cancel.setAttribute('type','button');
                input[i].confirm.setAttribute('type','button');
                input[i].cancel.value = '取消';
                input[i].confirm.value = '确认';
                input[i].cancel.className = 'btn btn-cancel btn-larger left';
                input[i].confirm.className = 'btn btn-confirm btn-larger right';
                //追加节点
                input[i].line.appendChild(input[i].cancel);
                input[i].line.appendChild(input[i].confirm);
            }
        }
        //定位
        this.positionInBg(alertBg,alerter);
        typeof callback === "function" && callback(input,alertBg);
        /*<div class="alert-bg">
         <section class="alert-input-area">
         <div class="clearfix">
         <div class="input-area right"><input type="text" id="special"><em class="postfix">元</em></div>
         <label for="special" class="right label">特殊工艺加价：</label>
         </div>
         <div class="clearfix">
         <div class="input-area right"><input type="text" id="hedging"><em class="postfix">元</em></div>
         <label for="hedging" class="right label">保值金额：</label>
         </div>
         <div class="clearfix">
         <div class="input-area right text-area">
         <textarea id="comment" cols="30" rows="10" maxlength="40"></textarea>
         <em class="postfix">0/40</em>
         </div>
         <label for="comment" class="right label">备注：</label>
         </div>
         <div class="clearfix button-area">
         <input type="button" value="取消" class="btn btn-cancel btn-larger left">
         <input type="button" value="确认" class="btn btn-confirm btn-larger right">
         </div>
         </section>
         </div>*/

    }

    /**
     * 复选框选中切换
     * @param node 节点
     * @param callback 回调函数
     * @return void
     */
    u.toggleChecked = function (node,callback) {
        var isExist = node.classList.contains('checked');
        if (isExist) {
            node.classList.remove('checked');
        } else {
            node.classList.add('checked');
        }
        typeof callback === "function" && callback(!isExist);
    }

    /**
     * 分页视图构建函数
     * @param object maxPage = 最大页数; nowPage = 当前页数; showPageNumber = 展示显示页码数的条数
     *
     * */
    u.createPageView = function (object) {
        /*<div class="chosen">1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>下一页</div><div>尾页</div>*/
        var page = core.byClass('page')[0];
        if (
            typeof object !== "object" ||
            typeof object.maxPage === "undefined" ||
            object.maxPage == 1
        ) return page.innerHTML = '';
        if (typeof object.nowPage === "undefined") object.nowPage = 1;
        if (typeof object.showPageNumber === "undefined") object.showPageNumber = 10;
        var html = '';
        if (object.maxPage < object.showPageNumber) {    //如果当前总页数小于展示的页数则隐藏上一页等操作页
            for (var i = 1;i <= object.maxPage;++i) {
                html += i == object.nowPage ? '<div class="chosen">' : '<div>';
                html += i + '</div>';
            }
        } else {    //多页码展示显示上一页的展示
            /*var first,previous,next,last = '';
            for (var i = 0;i < object.showPageNumber;++i) {

            }*/
        }
        page.innerHTML = html;
        var pageList = page.childNodes;
        var pageListLen = pageList.length;
        if (typeof object.callback === "function") {
            for (var j = 0;j < pageListLen;++j) {
                if (!pageList[j].classList.contains('chosen')) {
                    pageList[j].onclick = function () {
                        object.callback(this.innerText,this);
                    }
                }
            }
        }
    }
    u.createNotice = function (text) {
        var container = document.createElement('div');
        container.className = 'notice';
        container.innerText = text;
        return container;
    }
    /**
     * 衣物检查及问题描述样式创建
     * @param obj 项目对象
     */
    u.createItemChecker = function (obj, checkedArr, noContent) {
        var that = this,
            body = document.body,
            headers = obj.headers,
            options = obj.options,
            chosen = core.byId('chosen'),
            chosenArr = [],tempChosen,tempChosenDelete,
            len = headers.length,
            containers = this.createNodes('section',len,'container'),
            headerNodes = this.createNodes('section',len,'bg-container clearfix'),
            rightNodes = this.createNodes('div',len,'right'),
            toggleNodes = this.createNodes('em',len,'shrink'),
            optionContainers = this.createNodes('section',len),
            optionsArr = [],tempOptions,tempLen,j,tempOptionsLen,o,tempIndex;
        for (var i = 0;i < len;++i) {
            containers[i].appendChild(headerNodes[i]);
            headerNodes[i].appendChild(core.e('div','left',headers[i]));
            headerNodes[i].appendChild(rightNodes[i]);
            rightNodes[i].appendChild(toggleNodes[i]);
            containers[i].appendChild(optionContainers[i]);
            if (0 == i) {
                toggleNodes[i].className = 'spread';
            } else {
                optionContainers[i].style.display = 'none';
            }
            toggleNodes[i].onclick = function () {    //展开收缩效果
                var optionBox = this.parentNode.parentNode.parentNode.childNodes[1];
                if (this.className === 'spread') {
                    this.className = 'shrink';optionBox.style.display = 'none';
                } else {
                    this.className = 'spread';optionBox.style.display = 'block';
                }
            }
            tempOptions = options[i];
            tempLen = tempOptions.length;
            for (j = 0;j < tempLen;++j) {
                if (tempOptions[j].title != '') optionContainers[i].appendChild(core.e('div','flex-title',tempOptions[j].title));
                tempOptionsLen = tempOptions[j].list.length;
                for (o = 0;o < tempOptionsLen;++o) {
                    optionsArr[i + j + o] = core.e('div','flex-option checker',tempOptions[j].list[o]);
                    tempIndex = tempOptions[j].list[o].inArray(checkedArr);
                    if (tempIndex !== -1) {
                        checkedArr.splice(tempIndex,1);
                        //<div class="flex-center-item">有羽绒服内胆<em class="delete"></em></div>
                        optionsArr[i + j + o].classList.add('checked');
                        tempChosen = core.e('div','flex-center-item',tempOptions[j].list[o]);
                        tempChosenDelete = core.e('em','delete');
                        tempChosen.appendChild(tempChosenDelete);
                        chosen.appendChild(tempChosen);
                        chosenArr.push({
                            node:optionsArr[i + j + o],
                            chosenNode:tempChosen,
                            text:tempOptions[j].list[o]
                        });
                        tempChosenDelete.onclick = function () {
                            //删除节点处理
                            var parentNode = this.parentNode;
                            var index = parentNode.innerText.inArrayObject(chosenArr,'text');
                            this.parentNode.parentNode.removeChild(this.parentNode);
                            if (index !== -1) chosenArr[index].node.classList.remove('checked');
                            chosenArr.splice(index,1);
                        }
                    }
                    optionContainers[i].appendChild(optionsArr[i + j + o]);
                    optionsArr[i + j + o].onclick = function () {
                        //取消/选中处理
                        var text = this.innerText;
                        var nowNode = this;
                        that.toggleChecked(this,function (status) {
                            if (status === false) {
                                console.log(chosenArr);
                                var index = text.inArrayObject(chosenArr,'text');
                                if (index !== -1) {
                                    var chosenNode = chosenArr[index].chosenNode;
                                    chosenNode.parentNode.removeChild(chosenNode);
                                    chosenArr.splice(index,1);
                                }
                            } else {
                                var chosenNode = core.e('div','flex-center-item',text);
                                var chosenNodeDelete = core.e('em','delete');
                                chosenNode.appendChild(chosenNodeDelete);
                                chosen.appendChild(chosenNode);
                                chosenArr.push({
                                    node:nowNode,
                                    chosenNode:chosenNode,
                                    text:text
                                });
                                chosenNodeDelete.onclick = function () {
                                    //删除节点处理
                                    var parentNode = this.parentNode;
                                    var index = parentNode.innerText.inArrayObject(chosenArr,'text');
                                    this.parentNode.parentNode.removeChild(this.parentNode);
                                    if (index !== -1) chosenArr[index].node.classList.remove('checked');
                                    chosenArr.splice(index,1);
                                }
                            }
                        })
                    }
                }
            }
            body.appendChild(containers[i]);
        }
        //添加内容输入信息
        if (typeof noContent !== "undefined" && noContent) return;
        var contentContainer = core.e('section','container');body.appendChild(contentContainer);
        var contentTitle = core.e('section','bg-container clearfix');
        contentContainer.appendChild(contentTitle);
        contentTitle.appendChild(core.e('div','left','问题填写'));
        var contentRight = core.e('div','right');
        contentTitle.appendChild(contentRight);
        var contentToggle = core.e('em','spread');
        contentRight.appendChild(contentToggle);
        var contentBody = core.e('section');
        contentBody.style.position = 'relative';
        contentContainer.appendChild(contentBody);
        var textarea = core.e('textarea','textarea');
        textarea.setAttribute('maxlength','30');
        textarea.id = 'content';
        textarea.value = checkedArr.toString();
        contentBody.appendChild(textarea);
        var postfix = core.e('em','postfix-string-num','0/30');
        contentBody.appendChild(postfix);
        contentToggle.onclick = function () {
            if (this.className === 'spread') {
                this.className = 'shrink';contentBody.style.display = 'none';
            } else {
                this.className = 'spread';contentBody.style.display = 'block';
            }
        }
        textarea.onkeyup = textarea.onkeydown = function () {
            postfix.innerText = this.value.length + '/30';
        };
        /*<section class="container">
         <section class="bg-container clearfix">
         <div class="left">排污情况</div>
         <div class="right"><em class="spread"></em></div>
         </section>
         <section>
         <div class="flex-title">食品类污渍</div>
         <div class="flex-option checker">红色</div>
         <div class="flex-option checker checked">红色</div>
         </section>
         </section>

         <section class="container">
         <section class="bg-container clearfix">
         <div class="left">问题填写</div>
         <div class="right"><em class="spread"></em></div>
         </section>
         <section style="position: relative">
         <textarea cols="30" rows="10" class="textarea" maxlength="30"></textarea>
         <em class="postfix-string-num">0/30</em>
         </section>
         </section>*/
    }
    window.UI = u;
})(window);
