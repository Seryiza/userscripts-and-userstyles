// ==UserScript==
// @name Kinopoisk Video Quality Setter
// @description Set the video quality on Kinopoisk automatically.
// @copyright 2020, Seryiza (https://seryiza.xyz)
// @namespace Kinopoisk
// @version 2020.09.16
// @license MIT
// @run-at document-end
// @match https://yastatic.net/yandex-video-player-iframe-api-bundles/*
// @require https://github.com/Seryiza/userscripts-and-userstyles/raw/master/DOMWaiter/dom-waiter.js
// @grant GM_getValue
// ==/UserScript==

const DEFAULT_BEST_VIDEO_QUALITY = 720;

const selectors = {
  'player': 'video',
  'settings-button': '._2xB4hUF .T6js1xi:nth-of-type(2)',
  'settings-select-label': '._1ML4B9X.q91zlOj ._2lty85i',
};

const wait = new Waiter(findKinopoiskElement);
const click = (el) => el.click();

onPlayerUpdate(document.querySelector(selectors['player']), () => {
  const bestQuality = GM_getValue('bestVideoQuality', DEFAULT_BEST_VIDEO_QUALITY);
  setVideoQuality(bestQuality);
});

function setVideoQuality(bestQuality = 720) {
  wait('settings-button')
      .then(click)
      .then(() => wait('settings-select-label', 'Качество'))
      .then(click)
      .then(() => wait('settings-select-label'))
      .then((elements) => getLessOrEqualVideoQualities(elements, bestQuality))
      .then((qualities) => {
          if (!qualities.length) {
              throw new Error('Video quality was not picked.');
          }

          click(qualities[0]);
      });
};

function findKinopoiskElement(componentName, root = document) {
  if (!(componentName in selectors)) {
      throw new Error('Kinopoisk selector not found: ' + componentName);
  }

  return Array.from(
      root.querySelectorAll(selectors[componentName])
  );
}

function getLessOrEqualVideoQualities(labels, expectingQuality) {
  return labels.filter(label => {
      const quality = parseInt(label.textContent);
      return !isNaN(quality) && quality <= expectingQuality;
  });
};

function onPlayerUpdate(player, fn) {
  const observer = new MutationObserver(fn);
  observer.observe(player, {
      attributes: true,
      attributeFilter: ['src'],
  });
}
