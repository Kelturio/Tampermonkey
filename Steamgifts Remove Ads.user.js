// ==UserScript==
// @name         Steamgifts Remove Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @include      /https?://www.steamgifts.com//
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js
// @require      https://raw.githubusercontent.com/Kelturio/Tampermonkey/master/akk.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function removeAds(){
        $('body > iframe[name=google_osd_static_frame]').remove();
        $('body > div.page__outer-wrap > div > div > div.sidebar.sidebar--wide > div.sidebar__mpu').remove();
        let iframe = $('body > div.page__outer-wrap > div > div > div > div > div > div > iframe')[0];
        iframe && iframe.parentElement.parentElement.parentElement.remove();
        $('a[href="https://www.patreon.com/steamgifts"]')[0].parentElement.remove();
    }
    let i = 0, interval = setInterval(() => {
        (++i > 8) && (clearInterval(interval) || console.debug('removeAds clearInterval', interval));
        $('iframe').length && (removeAds() || console.error('IFRAME', $('iframe')));
    }, 420);
})();