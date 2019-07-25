// ==UserScript==
// @name Save video quality on Kinopoisk
// @namespace Kinopoisk
// @version 2019.07.25
// @run-at document-end
// @match https://yastatic.net/yandex-video-player-iframe-api-bundles/*
// match https://ott-widget.kinopoisk.ru/v1/kp/*
// @grant none
// ==/UserScript==

/**
 * Selectors for player elements
 */
const selectors = {
  'player': '._25odpnh._20Eh5WL',
  'settings-button': '._8jA5WLv ._26vKJrq',
  'settings': '._3Wx8FeC',
  'settings-selects': '._3Wx8FeC ._3ICAqZl',
  'settings-select-label': '.FqwavqE',
  'video-quality-list-title': '._3Wx8FeC ._3ICAqZl:first-of-type .FqwavqE',
  'video-quality-items': '._3Wx8FeC ._3ICAqZl:nth-of-type(n + 2)',
  'video-quality-label': '.FqwavqE',
};

/**
 * Label of list select for video quality.
 * Note: only in Russian currently.
 */
const VIDEO_QUALITY_SELECT_LABEL = 'Качество';

// Helper functions
const query = (selectorName, parent = document) => parent.querySelector(selectors[selectorName]);
const queryAll = (selectorName, parent = document) => parent.querySelectorAll(selectors[selectorName]);
const matches = (elem, selectorName) => elem.matches(selectors[selectorName]);

const lock = (fn) => {
  let isLocked = false;
  const unlock = () => {
    isLocked = false;
  };

  return () => {
    if (isLocked) {
      return;
    }
    isLocked = true;
    fn(unlock);
  };
};

/**
 * States of userscript algorithm
 */
const states = {
  start: () => 'openSettings',

  openSettings: () => {
    // TODO: Hide settings popup
    const settingsButton = query('settings-button');
    if (!settingsButton) {
      return 'openSettings';
    }

    const settings = query('settings');
    if (!settings) {
      settingsButton.click();
    }
    return 'openVideoQualityList';
  },

  openVideoQualityList: () => {
    const settingsSelects = queryAll('settings-selects');
    const videoQualitySelect = Array.from(settingsSelects).find(select => {
      const label = query('settings-select-label', select).textContent;
      return label === VIDEO_QUALITY_SELECT_LABEL;
    });

    if (videoQualitySelect) {
      videoQualitySelect.click();
    }
    return videoQualitySelect ? 'selectRequiredVideoQuality' : 'openVideoQualityList';
  },

  selectRequiredVideoQuality: () => {
    const listTitle = query('video-quality-list-title');
    const isLoaded = listTitle.textContent === VIDEO_QUALITY_SELECT_LABEL;
    if (!isLoaded) {
      return 'selectRequiredVideoQuality';
    }

    const videoQualityItems = queryAll('video-quality-items');
    // TODO: Add user preferences for quality.
    const favoriteQuality = 720;
    const videoQualityItem = Array.from(videoQualityItems).find(item => {
      const label = query('video-quality-label', item);
      const currentQuality = parseInt(label.textContent);
      return currentQuality <= favoriteQuality;
    });

    videoQualityItem.click();
    return 'closeSettings';
  },

  closeSettings: () => 'end',
};

/**
 * Update current video quality.
 */
const updateVideoQuality = (unlock) => {
  let state = 'start';

  const settingsObserver = new MutationObserver(() => {
    state = states[state]();
    if (state === 'end') {
      unlock();
      settingsObserver.disconnect();
    }
  });

  settingsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

/**
 * Lock the function because MutationObserver can call function multiple times.
 */
const lockedUpdateVideoQuality = lock(updateVideoQuality);

const observer = new MutationObserver((records) => {
  const isPlayerChanged = records.reduce((isPlayer, record) => {
    // TODO: Refactor this
    const isCurrentPlayer = matches(record.target, 'player');
    const isChanged = (record.attributeName === 'src') && (record.target.getAttribute('src') !== null);
    return isPlayer || (isCurrentPlayer && isChanged);
  }, false);

  if (!isPlayerChanged) {
    return;
  }

  lockedUpdateVideoQuality();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
