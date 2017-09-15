"use strict"
 window.onload = function () {
     //判断是否来自登录界面跳转
     if (-1 !== location.search.substr(1).indexOf("from=login")) {core.close("login");}
     //发送数据请求
     core.storage.get("token",function (result) {
         core.post(api.getUrl("index"),{token:result.token},function (response) {
             var dataObj = core.jsonParse(response);
             if (!core.apiVerify(dataObj)) return false;
             var data = dataObj.data;
             //判断待处理订单数量非0则展示
             if (0 != data.will_dispose) {
                 var em = document.createElement('em');
                 em.innerText = data.will_dispose;
                 core.byClass('redirect')[1].appendChild(em);
             }
             core.byId("merchant").innerText = data.mname;    //填充商家名称
             core.getImage(api.getHost()+data.circle_logo,core.byId("avatar"));    //填充商家头像
             statusSwitchover(1==data.state);    //根据店铺状态切换样式
             //将营业额及订单总数传递给index页面
             core.iframe().src = "./index/index.html?amount="+data.total+"&order="+data.order_count;
             //切换店铺状态操作
             core.byId("switch").onclick = function () {
                 var state = 1;
                 if (this.src.indexOf("open") !== -1) {
                     state = 3;
                     statusSwitchover(false);
                 } else  {
                     statusSwitchover(true);
                 }
                 core.post(api.getUrl("statusSwitchover"),{token:result.token,state:state});
             }
         });
     });
     //隐藏或显示导航栏操作
     var optionTitles = core.byTagName("dt");
     core.nodesExec(optionTitles,function (node,i) {
         var option = core.byTagName("dd")[i];
         option.setAttribute("style","display:none;");
         node.onclick = function () {
             var tagNode = core.findByClassForFirstChild(this,"right");
             var display = option.style.display;
             if (
                 typeof display !== "undefined"
                 &&
                 display.indexOf("none") !== -1
                 &&
                 tagNode !== false
                 &&
                 tagNode.className.indexOf("shrink") !== -1
             )
             {
                 core.show(option);
                 tagNode.className = "right spread";
             } else {
                 core.hide(option);
                 tagNode.className = "right shrink";
             }
         }
     });



     core.byId("logout").onclick = function () {
         //退出处理
     }
     //监听跳转
     core.iframeRedirectListener(function (node,nodeList) {
         if (!node.classList.contains("chosen-nav")) {
             core.nodesExec(nodeList,function (value) {
                 if (value.classList.contains("chosen-nav")) value.classList.remove("chosen-nav");
             });
             node.classList.add("chosen-nav");
         }
     });

     //商家状态切换
     function statusSwitchover(state) {
         core.byId("switch").src = state ? "../images/open.png" : "../images/closed.png";
         core.byId("state").innerText = state ? "正在营业" : "暂停营业";
     }
 }
