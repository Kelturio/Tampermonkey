// ==UserScript==
// @name         Steam Auto Remove Market Listing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://steamcommunity.com/market/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    top.hrefs = Array.from(document.querySelectorAll('div.market_listing_item_name_block a'));
    if (hrefs.length === 0) {
        //location.reload();
    }
    top.akk = function() {
        let el = hrefs.shift();
        if (!el) {
            console.log('reload');
            setTimeout(() => {
                location.reload();
            }, 60e3);
            return;
        }
        let href = el.href;
        console.log('akk', hrefs.length + ' ' + href);
        window.open(href);
    };
    top.akkstart = (ms) => {
        top.akkint = setInterval(() => {akk()}, ms);
    };
    setTimeout(() => {
        top.akkstart(3e3);
        }, 10e3);
})();