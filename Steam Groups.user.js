// ==UserScript==
// @name         Steam Groups
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://steamcommunity.com/groups/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function saveMemberList(groupURL, page) {
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
                            lastPage++;
                            top.to = setTimeout(() => saveMemberList(groupURL, lastPage), top.pt);
                        }
                        console.log(`saveMemberList ${groupURL} ${lastPage} / ${totalPages}`);
                    }).catch(console.error);
                });
                //localStorage.setItem('memberList', JSON.stringify(memberListDb));
                //lastPage = +data.getElementsByTagName('currentPage')[0].textContent;
                //totalPages = +data.getElementsByTagName('totalPages')[0].textContent;
            },
            error: () => console.error('ajax.error'),
            complete: () => {}
        });
    }
    function getAllMembers() {
        return JSON.stringify(_.flatten(_.map(JSON.parse(localStorage.memberList), (e) => e.members)));
    }
    top.pt = 5e3;
    top.saveMemberList = saveMemberList;
    top.getAllMembers = getAllMembers;
})();