// ==UserScript==
// @name         DailyIndieGame
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://www.dailyindiegame.com/*
// @grant        none
// ==/UserScript==

top.akk = (function($) {
    'use strict';
    let akk = {};
    akk.url = {
        loadjs: 'https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js',
        userdata: 'https://store.steampowered.com/dynamicstore/userdata/',
        app: 'http://store.steampowered.com/app/',
        registerKey: 'https://store.steampowered.com/account/registerkey?key='
    };
    akk.sel = {
        hideGamesOwned: [
            '#TableKeys > tbody > tr > td:nth-child(4) > a',
            '#TableKeys > tbody > tr > td:nth-child(2) > a'
        ],
        allPages: '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a',
        firstPage: '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a:nth-child(6)',
        firstPageParent: '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td',
        activePage: '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a > span.DIG2-TitleOrange2',
        rowsTableKeys: '#TableKeys > tbody > tr',
        tableKeysRow: '#TableKeys > tbody > tr'
    };
    akk.checkUserData = () => {
        console.log('checkUserData');
        return new Promise(function(resolve, reject) {
            if (akk.userdata_date) {
                if ((Date.now() - akk.userdata_date) > 120e3) {
                    resolve();
                } else {
                    reject();
                }
            } else {
                resolve();
            }
        });
    };
    akk.updateUserData = () => {
        console.log('updateUserData');
        return new Promise(function(resolve, reject) {
            $.getJSON(`${akk.url.userdata}?_=${Date.now()}`, (data) => {
                if (!_.isEmpty(data.rgOwnedApps)) {
                    _.set(akk, 'userdata', data);
                } else {
                    reject();
                    console.warn('userdata.rgOwnedApps is empty');
                }
                _.set(akk, 'userdata_date', Date.now());
                resolve();
            });
        });
    };
    akk.callCb = (cb) => {
        console.log('callCb');
        if (_.isFunction(cb)) {
            return cb.call(akk);
        }
    };
    akk.localStorageKeys = [{key: 'userdata', default: {rgOwnedApps: []}},
                            {key: 'userdata_date', default: null},
                            {key: 'blacklist', default: []},
                            {key: 'gameData', default: {}}];
    akk.blacklist = [];
    akk.gameData = {};
    akk.loadLocalStorage = () => {
        console.log('loadLocalStorage');
        return new Promise(function(resolve, reject) {
            akk.localStorageKeys.map((e, i) => {
                top.localforage.getItem(e.key).then(function(value) {
                    if (!value){
                        console.warn('loadLocalStorage', e.key);
                    }
                    if (_.isNull(_.set(akk, e.key, value)[e.key])) {
                        _.set(akk, e.key, e.default);
                    }
                    if (i === akk.localStorageKeys.length - 1) {
                        resolve();
                    }
                }).catch(console.error);
            });
        });
        /*return akk.localStorageKeys.map((key) => {
            akk[e.key] = JSON.parse(localStorage.getItem(e.key));
        });*/
    };
    akk.saveLocalStorage = () => {
        console.log('saveLocalStorage');
        return new Promise(function(resolve, reject) {
            akk.localStorageKeys.map((e, i) => {
                if (akk[e.key]) {
                    top.localforage.setItem(e.key, akk[e.key]).then(console.log).catch(console.error);
                } else {
                    console.error('saveLocalStorage'.concat(' ', e.key));
                }
                if (i === akk.localStorageKeys.length - 1) {
                    resolve();
                }
            });
        });
        //return akk.localStorageKeys.map((e.key) => localStorage.setItem(e.key, JSON.stringify(akk[e.key])));
    };
    akk.addBlacklist = (appid) => {
        console.log('addBlacklist', appid);
        akk.blacklist = akk.blacklist.add(appid);
        return akk.saveLocalStorage();
    };
    akk.removeBlacklist = (appid) => {
        return akk.saveLocalStorage(akk.blacklist.remove(appid));
    };
    akk.getOwnedApps = () => {
        return akk.userdata.rgOwnedApps.concat(akk.blacklist);
    };
    akk.getAppidFromUrl = (url) => {
        return (Object.isString(url)) ? +url.split('steampowered').last().split('/')[2] : '';
    };
    akk.hideGamesOwned = () => {
        console.log('hideGamesOwned');
        akk.sel.hideGamesOwned.map((sel) => $(sel).toArray()).flatten()
            .map((e) => {
            return {
                el: e,
                id: akk.getAppidFromUrl(e.href)
            };
        })
            .filter((e) => akk.getOwnedApps().includes(e.id))
            .map((e) => {
            e.el.parentElement.parentElement.style.display = 'none';
        });
    };
    akk.getPages = () => {
        console.log('getPages');
        return $(akk.sel.allPages);
    };
    akk.appendClone = (target, destination) => {
        console.log('appendClone');
        return destination.append(target.clone())[0].lastChild;
    };
    akk.appendCloneSel = (target, destination) => {
        console.log('appendCloneSel');
        return $(destination).append($(target).clone())[0].lastChild;
    };
    akk.newPagesProps = [
        {
            text: '|<<<',
            href: () => akk.oldPages.first().href
        },
        {
            text: '<<<',
            href: () => (akk.activePage.previousElementSibling && akk.activePage.previousElementSibling.nodeName !== 'BR' &&
                         Number.isFinite(+akk.activePage.previousElementSibling.innerText)) ?
            akk.activePage.previousElementSibling : akk.oldPages.first().href
        },
        {
            text: '>>>',
            href: () => (akk.activePage.nextElementSibling && Number.isFinite(+akk.activePage.nextElementSibling.innerText)) ?
            akk.activePage.nextElementSibling.href : akk.oldPages.last().href
        },
        {
            text: '>>>|',
            href: () => akk.oldPages.last().href
        }
    ];
    akk.modPages = () => {
        console.log('modPages');
        _.set(akk, 'activePage', $(akk.sel.activePage)[0]);
        let pages = akk.getPages();
        if (!pages.length || !akk.activePage) return;
        _.set(akk, 'activePage', akk.activePage.parentElement);
        _.set(akk, 'oldPages', pages.toArray());
        _.set(akk, 'newPages', akk.newPagesProps.map((e) => {
            let clone = akk.appendCloneSel(akk.sel.firstPage, akk.sel.firstPageParent);
            clone.firstElementChild.innerText = e.text;
            clone.href = e.href();
            clone.firstElementChild.className = "DIG2contentSite";
            return clone;
        }));
        pages.appendTo($(akk.sel.firstPageParent));
    };
    akk.modTableKeysAccount = () => {
        console.log('modTableKeysAccount');
        if (!location.pathname.includes('account_page')) return;
        _.set(akk, 'tableKeys', $(akk.sel.rowsTableKeys).toArray().from(1).map((tr) => {
            let key = tr.children[4].innerText;
            let td = $('<td/>').attr('valign', 'top').appendTo(tr);
            let a = $('<a/>').attr('href', akk.url.registerKey.concat(key)).appendTo(td);
            let span = $('<span/>').addClass('DIG3_14_White').text('Activate Key').appendTo(a);
            let href = akk.addGameUrl(tr.children[2]);
            akk.addButtonBlacklist(tr, href);
            return {
                tr,
                key
            };
        }));
    };
    akk.updateGameDataMd5Blacklist = ['d58ba90acecfed7e6900bff6029f644b'];
    akk.updateGameData = () => {
        console.log('updateGameData');
        let rows = $(akk.sel.tableKeysRow).toArray();
        if (rows.length < 2 ||
            (!location.pathname.includes('digstore') && !location.pathname.includes('store_updateshowdlc') &&
             !location.pathname.includes('tradesXT') && !location.pathname.includes('storeXT'))) {
            return [];
        }
        rows = rows.map((row) => {
            let cols = _.toArray(row.children);
            if (location.pathname.includes('digstore') || location.pathname.includes('store_updateshowdlc')) {
                cols = {
                    no: parseInt(cols[0].textContent),
                    new: cols[1].innerHTML.compact().includes('New'),
                    steamPrice: parseFloat(cols[2].textContent.replace('$', '')),
                    gameTitle: cols[3].textContent,
                    //gameUrl: cols[3].children[0] && cols[3].children[0].href,
                    gameId: cols[3].children[0] && akk.getAppidFromUrl(cols[3].children[0].href),
                    type: cols[4].textContent,
                    macOs: cols[5].innerHTML.includes('img'),
                    linux: cols[6].innerHTML.includes('img'),
                    vr: cols[7].innerHTML.includes('img'),
                    achievements: cols[8].innerHTML.includes('img'),
                    card: cols[9].textContent.includes('YES'),
                    //pricePoints: parseInt(cols[10].textContent.replace('DIG Points', '').compact()),
                    priceUSD: parseFloat(cols[11].textContent.replace('$', '')),
                    //buy: cols[12].children[0] && cols[12].children[0].href.replace(location.origin, ''),
                    buyId: cols[12].children[0] && +cols[12].children[0].href.replace(/\D+/g, ''),
                    buyTrade: cols[12].children[0] && cols[12].children[0].href.includes('buytrade'),
                    ts: Date.now()
                };
            } else if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT')) {
                cols = {
                    no: parseInt(cols[0].textContent),
                    gameTitle: cols[1].textContent,
                    //gameUrl: cols[1].children[0] && cols[1].children[0].href,
                    gameId: cols[1].children[0] && akk.getAppidFromUrl(cols[1].children[0].href),
                    regionLock: cols[2].textContent.compact(),
                    comment: cols[3].textContent,
                    card: cols[4].textContent.includes('YES'),
                    sellerRating: parseInt(cols[5].textContent.compact().replace('%', '')),
                    //viewOffers: cols[5].children[0] && cols[5].children[0].href.replace(location.origin, ''),
                    publisher: cols[6].textContent,
                    //pricePoints: parseInt(cols[7].textContent.replace('DIG Points', '').compact()),
                    //pricePoints: +(parseFloat(cols[7].textContent.replace('$', '')) * 100),
                    priceUSD: parseFloat(cols[7].textContent.replace('$', '')),
                    //buy: cols[8].children[0] && cols[8].children[0].href.replace(location.origin, ''),
                    buyId: +cols[8].children[0] && cols[8].children[0].href.replace(/\D+/g, ''),
                    buyTrade: cols[8].children[0] && cols[8].children[0].href.includes('buytrade'),
                    ts: Date.now()
                };
            } else console.error('updateGameData.rows.cols')
            cols = akk.addChecksumObj(cols);
            return cols;
        });
        let rowsObj = {};
        let bl = akk.updateGameDataMd5Blacklist;
        rows.from(1).filter((row) => !(!row.gameUrl && bl.includes(row.md5))).map((row) => {
            _.set(rowsObj, row.md5, row);
        });
        _.set(akk, 'gameDataNew', rowsObj);
        console.log(_.size(akk.gameData), 'before merge');
        Object.merge(akk.gameData, akk.gameDataNew);
        console.log(_.size(akk.gameData), 'after merge');
        akk.saveLocalStorage();
        return rows;
    };
    akk.addChecksumObj = (obj) => {
        return _.set(obj, 'md5', top.md5(JSON.stringify(Object.reject(obj, ['no', 'ts', 'md5']))));
    };
    akk.modDPSform = (url) => {
        console.log('modDPSform');
        if (!location.pathname.includes('account_buy')) return;
        if ($('#DPSform')[0] && $('#DPSform')[0].onsubmit) $('#DPSform')[0].onsubmit = () => true;
    };
    akk.removeAds = () => {
        console.log('removeAds');
        $('.adsbygoogle')[0].parentElement.remove();
        $('body > iframe').remove();
    };
    akk.addGameUrl = (td) => {
        let href = Object.values(akk.gameData).filter((e) => {
            return e.gameTitle && e.gameTitle.includes(td.textContent.compact());
        });
        if (!href.length) return;
        href = akk.url.app.concat(href.first().gameId);
        let a = $('<a/>').attr('href', href).appendTo(td);
        let span = $('<span/>').text(td.textContent).appendTo(a);
        td.firstChild.remove();
        return href;
    };
    akk.addButtonBlacklist = (tr, href) => {
        let appid = akk.getAppidFromUrl(href);
        let td = $('<td/>').attr('valign', 'top').appendTo(tr);
        let span = $('<span/>', {
            on: {
                click: () => {
                    console.log('click' + appid);
                    akk.addBlacklist(appid);
                }
            }
        }).text(appid).appendTo(td);
    };
    akk.modTableKeysXT = () => {
        console.log('modTableKeysXT');
        if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT')) {
            akk.tableKeys = $(akk.sel.rowsTableKeys).toArray().from(2).map((tr) => {
                let href = tr.children[1].firstElementChild.href;
                akk.addButtonBlacklist(tr, href);
                return {
                    tr,
                    href
                };
            });
        }
    };
    akk.bundles = {
        //'loadjs': ['https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js'],
        'sugar': ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js'],
        'lodash': ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js'],
        'ramda': ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js'],
        'localforage': ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js'],
        'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js'],
    };
    akk.cleanGameData = () => {
        let gameDataNew = {};
        //_.values(akk.gameData).filter((e) => e.gameUrl && e.md5).map((e) => {gameDataNew[e.md5] = e;});
        /*
        _.values(akk.gameData).map((e) => {
            let obj = _.clone(e);
            _.set(obj, 'buyId', +obj.buy.replace(/\D+/g, ''));
            _.set(obj, 'buyTrade', obj.buy.includes('buytrade'));
            _.set(obj, 'gameId', akk.getAppidFromUrl(obj.gameUrl));
            return akk.addChecksumObj(Object.reject(obj, ['buy', 'gameUrl']));
        }).map((e) => _.set(gameDataNew, e.md5, e));
        */ /*
        _.values(akk.gameData).map((e) => {
            let obj = _.clone(e);
            _.isUndefined(obj.PricePoints) && _.set(obj, 'pricePoints', +(obj.priceUSD * 100));
            return akk.addChecksumObj(obj);
        }).map((e) => _.set(gameDataNew, e.md5, e));
        */
        //_.set(akk, 'gameData', gameDataNew);
        //akk.saveLocalStorage();
    };
    akk.getGameTitlesUnique = () => _.values(akk.gameData).map((e) => e.gameTitle).unique();
    akk.Init = (script, textStatus) => {
        console.log('Init');
        let bundleIds = Object.keys(akk.bundles).map((bundleId) => {
            if (!top.loadjs.isDefined(bundleId)) top.loadjs(akk.bundles[bundleId], bundleId);
            return bundleId;
        });
        top.loadjs.ready(bundleIds, akk.Setup);
    };
    akk.Setup = () => {
        console.log('Setup');
        top.Sugar.extend();
        akk.loadLocalStorage()
            .then(() => akk.checkUserData())
            .then(() => akk.updateUserData())
            .then(() => akk.saveLocalStorage())
            .catch(() => console.warn('catch'))
            .then(() => akk.Main())
    };
    akk.Main = () => {
        console.log('Main');
        akk.removeAds();
        akk.modPages();
        akk.modTableKeysAccount();
        akk.modDPSform();
        akk.updateGameData();
        akk.modTableKeysXT();
        akk.hideGamesOwned();
        console.log(akk);
        console.dir(akk);
    };
    $.getScript(akk.url.loadjs).done(akk.Init)
        .fail((jqxhr, settings, exception) => console.error("Triggered ajaxError handler."));
    return akk;
})(top.jQuery);
