// ==UserScript==
// @name         Steambitcoins Giveaway
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://steambitcoins.com/Giveaway*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(e) {
        e = e || window.event;
        switch(e.which || e.keyCode) {
            case 37: // left
                break;

            case 38: // up
                localStorage.akkGiveawayID = +localStorage.akkGiveawayID + 1;
                console.debug('akkGiveawayID = ' + localStorage.akkGiveawayID);
                document.location.replace('http://steambitcoins.com/Giveaway/' + localStorage.akkGiveawayID);
                break;

            case 39: // right
                break;

            case 40: // down
                localStorage.akkGiveawayID = +localStorage.akkGiveawayID - 1;
                console.debug('akkGiveawayID = ' + localStorage.akkGiveawayID);
                document.location.replace('http://steambitcoins.com/Giveaway/' + localStorage.akkGiveawayID);
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    };
    $('body > div.container-fluid > div > div.col-md-6 > div > div > div.col-lg-9.col-md-9.col-sm-9.col-xs-12 > div > div > h4 > a')[0].style.color = 'limegreen';
})();