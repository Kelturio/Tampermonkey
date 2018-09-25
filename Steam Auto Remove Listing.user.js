// ==UserScript==
// @name         Steam Auto Remove Listing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://steamcommunity.com/market/listings/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let a = document.querySelectorAll('div.market_listing_edit_buttons.actual_content > div > a')[0];
    if (a) {
        eval(a.href);
    } else {
        window.close();
    }
})();
