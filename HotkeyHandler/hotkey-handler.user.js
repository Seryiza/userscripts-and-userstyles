// ==UserScript==
// @name Hotkey Handler
// @description Library to handle keyboard hotkeys.
// @author Seryiza
// @copyright 2020, Sergey Zaborovsky (seryiza.xyz)
// @licence MIT
// @version 1.0.0
// @exclude *
// ==/UserScript==

(() => {
    const handlers = [];
    const pressedCodes = new Set();

    function handleHotkey(keyCodes, handler) {
        handlers.push({
            handler,
            keyCodes: new Set(keyCodes),
        });
    }

    function areSetsEquals(set1, set2) {
        if (set1.size !== set2.size) {
            return false;
        }

        for (let value of set1) {
            if (!set2.has(value)) {
                return false;
            }
        }
        return true;
    }

    document.addEventListener('keydown', (event) => {
        const keyCode = event.code;
        pressedCodes.add(keyCode);

        for (let {handler, keyCodes} of handlers) {
            if (areSetsEquals(keyCodes, pressedCodes)) {
                handler();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        const keyCode = event.code;
        pressedCodes.delete(keyCode);
    });

    window.handleHotkey = handleHotkey;
})()