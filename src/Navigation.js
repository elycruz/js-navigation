import {partition} from 'fjl';
import MvcPage from './MvcPage';
import UriPage from './UriPage';
import Page, {isPage} from './Page';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from './Symbols';

const

    getPageSetFor = container => container[PAGES_SET_INTERNAL],

    getUuidSetFor = container => container[UUID_SET]

;

export const

    normalizePage = page =>
        isPage(page) ? page :
            (new (page.type === 'mvc' ? MvcPage : UriPage)(page)),

    addPage = (page, container) => {
        const _page = normalizePage(page);
        getPageSetFor(container).add(_page);
        getUuidSetFor(container).add(_page[UUID]);
        return [_page, container];
    },

    addPages = (pages, container) => {
        if (pages) {
            container.pages = pages.map(page => {
                if (isPage(page)) {
                    if (page.pages) {
                        return addPages(page.pages, page);
                    }
                    return page;
                }
                const [_page] = addPage(page, container);
                if (_page.pages) {
                    addPages(_page.pages, _page);
                }
                return _page;
            });
        }
        return container;
    },

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
        s.clear().add(...partitioned);
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
        Object.defineProperty(this, 'size', {
            get: function () { return this[PAGES_SET_INTERNAL].size; },
            enumerable: true
        });
        addPages(pages, this);
    }

    addPage (page) {
        addPage(page, this);
        return this;
    }

    addPages (pages) {
       return addPages(pages, this);
    }

    findPageBy (pred) {
        return findPageBy(pred, this);
    }

    findPagesBy (pred) {
        return findPagesBy(pred, this);
    }

    findPagesByProp (key, value) {
        return findPagesByProp(key, value, this);
    }

    removePage (pageName) {
        return removePage(pageName, this);
    }

    removePages (pages) {
        return removePages(pages, this);
    }

    removePagesBy (pred) {
        return removePagesBy(pred, this);
    }

}
