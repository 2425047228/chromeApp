"use strict"
 window.onload = function () {
     //判断是否来自登录界面跳转
     if (-1 !== location.search.substr(1).indexOf("from=login")) {core.close("login");}
     core.byId("logout").onclick = function () {
         //退出处理ßß
     }
     core.iframeRedirectListener();    //监听跳转
 }
