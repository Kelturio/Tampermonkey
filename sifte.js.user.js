// ==UserScript==
// @name         sifte.au3 - google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Searinox
// @icon		 https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
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
        audio.play();
    }
    document.onkeydown = e => Math.random() < 0.5 ? play(burp) : play(fart);
})();