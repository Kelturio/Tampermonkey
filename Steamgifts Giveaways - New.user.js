// ==UserScript==
// @name         Steamgifts Giveaways - New
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       Searinox
// @match        https://www.steamgifts.com/giveaways/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let startTime = 'Sep 25, 2018 4:20 am';
    let endTime = 'Sep 30, 2018 4:20 pm';
    let contributorLevel = '10';
    let descriptionTxt = [
        'Akk!',
        'Steam Group: [Searinox Army](https://steamcommunity.com/groups/searinoxarmy#members)'
    ];
    let descriptionImg = [
        'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/21/21c3f7cece613ea20a41ac1582b92033f8abb267_full.jpg',
        'https://i.imgur.com/RogoP2g.gif',
        'https://media1.tenor.com/images/b35a2dd687b91f7c10e64a049948822e/tenor.gif'
    ].map(e => `![Searinox Army](${e})`);
    let description = [...descriptionTxt, ...descriptionImg].join('\n');
    $('form input[name=type]')[0].value = 'key';
    $('form div[data-checkbox-value=key]').addClass('is-selected');
    $('form div.form__row--giveaway-keys.is-hidden').removeClass('is-hidden');
    $('form input[name=start_time]')[0].value = startTime;
    $('form input[name=end_time]')[0].value = endTime;
    $('form input[name=region_restricted]')[0].value = '0';
    $('form div[data-checkbox-value=0]').addClass('is-selected');
    $('form input[name=who_can_enter]')[0].value = 'everyone';
    $('form div[data-checkbox-value=everyone]').addClass('is-selected');
    $('form input[name=contributor_level]')[0].value = contributorLevel;
    $('form div.ui-slider-range.ui-slider-range-min').css('width', `${contributorLevel * 10}%`);
    $('form span.ui-slider-handle.ui-state-default').css('left', `${contributorLevel * 10}%`);
    $('form textarea[name=description]')[0].value = description;
})();