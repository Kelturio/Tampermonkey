// ==UserScript==
// @name         Steamgifts Remove Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Searinox
// @include      /https?://www.steamgifts.com//
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function removeAds(){
        $('body > iframe[name=google_osd_static_frame]').remove();
        $('body > div.page__outer-wrap > div > div > div.sidebar.sidebar--wide > div.sidebar__mpu').remove();
        let iframe = $('body > div.page__outer-wrap > div > div > div > div > div > div > iframe')[0];
        iframe && iframe.parentElement.parentElement.parentElement.remove();
    }
    let i = 0, interval = setInterval(() => {
        (++i > 8) && (clearInterval(interval) || console.debug('removeAds clearInterval', interval));
        $('iframe').length && (removeAds() || [...$('iframe')].map((e) => console.error('IFRAME', e) || e));
    }, 420);
})();