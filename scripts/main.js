"use strict"
 window.onload = function () {
     //判断是否来自登录界面跳转
     if (-1 !== location.search.substr(1).indexOf("from=login")) {core.close("login");}
 }
