chrome.app.runtime.onLaunched.addListener(function() {    //packaged app 初始化加载界面
    chrome.storage.local.get(["role","token","clerk"],function(result){
        var validator = typeof result.role === "string" && result.role.length > 0;
        var validator2 = typeof result.token === "string" && result.token.length > 0;
        var validator3 = typeof result.clerk === "string" && result.clerk.length > 0;
        //验证是否已处于登录状态
        if (validator && validator2 && validator3) {    //已登陆状态时显示主页
            var main  = chrome.app.window.get("main");
            if (main) return main.show();
            chrome.app.window.create("../views/main.html", {id: "main",state: "fullscreen"});
        } else {    //未登录时显示登录页面
            var login = chrome.app.window.get("login");
            if (login) return login.show();
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

//窗口关闭时操作
chrome.app.window.onClosed.addListener(function(){});