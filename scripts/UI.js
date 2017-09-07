/**
 * ui组件封装函数库,使用前需引入core.js
 * @author yangyunlong
 */
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
     * 创建弹出复选框组件
     * @param obj 参数对象 属性:title=标题,button=确认按钮内容,options=内容数组,callback=回调函数默认参数选中数组
     */
    u.createAlertCheckbox = function (obj) {
        var len = obj.options.length;
        if (len < 1) return false;
        //创建背景节点
        var alertBg = document.createElement('div');
        alertBg.className = 'alert-bg';
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
                this.classList.toggle('checked');
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
        var position = core.getCenterPosition(checkbox.offsetWidth,checkbox.offsetHeight,alertBg);
        checkbox.style.position = 'absolute';
        checkbox.style.top = position.top + 'px';
        checkbox.style.left = position.left + 'px';
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
    window.UI = u;
})(window);
