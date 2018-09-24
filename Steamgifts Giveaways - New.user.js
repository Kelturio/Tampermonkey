// ==UserScript==
// @name         Steamgifts Giveaways - New
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @match        https://www.steamgifts.com/giveaways/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('form input[name=type]')[0].value = 'key';
    $('form div[data-checkbox-value=key]').addClass('is-selected')
    $('form div.form__row--giveaway-keys.is-hidden').removeClass('is-hidden');
    $('form input[name=start_time]')[0].value = 'Sep 25, 2018 4:20 am';
    $('form input[name=end_time]')[0].value = 'Sep 30, 2018 4:20 pm';
    $('form input[name=region_restricted]')[0].value = '0';
    $('form div[data-checkbox-value=0][data-trigger-list=0]').addClass('is-selected');
    $('form input[name=who_can_enter]')[0].value = 'everyone';
    $('form textarea[name=description]')[0].value = [
        'Akk!',
        'Steam Group: [Searinox Army](https://steamcommunity.com/groups/searinoxarmy#members)',
        '![SearinoxArmy](https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/21/21c3f7cece613ea20a41ac1582b92033f8abb267_full.jpg)',
        '![SearinoxArmy](https://i.imgur.com/RogoP2g.gif)',
        '![SearinoxArmy](https://media1.tenor.com/images/b35a2dd687b91f7c10e64a049948822e/tenor.gif)'
    ].join('\n');
})();