// ==UserScript==
// @name Hide all except HTML Video
// @description Hide all elements except HTML5 Video.
// @copyright 2020, Seryiza (https://seryiza.xyz)
// @version 1.0.0
// @license MIT
// @run-at document-end
// @include *
// @require https://github.com/Seryiza/userscripts-and-userstyles/raw/master/HotkeyHandler/hotkey-handler.js
// @grant none
// ==/UserScript==

let isHided = false;

handleHotkey(['AltLeft', 'KeyH'], () => {
    toggleHiding();
});

function toggleHiding() {
    isHided = !isHided;

    if (isHided) {
        hideAllExceptVideo();
    } else {
        showAll();
    }
}

function hideAllExceptVideo() {
    document.querySelectorAll('*').forEach(hideElement);
    document.querySelectorAll('video').forEach(element => {
        let current = element;
        while (current !== null) {
            showElement(current);
            current = current.parentElement;
        }
    });
}

function showAll() {
    document.querySelectorAll('*').forEach(showElement);
}

/**
 * @param {HTMLElement} element
 */
function hideElement(element) {
    const opacity = element.style.opacity;
    element.style.opacity = opacity > 0 ? -opacity : opacity;
}

/**
 * @param {HTMLElement} element
 */
function showElement(element) {
    const opacity = element.style.opacity;
    element.style.opacity = opacity < 0 ? -opacity : opacity;
}