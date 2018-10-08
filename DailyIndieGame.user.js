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
        akk.log('checkUserData');
        return new Promise(function(resolve, reject) {
            if (akk.userdata_date) {
                if ((Date.now() - akk.userdata_date) > 100e3) {
                    resolve();
                } else {
                    reject()
                }
            } else {
                resolve();
            }
        });
    };
    akk.updateUserData = () => {
        akk.log('updateUserData');
        return new Promise(function(resolve, reject) {
            $.getJSON(akk.url.userdata, (data) => {
                _.set(akk, 'userdata', data);
                _.set(akk, 'userdata_date', Date.now());
                resolve();
            });
        });
    };
    akk.callCb = (cb) => {
        akk.log('callCb');
        if (_.isFunction(cb)) {
            return cb.call(akk);
        }
    };
    akk.localStorageKeys = ['userdata', 'userdata_date', 'blacklist', 'gameData'];
    akk.loadLocalStorage = () => {
        akk.log('loadLocalStorage');
        return new Promise(function(resolve, reject) {
            akk.localStorageKeys.map((key, i) => {
                top.localforage.getItem(key).then(function(value) {
                    if (!value) console.warn('loadLocalStorage', key);
                    _.set(akk, key, value);
                    if (i === akk.localStorageKeys.length - 1) {
                        resolve();
                    }
                }).catch(akk.err);
            });
        });
        /*return akk.localStorageKeys.map((key) => {
            akk[key] = JSON.parse(localStorage.getItem(key));
        });*/
    };

    akk.err = (err) => {
        console.warn(err);
    };
    akk.log = (value) => {
        console.log(value);
    };
    akk.saveLocalStorage = () => {
        akk.log('saveLocalStorage');
        return new Promise(function(resolve, reject) {
            akk.localStorageKeys.map((key, i) => {
                if (akk[key]) {
                    top.localforage.setItem(key, akk[key]).then(akk.log).catch(akk.err);
                } else {
                    akk.err('saveLocalStorage'.concat(' ', key));
                }
                if (i === akk.localStorageKeys.length - 1) {
                    resolve();
                }
            });
        });
        //return akk.localStorageKeys.map((key) => localStorage.setItem(key, JSON.stringify(akk[key])));
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
        return (Object.isString(url)) ? +(url.split(akk.url.app)[1].replace('/', '')) : '';
    };
    akk.hideGamesOwned = () => {
        akk.log('hideGamesOwned');
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
        akk.log('getPages');
        return $(akk.sel.allPages);
    };
    akk.appendClone = (target, destination) => {
        akk.log('appendClone');
        return destination.append(target.clone())[0].lastChild;
    };
    akk.appendCloneSel = (target, destination) => {
        akk.log('appendCloneSel');
        return $(destination).append($(target).clone())[0].lastChild;
    };
    akk.newPagesProps = [{
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
        akk.log('modPages');
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
        akk.log('modTableKeysAccount');
        if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT_updateshowpurchased') || location.pathname.includes('digstore')) return;
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
        akk.log('updateGameData');
        let rows = $(akk.sel.tableKeysRow).toArray();
        if (rows.length < 2 || (!location.pathname.includes('digstore') && !location.pathname.includes('tradesXT') &&
                !location.pathname.includes('storeXT_updateshowpurchased'))) return [];
        rows = rows.map((row) => {
            let cols = _.toArray(row.children);
            //console.log(cols);
            if (location.pathname.includes('digstore')) {
                cols = {
                    no: parseInt(cols[0].textContent),
                    new: cols[1].innerHTML.compact().includes('New'),
                    steamPrice: parseFloat(cols[2].textContent.replace('$', '')),
                    gameTitle: cols[3].textContent,
                    gameUrl: cols[3].children[0] && cols[3].children[0].href,
                    type: cols[4].textContent,
                    macOs: cols[5].innerHTML.includes('img'),
                    linux: cols[6].innerHTML.includes('img'),
                    vr: cols[7].innerHTML.includes('img'),
                    achievements: cols[8].innerHTML.includes('img'),
                    card: cols[9].textContent.includes('YES'),
                    pricePoints: parseInt(cols[10].textContent.replace('DIG Points', '').compact()),
                    priceUSD: parseFloat(cols[11].textContent.replace('$', '')),
                    buy: cols[12].children[0] && cols[12].children[0].href.replace(location.origin, ''),
                    ts: Date.now()
                };
            }
            if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT_updateshowpurchased')) {
                cols = {
                    no: parseInt(cols[0].textContent),
                    gameTitle: cols[1].textContent,
                    gameUrl: cols[1].children[0] && cols[1].children[0].href,
                    comment: cols[2].textContent,
                    card: cols[3].textContent.includes('YES'),
                    sellerRating: parseInt(cols[4].textContent.compact().replace('%', '')),
                    viewOffers: cols[5].children[0] && cols[5].children[0].href.replace(location.origin, ''),
                    publisher: cols[6].textContent,
                    pricePoints: parseInt(cols[7].textContent.replace('DIG Points', '').compact()),
                    priceUSD: parseFloat(cols[8].textContent.replace('$', '')),
                    buy: cols[9].children[0] && cols[9].children[0].href.replace(location.origin, ''),
                    ts: Date.now()
                };
            }
            cols = akk.addChecksumObj(cols);
            return cols;
        });
        let rowsObj = {};
        let bl = akk.updateGameDataMd5Blacklist;
        rows.from(1).filter((row) => !(!row.gameUrl && bl.includes(row.md5))).map((row) => {
            _.set(rowsObj, row.md5, row);
        });
        _.set(akk, 'gameDataNew', rowsObj);
        akk.log(_.size(akk.gameData), 'before merge');
        Object.merge(akk.gameData, akk.gameDataNew);
        akk.log(_.size(akk.gameData), 'after merge');
        akk.saveLocalStorage();
        return rows;
    };
    akk.addChecksumObj = (obj) => {
        return _.set(obj, 'md5', top.md5(JSON.stringify(Object.reject(obj, ['no', 'ts', 'md5']))));
    };
    akk.modDPSform = (url) => {
        akk.log('modDPSform');
        if (!location.pathname.includes('account_buy')) return;
        if ($('#DPSform')[0] && $('#DPSform')[0].onsubmit) $('#DPSform')[0].onsubmit = () => true;
    };
    akk.removeAds = () => {
        akk.log('removeAds');
        $('.adsbygoogle')[0].parentElement.remove();
        $('body > iframe').remove();
    };
    akk.addGameUrl = (td) => {
        let href = Object.values(akk.gameData).filter((e) => {
            return e.gameTitle && e.gameTitle.includes(td.textContent.compact());
        });
        if (!href.length) return;
        href = href.first().gameUrl;
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
        akk.log('modTableKeysXT');
        if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT_updateshowpurchased')) {
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
        _.values(akk.gameData).filter((e) => e.gameUrl && e.md5).map((e) => {gameDataNew[e.md5] = e;});
        _.set(akk, 'gameData', gameDataNew);
        akk.saveLocalStorage();
    };
    akk.Init = (script, textStatus) => {
        akk.log('Init');
        let bundleIds = Object.keys(akk.bundles).map((bundleId) => {
            if (!top.loadjs.isDefined(bundleId)) top.loadjs(akk.bundles[bundleId], bundleId);
            return bundleId;
        });
        top.loadjs.ready(bundleIds, akk.Setup);
    };
    akk.Setup = () => {
        akk.log('Setup');
        top.Sugar.extend();
        akk.loadLocalStorage()
            //.then(() => akk.checkUserData())
            //.then(() => akk.updateUserData())
            //.then(() => akk.saveLocalStorage())
            .catch(() => console.warn('catch'))
            .then(() => akk.Main())
    };
    akk.Main = () => {
        akk.log('Main');
        akk.removeAds();
        akk.modPages();
        akk.modTableKeysAccount();
        akk.modDPSform();
        akk.updateGameData();
        akk.modTableKeysXT();
        akk.hideGamesOwned();
        akk.log(akk);
        console.dir(akk);
    };
    $.getScript(akk.url.loadjs).done(akk.Init)
        .fail((jqxhr, settings, exception) => akk.err("Triggered ajaxError handler."));
    return akk;
})(top.jQuery);
