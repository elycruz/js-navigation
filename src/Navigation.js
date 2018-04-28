/**
 * @module jsNavigation.Navigation
 */
import {assignDeep, partition, objComplement as complement} from 'fjl';
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
        const {orderChanged, activeChanged} = container,
            _page = normalizePage(page);
        _page.parent = container;
        _page.orderChanged = orderChanged;
        _page.activeChanged = activeChanged;
        getPageSetFor(container).add(_page);
        return [_page, container];
    },

    addPages = (pages, parent) => {
        if (!pages) {
            return parent;
        }
        pages.forEach(page => {
            const _isPage = isPage(page);
            if (_isPage && hasPage(page, parent)) {
                return page;
            }
            const [_page] = addPage(page, parent);
            if (_page.pages) {
                addPages(_page.pages, _page);
            }
        });
        return parent;
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
    constructor (props) {
        super();
        if (props) {
            assignDeep(complement({pages: null}, props)); // merge all but pages
            if (props.pages) {
                addPages(props.pages, this);
            }
        }
    }
}
