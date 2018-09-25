// ==UserScript==
// @name         SteamTrade Matcher Remove Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://www.steamtradematcher.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function removeAds(){
        $('body > iframe[name=google_osd_static_frame]').remove();
        $('#ad-display').remove();
    }
    let i = 0, interval = setInterval(() => {
        (++i > 8) && (clearInterval(interval) || console.debug('removeAds clearInterval', interval));
        $('iframe').length && (removeAds() || console.error('IFRAME', $('iframe')));
    }, 420);
})();