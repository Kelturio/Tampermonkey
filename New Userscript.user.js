// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /https?://www.steamgifts.com//
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.debug('AKK!');

    const LEVEL = Number($('.nav__button--is-dropdown').last().children('span').last().text().split(' ')[1]);

    function getClearFilterLink() {
        return '<a class="clear-filter" href="/giveaways">Clear</a>';
    }
    function getLevelSidebarHeading() {
        //return `<h3 class="level-filter sidebar__heading">Akk Filters${getClearFilterLink()}</h3>`;
        return `<h3 class="akk-filter sidebar__heading">Akk Filters</h3>`;
    }
    function getLevelFilters(level) {
        let list = '<ul class="level-filter sidebar__navigation">', text, query;
        for (let i = 6; i > -1; i--) {
            text = query = level = i;
            //if (i > 0) text += ' and above';
            list += '<li class="sidebar__navigation__item">' +
                `<a class="sidebar__navigation__item__link" data-url="level_min=${query}&level_max=${level}"` +
                `href="/giveaways/search?level_min=${query}&level_max=${level}">` +
                `<div class="sidebar__navigation__item__name">Level ${text}</div>` +
                '<div class="sidebar__navigation__item__underline"></div>' +
                '</a>' +
                '</li>';
        }
        list += '</ul>';
        return list;
    }

    var akk = {};

    $('.sidebar__navigation').first().after(getLevelSidebarHeading());
    $('h3.akk-filter').after(getLevelFilters(LEVEL));
})();

$(document).ready(function() {
    console.debug('$(document).ready');
});