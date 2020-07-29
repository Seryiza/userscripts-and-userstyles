// ==UserScript==
// @name Hotkey Handler Test
// @description Script to test Hotkey Handler library.
// @author Seryiza
// @copyright 2020, Sergey Zaborovsky (seryiza.xyz)
// @licence MIT
// @version 1.0.0
// @include https://github.com/Seryiza/userscripts-and-userstyles
// @require https://github.com/Seryiza/userscripts-and-userstyles/raw/master/HotkeyHandler/hotkey-handler.user.js
// ==/UserScript==

handleHotkey(['Control', 'm'], () => alert('Ok!'));