chrome.app.runtime.onLaunched.addListener(function() {    //packaged app 初始化加载界面
    chrome.storage.local.get(["role","token","clerk"],function(result){
        var validator = typeof result.role === "string" && result.role.length > 1;
        var validator2 = typeof result.token === "string" && result.token.length > 1;
        var validator3 = typeof result.clerk === "string" && result.clerk.length > 1;
        //验证是否已处于登录状态
        if (validator && validator2 && validator3) {
            chrome.app.window.create("../views/main.html", {id: "main",state: "fullscreen"});
        } else {
            chrome.app.window.create("../views/login.html", {
                id: "login",
                bounds: {
                    width: 491,
                    height: 351
                },
                frame:"none",
                resizable:false
            });
        }
    });
});
chrome.app.window.onClosed.addListener(function(){}); 