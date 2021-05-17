// ==UserScript==
// @name        PiP by hotkey 
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Sergey Zaborovsky
// @description Enable picture in picture by hotkey.
// 
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// ==/UserScript==

const enablePiP = (video) => video.requestPictureInPicture();

const findActiveVideo = (root) => {
  const videos = Array.from(root.querySelectorAll('video'));
  const [activeVideo] = videos.filter(video => !video.paused);
  return activeVideo;
};

VM.shortcut.register('alt-b', () => {
  const selectedVideo = findActiveVideo(document);
  enablePiP(selectedVideo);
});
