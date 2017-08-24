"use strict"
window.onload = function() {
}
core.byId("exit").onclick = function () {
    core.byId('l').innerText = 'dfdfdfdf';
}
core.byId("change").onclick = function() {
    var iframe = core.byId("iframe");
    console.log(iframe.src);
    console.log(typeof iframe.src.indexOf("/views/admin.html"));
    console.log(iframe.src.indexOf("/views/admin.html") == -1);
    if (iframe.src.indexOf("/views/admin.html") === -1) {
        iframe.src = './admin.html';
    } else {iframe.src = './index.html';}
}
//core.byId('close').onclick = function () {
    //console.log(chrome.app.window.current().id);
    //chrome.app.window.current().close();
    //location.href = "./new.html";
//}