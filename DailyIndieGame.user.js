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

/* global _, loadjs, Sugar */
/* exported akk */

/* eslint {
  "accessor-pairs": [2, {
    "getWithoutSet": true,
    "setWithoutGet": false
  }],
  "array-bracket-newline": [2, "consistent"],
  "array-bracket-spacing": [2, "never", {
    "singleValue": false,
    "objectsInArrays": true,
    "arraysInArrays": true
  }],
  "array-callback-return": ["error", { allowImplicit: false }],
  "array-element-newline": [2, "consistent"],
  "arrow-body-style": [2, "as-needed", {
    "requireReturnForObjectLiteral": false
  }],
  "arrow-parens": 2,
  "arrow-spacing": 2,
  "block-scoped-var": 2,
  "block-spacing": [2, "always"],
  "brace-style": [2, "1tbs", {
    "allowSingleLine": true
  }],
  "callback-return": 2,
  "camelcase": 2,
  "capitalized-comments": [2, "always", {
    "line": {
      "ignorePattern": "",
      "ignoreInlineComments": false,
      "ignoreConsecutiveComments": false
    },
    "block": {
      "ignorePattern": "",
      "ignoreInlineComments": false,
      "ignoreConsecutiveComments": false
    }
  }],
  "class-methods-use-this": 2,
  "comma-dangle": [2, {
    "arrays": "always-multiline",
    "objects": "always-multiline",
    "imports": "always-multiline",
    "exports": "always-multiline",
    "functions": "ignore"
  }],
  "comma-spacing": 2,
  "comma-style": [2, "first", {
    "exceptions": {
      "VariableDeclaration": false,
      "ObjectExpression": true,
      "ObjectPattern": false,
      "ArrayExpression": true,
      "ArrayPattern": false,
      "FunctionDeclaration": false,
      "FunctionExpression": false,
      "ArrowFunctionExpression": false,
      "CallExpression": true,
      "ImportDeclaration": false,
      "NewExpression": false,
    }
  }],
  "complexity": 2,
  "computed-property-spacing": 2,
  "consistent-return": 2,
  "consistent-this": 2,
  "constructor-super": 2,
  "curly": 2,
  "default-case": 2,
  "dot-location": [2, "property"],
  "dot-notation": 2,
  "eol-last": 2,
  "eqeqeq": 2,
  "for-direction": 2,
  "func-call-spacing": 2,
  "func-name-matching": 2,
  "func-names": 2,
  "func-style": 2,
  "function-paren-newline": [2, "consistent"],
  "generator-star-spacing": 2,
  "getter-return": 2,
  "global-require": 2,
  "guard-for-in": 2,
  "handle-callback-err": 2,
  "id-blacklist": 2,
  "id-length": [2, {
    "min": 2,
    "max": Infinity,
    "exceptions": ["$", "i"],
    "properties": "never"
  }],
  "id-match": 2,
  "implicit-arrow-linebreak": 2,
  "indent": [2, 2, {
    "SwitchCase": 0,
    "VariableDeclarator": {
      "var": 2,
      "let": 2,
      "const": 2
    },
    "outerIIFEBody": 1,
    "MemberExpression": 1,
    "FunctionDeclaration": {
      "parameters": "first",
      "body": 1
    },
    "FunctionExpression": {
      "parameters": "first",
      "body": 1
    },
    "CallExpression": {
      "arguments": "first"
    },
    "ArrayExpression": "first",
    "ObjectExpression": "first",
    "ImportDeclaration": "first",
    "flatTernaryExpressions": false,
    "ignoredNodes": [],
    "ignoreComments": false
  }],
  "init-declarations": 2,
  "jsx-quotes": 2,
  "key-spacing": [2, {
    "singleLine": {
      "mode": "strict",
      "beforeColon": false,
      "afterColon": true
    },
    "multiLine": {
      "mode": "strict",
      "beforeColon": false,
      "afterColon": true
    },
    "align": {
      "mode": "strict",
      "on": "colon",
      "beforeColon": false,
      "afterColon": true
    }
}],
  "keyword-spacing": 2,
  "line-comment-position": 2,
  "linebreak-style": 2,
  "lines-around-comment": 2,
  "lines-between-class-members": 2,
  "max-classes-per-file": 2,
  "max-depth": 2,
  "max-len": [2, {
    "code": 80,
    "comments": 80,
    "tabWidth": 2,
    "ignorePattern": "",
    "ignoreComments": false,
    "ignoreStrings": true,
    "ignoreUrls": false,
    "ignoreTemplateLiterals": false,
    "ignoreRegExpLiterals": false,
    "ignoreTrailingComments": false
  }],
  "max-lines-per-function": 2,
  "max-lines": [2, {
    "max": 420,
    "skipComments": true,
    "skipBlankLines": true
  }],
  "max-nested-callbacks": 2,
  "max-params": 2,
  "max-statements-per-line": [2, {
    "max": 2
  }],
  "max-statements": [2, 10, {
    "ignoreTopLevelFunctions": true
  }],
  "multiline-comment-style": [0, "bare-block"],
  "multiline-ternary": [2, "always-multiline"],
  "new-cap": 2,
  "new-parens": 2,
  "newline-per-chained-call": [2, {
    "ignoreChainWithDepth": 3
  }],
  "no-alert": 2,
  "no-array-constructor": 2,
  "no-async-promise-executor": 2,
  "no-await-in-loop": 2,
  "no-bitwise": 2,
  "no-buffer-constructor": 2,
  "no-caller": 2,
  "no-case-declarations": 2,
  "no-class-assign": 2,
  "no-compare-neg-zero": 2,
  "no-cond-assign": 2,
  "no-confusing-arrow": [2, {"allowParens": true}],
  "no-console": [2, {
    allow: ["error", "log", "warn"]
  }],
  "no-const-assign": 2,
  "no-constant-condition": 2,
  "no-continue": 2,
  "no-control-regex": 2,
  "no-debugger": 2,
  "no-delete-var": 2,
  "no-div-regex": 2,
  "no-dupe-args": 2,
  "no-dupe-class-members": 2,
  "no-dupe-keys": 2,
  "no-duplicate-case": 2,
  "no-duplicate-imports": 2,
  "no-else-return": 2,
  "no-empty-character-class": 2,
  "no-empty-function": 2,
  "no-empty-pattern": 2,
  "no-empty": 2,
  "no-eq-null": 2,
  "no-eval": 2,
  "no-ex-assign": 2,
  "no-extend-native": 2,
  "no-extra-bind": 2,
  "no-extra-boolean-cast": 2,
  "no-extra-label": 2,
  "no-extra-parens": [2, "all", {
    "conditionalAssign": true,
    "nestedBinaryExpressions": false,
    "returnAssign": false,
    "ignoreJSX": "none",
    "enforceForArrowConditionals": false
  }],
  "no-extra-semi": 2,
  "no-fallthrough": 2,
  "no-floating-decimal": 2,
  "no-func-assign": 2,
  "no-global-assign": 2,
  "no-implicit-coercion": 2,
  "no-implicit-globals": 2,
  "no-implied-eval": 2,
  "no-inline-comments": 2,
  "no-inner-declarations": 2,
  "no-invalid-regexp": 2,
  "no-invalid-this": 2,
  "no-irregular-whitespace": 2,
  "no-iterator": 2,
  "no-label-var": 2,
  "no-labels": 2,
  "no-lone-blocks": 2,
  "no-lonely-if": 2,
  "no-loop-func": 2,
  "no-magic-numbers": [2, {
    "detectObjects": true,
    "enforceConst": false,
    "ignore": [1],
    "ignoreArrayIndexes": true
  }],
  "no-misleading-character-class": 2,
  "no-mixed-operators": 2,
  "no-mixed-requires": 2,
  "no-mixed-spaces-and-tabs": 2,
  "no-multi-assign": 2,
  "no-multi-spaces": 2,
  "no-multi-str": 2,
  "no-multiple-empty-lines": [2, {
    "max": 2,
    "maxEOF": 1,
    "maxBOF": 0
  }],
  "no-negated-condition": 2,
  "no-nested-ternary": 2,
  "no-new-func": 2,
  "no-new-object": 2,
  "no-new-require": 2,
  "no-new-symbol": 2,
  "no-new-wrappers": 2,
  "no-new": 2,
  "no-obj-calls": 2,
  "no-octal-escape": 2,
  "no-octal": 2,
  "no-param-reassign": 2,
  "no-path-concat": 2,
  "no-plusplus": 2,
  "no-process-env": 2,
  "no-process-exit": 2,
  "no-proto": 2,
  "no-prototype-builtins": 2,
  "no-redeclare": 2,
  "no-regex-spaces": 2,
  "no-restricted-globals": 2,
  "no-restricted-imports": 2,
  "no-restricted-modules": 2,
  "no-restricted-properties": 2,
  "no-restricted-syntax": 2,
  "no-return-assign": [2, "except-parens"],
  "no-return-await": 2,
  "no-script-url": 2,
  "no-self-assign": 2,
  "no-self-compare": 2,
  "no-sequences": 2,
  "no-shadow-restricted-names": 2,
  "no-shadow": 2,
  "no-sparse-arrays": 2,
  "no-sync": 2,
  "no-tabs": 2,
  "no-template-curly-in-string": 2,
  "no-ternary": 0,
  "no-this-before-super": 2,
  "no-throw-literal": 2,
  "no-trailing-spaces": 2,
  "no-undef-init": 2,
  "no-undef": 2,
  "no-undefined": 2,
  "no-underscore-dangle": 2,
  "no-unexpected-multiline": 2,
  "no-unmodified-loop-condition": 2,
  "no-unneeded-ternary": 2,
  "no-unreachable": 2,
  "no-unsafe-finally": 2,
  "no-unsafe-negation": 2,
  "no-unused-expressions": 2,
  "no-unused-labels": 2,
  "no-unused-vars": 2,
  "no-use-before-define": 2,
  "no-useless-call": 2,
  "no-useless-computed-key": 2,
  "no-useless-concat": 2,
  "no-useless-constructor": 2,
  "no-useless-escape": 2,
  "no-useless-rename": 2,
  "no-useless-return": 2,
  "no-var": 2,
  "no-void": 2,
  "no-warning-comments": 2,
  "no-whitespace-before-property": 2,
  "no-with": 2,
  "nonblock-statement-body-position": 2,
  "object-curly-newline": 2,
  "object-curly-spacing": [2, "never", {
    "arraysInObjects": true,
    "objectsInObjects": true
  }],
  "object-property-newline": [2, {
    "allowAllPropertiesOnSameLine": true
  }],
  "object-shorthand": 2,
  "one-var-declaration-per-line": 2,
  "one-var": 2,
  "operator-assignment": 2,
  "operator-linebreak": 2,
  "padded-blocks": [2, {
    "blocks": "never",
    "switches": "never",
    "classes": "never"
  }],
  "padding-line-between-statements": 2,
  "prefer-arrow-callback": 2,
  "prefer-const": 2,
  "prefer-destructuring": 2,
  "prefer-numeric-literals": 2,
  "prefer-object-spread": 2,
  "prefer-promise-reject-errors": 2,
  "prefer-rest-params": 2,
  "prefer-spread": 2,
  "prefer-template": 2,
  "quote-props": [2, "consistent-as-needed", {
    "keywords": true,
    "unnecessary": true,
    "numbers": true
  }],
  "quotes": [2, "single", {
    "avoidEscape": true,
    "allowTemplateLiterals": true
  }],
  "radix": [2, "as-needed"],
  "require-atomic-updates": 2,
  "require-await": 2,
  "require-jsdoc": 2,
  "require-unicode-regexp": 2,
  "require-yield": 2,
  "rest-spread-spacing": 2,
  "semi-spacing": 2,
  "semi-style": 2,
  "semi": [2, "never", {
    "beforeStatementContinuationChars": "always"
  }],
  "sort-imports": 2,
  "sort-keys": [2, "asc", {
    "caseSensitive": true,
    "natural": true
  }],
  "sort-vars": [2, { "ignoreCase": false }],
  "space-before-blocks": 2,
  "space-before-function-paren": 2,
  "space-in-parens": 2,
  "space-infix-ops": 2,
  "space-unary-ops": 2,
  "spaced-comment": 2,
  "strict": 2,
  "switch-colon-spacing": 2,
  "symbol-description": 2,
  "template-curly-spacing": 2,
  "template-tag-spacing": 2,
  "unicode-bom": 2,
  "use-isnan": 2,
  "valid-jsdoc": 2,
  "valid-typeof": 2,
  "vars-on-top": 2,
  "wrap-iife": 2,
  "wrap-regex": 2,
  "yield-star-spacing": 2,
  "yoda": 2
} */

/* eslint-env browser, es6, greasemonkey */

top.akk = (function iife ($) {
  'use strict'
  const akk = {}
  //  , NUM_RETRIES = 0
  akk.userDataRefresh = 120e3
  akk.minRowLenUpdGameData = 2
  akk.url = {
    app        : 'http://store.steampowered.com/app/',
    loadjs     : 'https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.4/loadjs.umd.min.js',
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
      'default': {
        rgOwnedApps: [],
      },
      'key': 'userdata',
    },
    {
      'default': null,
      'key'    : 'userdata_date',
    },
    {
      'default': [],
      'key'    : 'blacklist',
    },
    {
      'default': {},
      'key'    : 'gameData',
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
          top.localforage.setItem(cv.key, akk[cv.key]).then(console.log)
            .catch(console.error)
        } else {
          console.error('saveLocalStorage'.concat(' ', cv.key))
        }
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
  akk.newPagesPropsHref = (next) => {
    const el = _.get(akk, `activePage.${next ? 'next' : 'previous'}ElementSibling`)
    return el.nodeName !== 'BR' && (+el.innerText).isInteger()
      ? el.href
      : akk.oldPages[`${next ? 'last' : 'first'}`].href
  }
  akk.newPagesProps = [
    {
      href: () => akk.oldPages.first().href,
      text: '|<<<',
    },
    {
      href: () => akk.newPagesPropsHref(false),
      text: '<<<',
    },
    {
      href: () => akk.newPagesPropsHref(true),
      text: '>>>',
    },
    {
      href: () => akk.oldPages.last().href,
      text: '>>>|',
    },
  ]
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
      const clone = akk.appendCloneSel(akk.sel.firstPage,
                                       akk.sel.firstPageParent)
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
    _.set(akk, 'tableKeys', $(akk.sel.rowsTableKeys).toArray().from(1)
      .map((tr) => {
        const key = tr.children[4].innerText
            , td = $('<td/>').attr('valign', 'top').appendTo(tr)
            , anchor = $('<a/>').attr('href', akk.url.registerKey.concat(key)).appendTo(td)
        $('<span/>').addClass('DIG3_14_White')
          .text('Activate Key')
          .appendTo(anchor)
        akk.addButtonBlacklist(tr, akk.addGameUrl(tr.children[2]))
        return {key, tr}
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
    const bl = akk.updateGameDataMd5Blacklist
        , rowsObj = {}
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
          return {href, tr}
        })
    }
  }
  akk.modBodyTable = () => {
    console.log('modBodyTable')
    $(akk.sel.bodyTable).width('100%')
    $(akk.sel.dig2TableGray).width('100%')
  }

  /* C
  class Bundle {
    constructor (bundleId, paths, before, success, error,
                 async = true, numRetries = NUM_RETRIES) {
      this.bundleId = bundleId
      this.paths = paths
      this.before = before
      this.success = success
      this.error = error
      this.async = async
      this.numRetries = numRetries
    }
  }
  */
  akk.bundles = {
    /* eslint-disable sort-keys */
    // 'sugar'      : ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js'],
    // 'lodash'     : ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js'],
    // 'ramda'      : ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js'],
    // 'localforage': ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js'],
    // 'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js'],
    // 'akk'        : ['https://cdn.jsdelivr.net/gh/Kelturio/Tampermonkey/akk.js'],
    'requirejs'  : ['https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js'],
    /* eslint-enable sort-keys */
  }
  /* eslint-disable max-len */
  // T   akk.bundles = {
  //     /* eslint-disable sort-keys */
  //     'sugar'      : new Bundle('sugar', ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min.js']),
  //     'lodash'     : new Bundle('lodash', ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js']),
  //     'ramda'      : new Bundle('ramda', ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js']),
  //     'localforage': new Bundle('localforage', ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.2/localforage.min.js']),
  //     'blueimp-md5': new Bundle('blueimp-md5', ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js']),
  //     /* eslint-enable sort-keys */
  //   }
  /* eslint-enable max-len */
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
      if (!loadjs.isDefined(bundleId)) {
        loadjs(akk.bundles[bundleId], bundleId)
        loadjs.ready(bundleId, (...args) => console.log(`loadjs ${bundleId}`,
                                                        args))
      }
      return bundleId
    })
    loadjs.ready(bundleIds, akk.Setup)
  }
  akk.Setup = (...args) => {
    console.log('Setup', args)
    requirejs.config({
      paths: {
        'sugar'      : ['https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.4/sugar.min'],
        'lodash'     : ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min'],
        'ramda'      : ['https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min'],
        'localforage': ['https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min'],
        'blueimp-md5': ['https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min'],
        'akk'        : ['https://cdn.jsdelivr.net/gh/Kelturio/Tampermonkey/akk'],
      },
    })
    require(['lodash', 'sugar', 'localforage', 'blueimp-md5'], (lodash, sugar, localforage, md5) => {
      console.log('args', [lodash, sugar, localforage, md5])
      Sugar.extend()
      top.localforage = localforage
      top.md5 = md5
      akk.loadLocalStorage()
      //  .then(() => akk.checkUserData())
      //  .then(() => akk.updateUserData())
      .then(() => akk.saveLocalStorage())
      .catch(() => console.warn('catch'))
      .then(() => akk.main())
    })
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
