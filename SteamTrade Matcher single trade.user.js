// ==UserScript==
// @name         SteamTrade Matcher single trade
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
    function getMatches() {
        top.matches = _.zip(jQuery('#match-results > div > div.panel-body > a').toArray(),
                            jQuery('#match-results > div > div.panel-heading.match-box > h1 > span.stm-user').toArray())
            .map(e => _.zipObject(['href', 'isBot'], [e[0].href.split('/'), e[1].textContent.includes('Trade bot')]))
            .map(e => _.zipObject(['sid', 'tradeToken', 'trade', 'isBot'], [e.href[5], e.href[6], _.zip(e.href[7].split(';'), e.href[8].split(';')).map(ee => _.zipObject(['them', 'you'], [ee[0], ee[1]])), e.isBot]))
        console.log(top.matches)
        top.matchesObj = {};
        top.matches.map(e => {
            e.trade.map(ee => {
                top.matchesObj[ee.them] = [...top.matchesObj[ee.them] || [], e];
            })
        });
        console.debug(top.matchesObj)
        top.matchesQuene = _.map(top.matchesObj, (val, key) => [key, _.sortBy(val, 'isBot').reverse()])
            .sort((a, b) => a[1].length - b[1].length)
            .map(e => {
            return e[1].map(ee => {
                ee.tradeSel = _.find(ee.trade, {them: e[0]});
                ee.tradeHref = `${location.origin}/action/startTradeOffer/${ee.sid}/${ee.tradeToken}/${ee.tradeSel.them}/${ee.tradeSel.you}`;
                return ee;
            });
        })
    }
    function fetchNextMatch() {
        top.matchesQuene.shift().map(ee => {
            console.log(ee.tradeHref);
            window.open(ee.tradeHref);
        });
    }
    top.getMatches = getMatches;
    top.fetchNextMatch = fetchNextMatch;
})();