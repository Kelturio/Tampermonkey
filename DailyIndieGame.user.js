// ==UserScript==
// @name         DailyIndieGame
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        http://www.dailyindiegame.com/*
// @grant        none
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

/* eslint max-lines: ["error", 5120] */
/* eslint max-len: ["error", { "ignoreStrings": true }] */
/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */
/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* eslint newline-before-return: "off" */
/* eslint no-ternary: "off" */
/* eslint multiline-ternary: ["error", "always-multiline"] */
/* eslint dot-location: ["error", "property"] */
/* eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }] */
/* eslint quote-props: ["error", "consistent-as-needed"] */
/* eslint id-length: ["error", { "exceptions": ["$", "i"] }] */
/* eslint brace-style: ["error", "1tbs", { "allowSingleLine": true }] */
/* eslint block-spacing: ["error", "always"] */
/* eslint max-statements-per-line: ["error", { "max": 2 }] */
/* eslint radix: ["error", "as-needed"] */
/* eslint no-confusing-arrow: ["error", {"allowParens": true}] */
/* eslint no-extra-parens:
          ["error", "all", { "enforceForArrowConditionals": false,
                             "returnAssign": false,
                             "nestedBinaryExpressions": false}] */
/* eslint no-return-assign: ["error", "except-parens"] */
/* eslint no-mixed-operators: "error" */
/* eslint semi:
          ["error", "never", { "beforeStatementContinuationChars": "always"}] */
/* eslint indent: ["error", 2, {
         "VariableDeclarator": { "var": 2, "let": 2, "const": 2 },
         "ArrayExpression": "first",
         "ObjectExpression": "first",
         "FunctionExpression": {"body": 1, "parameters": "first"},
         "CallExpression": {"arguments": "first"}
         }] */
/* eslint indent-legacy: "off" */
/* eslint comma-style: ["error", "first",
          { "exceptions": { "ArrayExpression": true,
                            "ObjectExpression": true } }] */
/* eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 3 }] */
/* eslint array-element-newline: ["error", "consistent"] */
/* eslint array-bracket-newline: ["error", "consistent"] */
/* eslint comma-dangle: ["error", "always-multiline"] */
/* eslint key-spacing: ["error", {
    "multiLine": {
        "beforeColon": false,
        "afterColon": true

    },
    "align": {
        "beforeColon": false,
        "afterColon": true,
        "on": "colon"
    }
}] */
/* eslint function-paren-newline: ["error", "consistent"] */

top.akk = (function iife ($) {
  'use strict'
  const akk = {}
  akk.userDataRefresh = 120e3
  akk.minRowLenUpdGameData = 2
  akk.url = {
    app        : 'http://store.steampowered.com/app/',
    loadjs     : 'https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.min.js',
    registerKey: 'https://store.steampowered.com/account/registerkey?key=',
    userdata   : 'https://store.steampowered.com/dynamicstore/userdata/',
  }
  akk.sel = {
    activePage     : '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a > span.DIG2-TitleOrange2',
    allPages       : '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a',
    bodyTable      : 'body > table > tbody > tr > td > table[width=1020]',
    dig2TableGray  : '#DIG2TableGray',
    firstPage      : '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a:nth-child(6)',
    firstPageParent: '#DIG2TableGray > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td',
    hideGamesOwned : [
      '#TableKeys > tbody > tr > td:nth-child(4) > a',
      '#TableKeys > tbody > tr > td:nth-child(2) > a',
    ],
    rowsTableKeys: '#TableKeys > tbody > tr',
    tableKeysRow : '#TableKeys > tbody > tr',
  }
  akk.checkUserData = () => {
    console.error('checkUserData')
    return new Promise((resolve, reject) => {
      if (akk.userdata_date) {
        if (Date.now() - akk.userdata_date > akk.userDataRefresh) {
          resolve()
        } else {
          reject(new Error('something bad happened'))
        }
      } else {
        resolve()
      }
    })
  }
  akk.updateUserData = () => {
    console.log('updateUserData')
    return new Promise((resolve, reject) => {
      $.getJSON(`${akk.url.userdata}?_=${Date.now()}`, (data) => {
        if (_.isEmpty(data.rgOwnedApps)) {
          reject(new Error('something bad happened'))
          console.warn('userdata.rgOwnedApps is empty')
        } else {
          _.set(akk, 'userdata', data)
        }
        _.set(akk, 'userdata_date', Date.now())
        resolve()
      })
    })
  }
  akk.callCb = (cb) => {
    console.log('callCb')
    return _.isFunction(cb) ? Reflect.apply(cb, akk, []) : false
  }
  akk.localStorageKeys = [
    {
      default: {
        rgOwnedApps: [],
      },
      key: 'userdata',
    },
    {
      default: null,
      key    : 'userdata_date',
    },
    {
      default: [],
      key    : 'blacklist',
    },
    {
      default: {},
      key    : 'gameData',
    },
  ]
  akk.blacklist = []
  akk.gameData = {}
  akk.loadLocalStorage = () => {
    console.log('loadLocalStorage')
    return new Promise((resolve) => {
      akk.localStorageKeys.map((cv, i) => top.localforage.getItem(cv.key)
        .then((value) => {
          if (!value) {
            console.warn('loadLocalStorage', cv.key)
          }
          if (_.isNull(_.set(akk, cv.key, value)[cv.key])) {
            _.set(akk, cv.key, cv.default)
          }
          /* eslint-disable-next-line no-magic-numbers */
          if (i === akk.localStorageKeys.length - 1) {
            resolve()
          }
        })
        .catch(console.error))
    })
  }
  akk.saveLocalStorage = () => {
    console.log('saveLocalStorage')
    return new Promise((resolve) => {
      akk.localStorageKeys.map((cv, i) => {
        if (akk[cv.key]) {
          top.localforage.setItem(cv.key, akk[cv.key])
            .then(console.log)
            .catch(console.error)
        } else {
          console.error('saveLocalStorage'.concat(' ', cv.key))
        }
        /* eslint-disable-next-line no-magic-numbers */
        if (i === akk.localStorageKeys.length - 1) {
          resolve()
        }
        return null
      })
    })
  }
  akk.addBlacklist = (appid) => {
    console.log('addBlacklist', appid)
    akk.blacklist = akk.blacklist.add(appid)
    return akk.saveLocalStorage()
  }
  akk.removeBlacklist = (appid) => akk.saveLocalStorage(akk
    .blacklist.remove(appid))
  akk.getOwnedApps = () => akk.userdata.rgOwnedApps.concat(akk.blacklist)
  akk.getAppidFromUrl = (url) => (Object.isString(url)
    ? Number(url.split('steampowered').last().split('/')[2])
    : '')
  akk.hideGamesOwned = () => {
    console.log('hideGamesOwned')
    akk.sel.hideGamesOwned.map((sel) => $(sel).toArray()).flatten()
      .map((cv) => ({
        el: cv,
        id: akk.getAppidFromUrl(cv.href),
      }))
      .filter((cv) => akk.getOwnedApps().includes(cv.id))
      .map((cv) => (cv.el.parentElement.parentElement.style.display = 'none'))
  }
  akk.getPages = () => {
    console.log('getPages')
    return $(akk.sel.allPages)
  }
  akk.appendClone = (target, destination) => {
    console.log('appendClone')
    return destination.append(target.clone())[0].lastChild
  }
  akk.appendCloneSel = (target, destination) => {
    console.log('appendCloneSel')
    return $(destination).append($(target).clone())[0].lastChild
  }
  akk.newPagesProps = [{
    text: '|<<<',
    /* eslint-disable-next-line sort-keys */
    href: () => akk.oldPages.first().href,
  }, {
    text: '<<<',
    /* eslint-disable-next-line sort-keys, arrow-body-style */
    href: () => {
      return akk.activePage.previousElementSibling &&
          akk.activePage.previousElementSibling.nodeName !== 'BR' &&
          Number.isFinite(Number(akk.activePage
            .previousElementSibling.innerText))
        ? akk.activePage.previousElementSibling
        : akk.oldPages.first().href
    },
  }, {
    text: '>>>',
    /* eslint-disable-next-line sort-keys, arrow-body-style */
    href: () => {
      return akk.activePage.nextElementSibling &&
          Number.isFinite(Number(akk.activePage
            .nextElementSibling.innerText))
        ? akk.activePage.nextElementSibling.href
        : akk.oldPages.last().href
    },
  }, {
    text: '>>>|',
    /* eslint-disable-next-line sort-keys */
    href: () => akk.oldPages.last().href,
  }]
  akk.modPages = () => {
    console.log('modPages')
    _.set(akk, 'activePage', $(akk.sel.activePage)[0])
    const pages = akk.getPages()
    if (!pages.length || !akk.activePage) {
      return
    }
    _.set(akk, 'activePage', akk.activePage.parentElement)
    _.set(akk, 'oldPages', pages.toArray())
    _.set(akk, 'newPages', akk.newPagesProps.map((cv) => {
      const clone = akk.appendCloneSel(
        akk.sel.firstPage,
        akk.sel.firstPageParent
      )
      clone.firstElementChild.innerText = cv.text
      clone.href = cv.href()
      clone.firstElementChild.className = 'DIG2contentSite'
      return clone
    }))
    pages.appendTo($(akk.sel.firstPageParent))
  }
  akk.modTableKeysAccount = () => {
    console.log('modTableKeysAccount')
    if (!location.pathname.includes('account_page')) {
      return
    }
    _.set(akk, 'tableKeys', $(akk.sel.rowsTableKeys).toArray()
      /* eslint-disable-next-line no-magic-numbers */
      .from(1)
      .map((tr) => {
        const key = tr.children[4].innerText
            , td = $('<td/>').attr('valign', 'top').appendTo(tr)
            , anchor = $('<a/>').attr('href', akk.url.registerKey.concat(key)).appendTo(td)
        $('<span/>').addClass('DIG3_14_White')
          .text('Activate Key')
          .appendTo(anchor)
        akk.addButtonBlacklist(tr, akk.addGameUrl(tr.children[2]))
        return {
          key,
          tr,
        }
      }))
  }
  akk.updateGameDataMd5Blacklist = ['d58ba90acecfed7e6900bff6029f644b']
  /* eslint-disable-next-line max-lines-per-function, max-statements */
  akk.updateGameData = () => {
    console.log('updateGameData')
    let rows = $(akk.sel.tableKeysRow).toArray()
    if (rows.length < akk.minRowLenUpdGameData ||
      (!location.pathname.includes('digstore') && !location.pathname.includes('store_updateshowdlc') &&
        !location.pathname.includes('tradesXT') && !location.pathname.includes('storeXT'))) {
      return []
    }
    rows = rows.map((row) => {
      let cols = _.toArray(row.children)
      if (location.pathname.includes('digstore') || location.pathname.includes('store_updateshowdlc')) {
        cols = {
          /* eslint-disable sort-keys */
          no          : parseInt(cols[0].textContent),
          new         : cols[1].innerHTML.compact().includes('New'),
          steamPrice  : parseFloat(cols[2].textContent.replace('$', '')),
          gameTitle   : cols[3].textContent,
          gameId      : akk.getAppidFromUrl(_.get(cols, '[3].children.[0].href')),
          type        : cols[4].textContent,
          macOs       : cols[5].innerHTML.includes('img'),
          linux       : cols[6].innerHTML.includes('img'),
          vr          : cols[7].innerHTML.includes('img'),
          achievements: cols[8].innerHTML.includes('img'),
          card        : cols[9].textContent.includes('YES'),
          priceUSD    : parseFloat(cols[11].textContent.replace('$', '')),
          buyId       : cols[12].children[0] && Number(cols[12].children[0].href.replace(/\D+/gu, '')),
          buyTrade    : cols[12].children[0] && cols[12].children[0].href.includes('buytrade'),
          ts          : Date.now(),
          /* eslint-enable sort-keys */
        }
      } else if (location.pathname.includes('tradesXT') || location.pathname.includes('storeXT')) {
        cols = {
          /* eslint-disable sort-keys */
          no          : parseInt(cols[0].textContent),
          gameTitle   : cols[1].textContent,
          gameId      : akk.getAppidFromUrl(_.get(cols, '[1].children.[0].href')),
          regionLock  : cols[2].textContent.compact(),
          comment     : cols[3].textContent,
          card        : cols[4].textContent.includes('YES'),
          sellerRating: parseInt(cols[5].textContent.compact().replace('%', '')),
          publisher   : cols[6].textContent,
          priceUSD    : parseFloat(cols[7].textContent.replace('$', '')),
          buyId       : cols[8].children[0] && Number(cols[8].children[0].href.replace(/\D+/gu, '')),
          buyTrade    : cols[8].children[0] && cols[8].children[0].href.includes('buytrade'),
          ts          : Date.now(),
          /* eslint-enable sort-keys */
        }
      } else {
        console.error('updateGameData.rows.cols')
      }
      cols = akk.addChecksumObj(cols)
      return cols
    })
    const rowsObj = {}
        , bl = akk.updateGameDataMd5Blacklist
    /* eslint-disable-next-line no-magic-numbers */
    rows.from(1).filter((row) => !(!row.gameUrl && bl.includes(row.md5)))
      .map((row) => _.set(rowsObj, row.md5, row))
    _.set(akk, 'gameDataNew', rowsObj)
    console.log(_.size(akk.gameData), 'before merge')
    Object.merge(akk.gameData, akk.gameDataNew)
    console.log(_.size(akk.gameData), 'after merge')
    akk.saveLocalStorage()
    return rows
  }
  akk.addChecksumObj = (obj) => _.set(obj, 'md5', top.md5(JSON.stringify(Object
    .reject(obj, ['no', 'ts', 'md5']))))
  akk.modDPSform = () => {
    console.log('modDPSform')
    if (!location.pathname.includes('account_buy')) {
      return
    }
    if ($('#DPSform')[0] && $('#DPSform')[0].onsubmit) {
      $('#DPSform')[0].onsubmit = () => true
    }
  }
  akk.removeAds = () => {
    console.log('removeAds')
    $('.adsbygoogle')[0].parentElement.remove()
    $('body > iframe').remove()
  }
  akk.addGameUrl = (td) => {
    let href = _.values(akk.gameData)
      .filter((cv) => _.get(cv, 'gameTitle', '').includes(td.textContent.compact()))
    if (!href.length) {
      return false
    }
    href = akk.url.app.concat(href.first().gameId)
    const anchor = $('<a/>').attr('href', href).appendTo(td)
    $('<span/>').text(td.textContent).appendTo(anchor)
    td.firstChild.remove()
    return href
  }
  akk.addButtonBlacklist = (tr, href) => {
    const appid = akk.getAppidFromUrl(href)
        , td = $('<td/>').attr('valign', 'top').appendTo(tr)
    $('<span/>', {
      on: {
        click: () => {
          console.log(`click ${appid}`)
          akk.addBlacklist(appid)
        },
      },
    }).text(appid).appendTo(td)
  }
  akk.modTableKeysXT = () => {
    console.log('modTableKeysXT')
    if (location.pathname.includes('tradesXT') ||
      location.pathname.includes('storeXT')) {
      akk.tableKeys = $(akk.sel.rowsTableKeys).toArray()
        /* eslint-disable-next-line no-magic-numbers */
        .from(2)
        .map((tr) => {
          const {href} = tr.children[1].firstElementChild
          akk.addButtonBlacklist(tr, href)
          return {
            href,
            tr,
          }
        })
    }
  }
  akk.modBodyTable = () => {
    console.log('modBodyTable')
    $(akk.sel.bodyTable).width('100%')
    $(akk.sel.dig2TableGray).width('100%')
  }
  akk.bundles = {
    /* eslint-disable sort-keys */
    'sugar'      : ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js'],
    'lodash'     : ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js'],
    'ramda'      : ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js'],
    'localforage': ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js'],
    'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js'],
    /* eslint-enable sort-keys */
  }

  /* Temp
  akk.cleanGameData = () => {
      let gameDataNew = {};
      _.values(akk.gameData).filter((e) => e.gameUrl && e.md5)
          .map((e) => {gameDataNew[e.md5] = e;});

      _.values(akk.gameData).map((e) => {
          let obj = _.clone(e);
          _.set(obj, 'buyId', +obj.buy.replace(/\D+/g, ''));
          _.set(obj, 'buyTrade', obj.buy.includes('buytrade'));
          _.set(obj, 'gameId', akk.getAppidFromUrl(obj.gameUrl));
          return akk.addChecksumObj(Object.reject(obj, ['buy', 'gameUrl']));
      }).map((e) => _.set(gameDataNew, e.md5, e));

      _.values(akk.gameData).map((e) => {
          let obj = _.clone(e);
          _.isUndefined(obj.PricePoints) &&
              _.set(obj, 'pricePoints', +(obj.priceUSD * 100));
          return akk.addChecksumObj(obj);
      }).map((e) => _.set(gameDataNew, e.md5, e));

      //_.set(akk, 'gameData', gameDataNew);
      //akk.saveLocalStorage();
  };
  */
  akk.getGameTitlesUnique = () => _
    .values(akk.gameData).map((cv) => cv.gameTitle).unique()
  akk.Init = (script, textStatus) => {
    console.log(`Init ${script} ${textStatus}`)
    const bundleIds = Object.keys(akk.bundles).map((bundleId) => {
      if (!top.loadjs.isDefined(bundleId)) {
        top.loadjs(akk.bundles[bundleId], bundleId)
      }
      return bundleId
    })
    top.loadjs.ready(bundleIds, akk.Setup)
  }
  akk.Setup = () => {
    console.log('Setup')
    top.Sugar.extend()
    akk.loadLocalStorage()
      //  .then(() => akk.checkUserData())
      //  .then(() => akk.updateUserData())
      .then(() => akk.saveLocalStorage())
      .catch(() => console.warn('catch'))
      .then(() => akk.main())
  }
  /* eslint-disable-next-line max-statements */
  akk.main = () => {
    console.log('main')
    akk.removeAds()
    akk.modPages()
    akk.modTableKeysAccount()
    akk.modDPSform()
    akk.updateGameData()
    akk.modTableKeysXT()
    akk.hideGamesOwned()
    akk.modBodyTable()
    console.log(akk)
    /* eslint-disable-next-line no-console */
    console.dir(akk)
  }
  $.getScript(akk.url.loadjs).done(akk.Init)
    .fail((...args) => console.error('Triggered ajaxError handler.', args))
  return akk
}(top.jQuery))
