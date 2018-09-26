// ==UserScript==
// @name         Template
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://www.searinox.com/*
// @grant        none
// ==/UserScript==

top.akk = (function($) {
    'use strict';
    let akk = {};
    akk.url = {
        loadjs: 'https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js',
	};
	akk.sel = {};
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
    akk.appendClone = (target, destination) => {
        akk.log('appendClone');
        return destination.append(target.clone())[0].lastChild;
    };
    akk.appendCloneSel = (target, destination) => {
        akk.log('appendCloneSel');
        return $(destination).append($(target).clone())[0].lastChild;
    };
    akk.bundles = {
        //'loadjs': ['https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js'],
        'sugar': ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js'],
        'lodash': ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js'],
        'ramda': ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js'],
        'localforage': ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js'],
        'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js'],
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
