chrome.app.runtime.onLaunched.addListener(function() {    //packaged app 初始化加载界面
    chrome.app.window.create('../views/main.html', {
        id: 'MyWindowID',
        bounds: {
            width: 800,
            height: 600
        },
        minWidth: 400,
        minHeight: 400
    });
});