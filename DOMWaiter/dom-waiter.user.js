// ==UserScript==
// @_exclude *
//
// ==UserLibrary==
// @name DOM Waiter
// @description DOM helper to wait HTML elements
// @copyright 2021, Sergey Zaborovsky (seryiza.xyz)
// @license MIT
// @version 2.0.0
// ==/UserLibrary==
//
// ==OpenUserJs==
// @author Seryiza
// ==/OpenUserJs==
// ==/UserScript==

function observe(root, fn) {
    const observer = new MutationObserver(() => fn(observer));
    observer.observe(root, {
        childList: true,
        subtree: true,
    });
}

function anyElementsFilter(element) {
    return true;
}

function getUniqueElementsFilter() {
    const viewedElements = new WeakSet();
    return (element) => {
        const isElementNew = !viewedElements.has(element);
        if (isElementNew) {
            viewedElements.add(element);
        }
        return isElementNew;
    };
}

function select(root, selector, filterFn = anyElementsFilter) {
    const possibleElements = Array.from(root.querySelectorAll(selector));
    const filtered = possibleElements.filter((element) => filterFn(element, root));
    return filtered.length !== 0 ? filtered : null;
}

function wait(root, selector, filterFn = anyElementsFilter) {
    const preselected = select(root, selector, filterFn);
    if (preselected) {
        return Promise.resolve(preselected);
    }

    return new Promise((resolve) => {
        observe(root, (observer) => {
            const selected = select(root, selector, filterFn);
            if (selected) {
                observer.disconnect();
                resolve(selected);
            }
        });
    });
}

function waitOne(root, selector, filterFn = anyElementsFilter) {
    return wait(root, selector, filterFn)
        .then((elements) => elements[0]);
}

function apply(root, selector, filterFn, callback) {
    const uniqueFilterFn = getUniqueElementsFilter();
    const customFilterFn = (element) => filterFn(element) && uniqueFilterFn(element);

    wait(root, selector, customFilterFn)
        .then((elements) => {
            elements.map((elem) => callback(elem, root));
            
            observe(root, () => {
                const selected = select(root, selector, customFilterFn);
                if (selected) {
                    selected.map((elem) => callback(elem, root));
                }
            });
        })
}

window.wait = wait;
window.waitOne = waitOne;
window.apply = apply;