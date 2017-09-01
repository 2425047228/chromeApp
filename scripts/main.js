"use strict"
 window.onload = function () {
     //判断是否来自登录界面跳转
     if (-1 !== location.search.substr(1).indexOf("from=login")) {core.close("login");}
     //隐藏或显示导航栏操作
     var optionTitles = core.byTagName("dt");
     core.nodesExec(optionTitles,function (node,i) {
         var option = core.byTagName("dd")[i];
         option.setAttribute("style","display:none;");
         node.onclick = function () {
             core.storage.get("token",function (result) {
                 console.log(result);
                 core.post(api.getUrl("index"),{token:"94e3fZjAH25X2p4qCeHsuR1lTgrL3I9ztJ7Q0FGmm2jW+DALw9CiWu0"},function (response) {
                     //"94e3fZjAH25X2p4qCeHsuR1lTgrL3I9ztJ7Q0FGmm2jW DALw9CiWu0"
                     var data = core.jsonParse(response);
                     console.log(data);
                 });
             });
             var tagNode = core.findBycClass(node,"right");
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
 }
