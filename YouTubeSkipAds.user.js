// ==UserScript==
// @name         YouTubeSkipAds
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  Ads removal
// @description  Enhancer for YouTube™ extension is needed
// @description  https://www.mrfdev.com/enhancer-for-youtube
// @description  https://addons.mozilla.org/addon/enhancer-for-youtube/?src=external-mrfdev
// @description  https://chrome.google.com/webstore/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle
// @description  https://addons.opera.com/en/extensions/details/enhancer-for-youtube/?display=en-US
// @description  https://www.microsoft.com/en-us/store/p/enhancer-for-youtube-for-microsoft-edge/9n4f8m7plt38
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @updateURL    https://kelturio.github.io/Tampermonkey/YouTubeSkipAds.user.js
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function iife () {
  'use strict'
  const css = {
    enhancerClean: '#enhancer-for-youtube-toolbar > ul > li[data-name=clean]',
    video        : '#movie_player > div.html5-video-container > video',
  }
  const clean = () => document.querySelector(css.enhancerClean).click()
  const autoSkip = () => {
    const video = document.querySelector(css.video)
    if (video && video.src) {
      (!(i++ % 6) || video.src !== lastSrc) && clean()
      lastSrc = video.src
    }
  }
  let i = 0
    , lastSrc = ''
  setInterval(autoSkip, 420)
}())
