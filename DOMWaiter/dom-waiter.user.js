// ==UserScript==
// @exclude *
// @downloadURL https://github.com/Seryiza/userscripts-and-userstyles/raw/master/DOMWaiter/dom-waiter.user.js
// @updateURL https://github.com/Seryiza/userscripts-and-userstyles/raw/master/DOMWaiter/dom-waiter.user.js
//
// ==UserLibrary==
// @name DOM Waiter
// @description DOM helper to wait HTML elements
// @copyright 2020, Sergey Zaborovsky (seryiza.xyz)
// @license MIT
// @version 1.0.0
// ==/UserLibrary==
//
// ==OpenUserJs==
// @author Seryiza
// ==/OpenUserJs==
// ==/UserScript==

/**
 * Default finder of HTML elements.
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
function findElementsFromDocument(selector) {
    return Array.from(document.querySelectorAll(selector));
}

/**
 * Check element by comparation of text content.
 *
 * @param {string} expectingText
 * @param {HTMLElement} element
 */
function checkElementByTextContent(expectingText, element) {
    return element.textContent === expectingText;
}

/**
 * Get checker function from multiple types.
 *
 * @param {function|string|undefined} checker
 */
function getCheckerFunction(checker) {
    if (checker instanceof Function) {
        return checker;
    }

    if (typeof checker === 'string') {
        return checkElementByTextContent.bind(null, checker);
    }

    return function () {
        return true;
    }
}

/**
 * Create wait function.
 *
 * @param {function} elementsFinder
 */
function Waiter(findElementsFn = findElementsFromDocument) {
    return function (selector, checker) {
        const checkerFn = getCheckerFunction(checker);
        const select = () => {
            const elements = findElementsFn(selector);
            if (elements.length === 0) {
                return;
            }

            const checkedElements = elements.filter(checkerFn);
            if (checkedElements.length === 0) {
                return;
            }

            return (checkedElements.length > 1) ? checkedElements : checkedElements[0];
        }

        const selected = select();
        if (selected) {
            return Promise.resolve(selected);
        }

        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const selected = select();
                if (selected) {
                    observer.disconnect();
                    resolve(selected);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }
}

window.Waiter = Waiter;
