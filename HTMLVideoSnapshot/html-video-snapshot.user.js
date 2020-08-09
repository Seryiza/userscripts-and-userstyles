// ==UserScript==
// @name HTML Video Snapshot
// @description Take snapshot HTML5 video by hotkey.
// @copyright 2020, Seryiza (https://seryiza.xyz)
// @version 1.0.0
// @license MIT
// @run-at document-end
// @include *
// @require https://github.com/Seryiza/userscripts-and-userstyles/raw/master/HotkeyHandler/hotkey-handler.js
// @grant none
// ==/UserScript==

handleHotkey(['AltLeft', 'KeyS'], () => {
    const video = findVideo();
    const snapshot = getSnapshot(video);
    saveSnapshotAsFile(snapshot);
});

function findVideo() {
    return document.querySelector('video');
}

/**
 * @param {HTMLVideoElement} videoElement
 * @returns {string} Snapshot DataURL
 */
function getSnapshot(videoElement) {
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, width, height);
    return canvas.toDataURL('image/png', 1);
}

/**
 * @param {string} snapshot Snapshot DataURL
 */
function getFileName(snapshot) {
    return `${document.title}.png`;
}

/**
 * @param {string} snapshot Snapshot DataURL
 */
function saveSnapshotAsFile(snapshot) {
    const link = document.createElement('a');
    link.href = snapshot;
    link.download = getFileName(snapshot);
    link.click();
}