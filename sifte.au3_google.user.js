// ==UserScript==
// @name         sifte.au3_google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @updateURL    https://github.com/Kelturio/Tampermonkey/raw/master/sifte.au3_google.user.js
// @match        https://www.google.de/*
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let burp = new Audio('https://raw.githubusercontent.com/Kelturio/Misc/master/GTA2/SIFTE/SFX_BURP.wav');
    let fart = new Audio('https://raw.githubusercontent.com/Kelturio/Misc/master/GTA2/SIFTE/SFX_FART.wav');
    let play = (audio) => {
        audio.pause();
        audio.currentTime = 0;
        //audio.playbackRate = 0.5;
        audio.play();
    }
    let playRandom = () => {
        Math.random() < 0.5 ? play(burp) : play(fart);
    }
    document.onkeydown = playRandom;
    document.addEventListener('click', playRandom);
})();