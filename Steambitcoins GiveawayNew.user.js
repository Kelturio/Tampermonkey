// ==UserScript==
// @name         Steambitcoins GiveawayNew
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://steambitcoins.com/GiveawayNew
// @match        http://steambitcoins.com/GiveawayKey
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var steamGroupNameSel = null,
        entryPriceSel = null,
        giveawayDurationSel = null,
        randomInt = Math.floor((Math.random() * 5) + 1);
    
    if (document.location.href === 'http://steambitcoins.com/GiveawayNew') {
        steamGroupNameSel = '#contact_form > fieldset > div:nth-child(10) > div > div > input';
        entryPriceSel = '#contact_form > fieldset > div:nth-child(11) > div > div > input';
        giveawayDurationSel = '#contact_form > fieldset > div:nth-child(12) > div > div > select';
    }
    if (document.location.href === 'http://steambitcoins.com/GiveawayKey') {
        steamGroupNameSel = '#contact_form > fieldset > div:nth-child(7) > div > div > input';
        entryPriceSel = '#contact_form > fieldset > div:nth-child(8) > div > div > input';
        giveawayDurationSel = '#contact_form > fieldset > div:nth-child(9) > div > div > select';
    }
    $(steamGroupNameSel)[0].value = 'metastruct';
    $(entryPriceSel)[0].value = '' + randomInt;
    //$(giveawayDurationSel)[0].value = '1 day';
})();