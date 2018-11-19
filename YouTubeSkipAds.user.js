// ==UserScript==
// @name         YouTubeSkipAds
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function() {
  'use strict'
  const cssVideo = '#movie_player > div.html5-video-container > video'
  const cssEnhancerClean = '#enhancer-for-youtube-toolbar > ul > li[data-name=clean]'
  let lastSrc = ''
  let i = 0
  function clean () {
    return document.querySelector(cssEnhancerClean).click()
  }
  function skipAd () {
    let video = document.querySelector(cssVideo)
    if (video && video.src) {
      i++ % 4 && clean()
      if (video.src !== lastSrc) {
        console.warn('CHANGED SRC', [video.src, lastSrc])
        clean()
      }
      lastSrc = video.src
    }
  }
  setInterval(skipAd, 420)
})();