chrome.app.runtime.onLaunched.addListener(function() {    //packaged app 初始化加载界面
    //var allWindow = chrome.app.window.getAll();
    //console.log(allWindow);
    //if (0 === allWindow.length) {
        chrome.app.window.create('../views/main.html', {
            id: 'main',
            bounds: {
                width: 800,
                height: 600
            },
            minWidth: 400,
            minHeight: 400
        });
    //}
});
chrome.app.window.onClosed.addListener(function(){
    //do something when the window is closed.

}); 