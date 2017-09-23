'use strict';
window.onload = function () {
    UI.generateCrumbs([['收衣','./receive.html'],['散客信息', '#']]);
    var mobile = core.paramToObject().mobile;
    core.byId('mobile').innerText = mobile;
};
