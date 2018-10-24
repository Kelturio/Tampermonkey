// ==UserScript==
// @name         SteamTrade Matcher disable compareInventories
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://www.steamtradematcher.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    main();
    function main(){
        console.log('top.compareInventories', top.compareInventories);
        _.set(top, 'compareInventoriesOld', top.compareInventories);
        _.set(top, 'compareInventories', (steamid, source) => console.log('compareInventories', [steamid, source, this]));
    }
})();