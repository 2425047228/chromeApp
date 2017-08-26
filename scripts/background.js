chrome.app.runtime.onLaunched.addListener(function() {    //packaged app 初始化加载界面
    chrome.app.window.create("../views/login.html", {
        id: "login",
        bounds: {
            width: 491,
            height: 351
        },
        frame:"none",
        resizable:false
    });
});
chrome.app.window.onClosed.addListener(function(){
    //do something when the window is closed.

}); 