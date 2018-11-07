// ==UserScript==
// @name         sifte.au3_google
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @updateURL    https://github.com/Kelturio/Tampermonkey/raw/master/sifte.au3_google.user.js
// @match        https://www.google.de/*
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

/* eslint id-length: ["error", { "min": 2 }] */
/* eslint lines-around-directive: 0 */
/* eslint max-len: ["error", { "ignoreUrls": true }] */
/* eslint multiline-comment-style: 0 */
/* eslint newline-after-var: 0 */
/* eslint padded-blocks: 0 */
/* eslint quotes: [2, "single"] */
/* eslint sort-vars: 0 */
/* eslint-env browser, es6, greasemonkey */

(function sifte () {
    'use strict';
    const url = 'https://raw.githubusercontent.com/Kelturio/Misc/master/GTA2/SIFTE/',
        sfx = [
            'SFX_BURP',
            'SFX_FART'
        ].map((cv) => new Audio(`${url}${cv}.wav`)),
        play = (audio) => {
            audio.volume = 0.33;
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        },
        playRandom = () => play(sfx[Math.floor(Math.random() * sfx.length)]);
    document.onkeydown = playRandom;
    document.addEventListener('click', playRandom);
}());
