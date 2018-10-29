// ==UserScript==
// @name         Steam Groups
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://steamcommunity.com/groups/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js
// @grant        GM_getTabs
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/* global _ */
/* exported akk */

/* eslint id-length: ["error", { "min": 2 }] */
/* eslint lines-around-directive: 0 */
/* eslint max-len: ["error", { "ignoreUrls": true }] */
/* eslint multiline-comment-style: 0 */
/* eslint newline-after-var: 0 */
/* eslint padded-blocks: 0 */
/* eslint quotes: [2, "single"] */
/* eslint sort-vars: 0 */
/* eslint-env browser, es6, greasemonkey */

/* eslint max-lines: ["error", 500] */
/* eslint max-len: ["error", { "ignoreStrings": true }] */
/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */
/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* eslint newline-before-return: "off" */
/* eslint no-ternary: "off" */
/* eslint multiline-ternary: ["error", "always-multiline"] */
/* eslint dot-location: ["error", "property"] */
/* eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }] */
/* eslint quote-props: ["error", "consistent-as-needed"] */
/* eslint id-length: ["error", { "exceptions": ["$"] }] */
/* eslint brace-style: ["error", "1tbs", { "allowSingleLine": true }] */
/* eslint block-spacing: ["error", "always"] */
/* eslint max-statements-per-line: ["error", { "max": 2 }] */
/* eslint radix: ["error", "as-needed"] */

top.akk = (function() {
    'use strict';
    let akk = {};
    akk.bundles = {
        'sugar': ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js'],
        'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js'],
    };
    akk.Init = (script, textStatus) => {
        GM_getTabs((a,b,c) => console.log('GM_getTabs', [a,b,c]));
        console.log('GM_getValue', GM_getValue('sifte'));
        return;
        let bundleIds = Object.keys(akk.bundles).map((bundleId) => {
            if (!top.loadjs.isDefined(bundleId)) top.loadjs(akk.bundles[bundleId], bundleId);
            return bundleId;
        });
        top.loadjs.ready(bundleIds, akk.Setup);
    };
    akk.Setup = () => {
        console.log('Setup');
        top.Sugar.extend();
    };
    function saveMemberList(groupURL, page = 1) {
        let lastPage = 0;
        let totalPages = 0;
        jQuery.ajax({
            url: `https://steamcommunity.com/groups/${groupURL}/memberslistxml/?xml=1&p=${page}`,
            type: 'get',
            success: (data) => {
                //console.log(data);
                let temp = {
                    groupID64: data.getElementsByTagName('groupID64')[0].textContent,
                    groupName: data.getElementsByTagName('groupName')[0].textContent,
                    groupURL: data.getElementsByTagName('groupURL')[0].textContent,
                    memberCount: data.getElementsByTagName('memberCount')[0].textContent,
                    totalPages: data.getElementsByTagName('totalPages')[0].textContent,
                    currentPage: data.getElementsByTagName('currentPage')[0].textContent,
                    members: [...data.getElementsByTagName('steamID64')].map((e) => e.textContent)
                };
                let memberList = {};
                memberList[temp.groupID64] = temp;
                top.localforage.getItem('memberList').then(function(memberListDb) {
                    memberListDb = memberListDb || memberList;
                    memberList[temp.groupID64].members = _.uniq([..._.get(memberListDb, [temp.groupID64, 'members'], []),
                                                                 ...memberList[temp.groupID64].members]);
                    memberListDb[temp.groupID64] = memberList[temp.groupID64];
                    return memberListDb;
                }).catch(console.error).then((memberListDb) => {
                    top.localforage.setItem('memberList', memberListDb).then(() => {
                        lastPage = +data.getElementsByTagName('currentPage')[0].textContent;
                        totalPages = +data.getElementsByTagName('totalPages')[0].textContent;
                        if (lastPage < totalPages) {
                            top.lastPage = ++lastPage;
                            top.to = setTimeout(() => saveMemberList(groupURL, lastPage), top.pt);
                        }
                        console.log(`saveMemberList ${groupURL} ${lastPage} / ${totalPages}`);
                    }).catch(console.error);
                });
            },
            error: () => {
                console.error('ajax.error', [lastPage, top.lastPage, page]);
            },
            complete: () => {}
        });
    }
    function getAllMembers() {
        return JSON.stringify(_.flatten(_.map(JSON.parse(localStorage.memberList), (e) => e.members)));
    }
    top.pt = 3e3;
    top.saveMemberList = saveMemberList;
    top.getAllMembers = getAllMembers;
    akk.Init();
    return akk;
})();
