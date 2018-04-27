/**
 * @module jsNavigation.Navigation
 */

import {partition} from 'fjl';
import {defineEnumProp$} from 'fjl-mutable';
import MvcPage from './MvcPage';
import UriPage from './UriPage';
import Page, {isPage} from './Page';
import {PAGES_SET_INTERNAL} from './Symbols';

const

    getPageSetFor = container => container[PAGES_SET_INTERNAL]

;

export const

    normalizePage = page =>
        isPage(page) ? page :
            (new (page.type === 'mvc' ? MvcPage : UriPage)(page)),

    addPage = (page, container) => {
        const _page = normalizePage(page);
        getPageSetFor(container).add(_page);
        return [_page, container];
    },

    addPages = (pages, container) => {
        if (!pages) {
            return container;
        }

        container.pages = pages.map(page => {
            const _isPage = isPage(page);
            if (_isPage && hasPage(page, container)) {
                return page;
            }

            if (_isPage) {
                if (!page.parent) {
                    page.parent = container;
                }
                if (page.pages) {
                    return addPages(page.pages, page);
                }
                return page;
            }

            const [_page] = addPage(page, container);

            _page.parent = container;

            if (_page.pages) {
                addPages(_page.pages, _page);
            }

            return _page;
        });
    },

    hasPage = (page, container) =>
        findPageBy(_page => _page === page, container),

    removePage = (page, container) => {
        const s = getPageSetFor(container);
        if (s.has(page)) {
            s.delete(page);
        }
        return container;
    },

    removePages = (pages, container) => {
        if (pages) {
            return removePagesBy(page => pages.includes(page), container);
        }
        getPageSetFor(container).clear();
        return container;
    },

    removePagesBy = (pred, container) => {
        const s = getPageSetFor(container),
            partitioned = partition(pred, Array.from(s.values()))[1];
        s.clear();
        partitioned.forEach(x => s.add(x));
        return container;
    },

    findPagesBy = (pred, container) => {
        const s = getPageSetFor(container);
        return !s ? undefined :
            Array.from(s.values()).filter(pred);
    },

    findPagesByProp = (name, value, container) => {
        const s = getPageSetFor(container);
        return !s ? undefined :
            Array.from(s.values())
                .filter(x => x[name] === value);
    },

    findPageBy = (pred, container) =>
        findPagesBy(pred, container).shift(),

    findPageByProp = (prop, value, container) =>
        findPagesByProp(prop, value, container).shift(),

    sortByOrdering = (ascendingBln, container) => {
        return container;
    }

;

export default class Navigation extends Page {
    constructor (pages, props) {
        super(props);
        defineEnumProp$(Boolean, 'needsOrdering', false, [this]);
        Object.defineProperty(this, 'size', {
            get: function () { return this[PAGES_SET_INTERNAL].size; },
            enumerable: true
        });
        addPages(pages, this);
    }

    setNeedsOrdering () {
        this.needsOrdering = true;
    }

}
