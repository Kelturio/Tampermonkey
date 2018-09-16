// ==UserScript==
// @name         Steambitcoins GetCoins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @match        http://steambitcoins.com/GetCoins
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        $.ajax({type: 'POST',url: 'http://steambitcoins.com/GetCoins', data: {getCoins: ''}});
        setTimeout(function(){
            //document.location.reload();
        }, 5e3);
    }, Math.floor((Math.random() * 60 * 1) + 60 * 10) * 1e3);
})();