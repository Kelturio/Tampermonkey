// ==UserScript==
// @name         Steam Community Market
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://steamcommunity.com/market/listings*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    var inputPrice = null,
        iv = null,
        iv2 = null,
        isTradingCard = null,
        gameNameSelector = '#market_buy_commodity_popup > div.market_buy_commodity_item_display.ellipsis > div.market_listing_item_name_block > span.market_listing_game_name',
        inputPriceSelector = '#market_buy_commodity_input_price',
        commodityStatus = null,
        dialogErrorText = null,
        searchResultsTable = null;
    setTimeout(function(){
        document.querySelector('#market_commodity_order_spread > div:nth-child(2) > div > div.market_commodity_orders_header > a > span').click();
    }, 420);
    iv = setInterval(function(){
        inputPrice = document.querySelector(inputPriceSelector);
        console.debug('akk ' + inputPrice.value);
        if (inputPrice && inputPrice.value && inputPrice.value !== '0,--€'){
            isTradingCard = document.querySelector(gameNameSelector).innerText.endsWith('Trading Card');
            if (inputPrice.value === '0,04€') {
                inputPrice.value = '0,03€';
            } else {
                inputPrice.value = (isTradingCard) ? '0,04€' : '0,08€';
            }
            clearInterval(iv);
            setTimeout(function(){
                inputPrice = document.querySelector(inputPriceSelector);
                if(inputPrice.value == '0,03€' ||
                  inputPrice.value == '0,04€'  ||
                  inputPrice.value == '0,08€' ){
                    document.querySelector('#market_buyorder_dialog_purchase > span').click();
                }
            }, 420);
        }
    }, 99);
    iv2 = setInterval(function() {
        commodityStatus = document.querySelector('#market_buy_commodity_status');
        if (commodityStatus.innerText.startsWith('Success! Your buy order has been placed.') ||
            commodityStatus.innerText.startsWith('Purchase succeeded!')) {
            window.close();
        }
        dialogErrorText = document.querySelector('#market_buyorder_dialog_error_text');
        if (dialogErrorText && dialogErrorText.innerText) {
            if (dialogErrorText.innerText === 'You cannot buy any items until your previous action completes.' ||
                dialogErrorText.innerText.startsWith("The game's servers are currently too busy") ||
                dialogErrorText.innerText.startsWith("There was a problem purchasing your item") ||
                dialogErrorText.innerText.startsWith("We were unable to contact the game's item server")) {
                clearInterval(iv2);
                setTimeout(function(){
                    document.location.reload();
                }, 420 * 1);
            }
            if (dialogErrorText.innerText.startsWith('You already have an active buy order for this item.')) {
                window.close();
            }
        }
        searchResultsTable = document.querySelector('#searchResultsTable');
        if (searchResultsTable && searchResultsTable.innerText && searchResultsTable.innerText.startsWith('There are no listings for this item.')) {
             window.close();
        }
    }, 420);
})();
