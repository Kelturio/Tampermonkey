// ==UserScript==
// @name         Steam Card Exchange
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @match        http://www.steamcardexchange.net/index.php?gamepage-appid-*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    top.sifte = [];
    top.akk = [].concat([].slice.call(document.querySelectorAll('#content-area > div > div:nth-child(19) > div.showcase-element-container.booster > div:nth-child(1) > div > a')),
    [].slice.call(document.querySelectorAll('#content-area > div > div:nth-child(17) > div.showcase-element-container.card > div > div > a')));
    setInterval(function(){
        var el = akk.shift();
        if (el) {
            console.debug(el.href);
            sifte.push(window.open(el.href));
        } else {
            //document.location.replace('about:blank');
        }
    }, 42);
    //document.querySelector('#ddlink_chosen > div').style.left = 0;
})();