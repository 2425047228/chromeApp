"use strict"
 window.onload = function () {
     console.log(location);
     core.byId('clock').innerText = ' is' + new Date();
 }
