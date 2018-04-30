import {uuid, errorIfNotInstanceOf$} from './utils';
import {defineEnumProps$, defineProps$, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {toArray, instanceOf, sortOn, partition, assignDeep, objComplement as complement} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET, PAGES_GENERATED} from './Symbols';

export class Page {
    constructor(props) {
        if (props) {
            errorIfNotInstanceOf$(Object, this, 'props', props);
        }
        const _uuid = uuid();
        let _active,
            _order = _uuid,
            _parent,
            _navContainer;

        // Define enumerable properties
        defineEnumProps$([
            [String,    'label'],
            [String,    'fragment'],
            [Object,    'htmlAttribs'],
            [String,    'resource'],
            [String,    'privilege'],
            [Boolean,   'visible'],
            [String,    'type']
        ], this);

        // Define non-enumerable properties
        defineProps$([
            [Boolean,   'requiresOrdering', true],
            [Boolean,   'requiresActivityEvaluation', true]
        ], this);

        // Listeners (not defined via 'definePropert(ies|y)' so we can
        // eliminate one functional call (getter/setter etc...)
        // `order` changed callback
        this.orderChanged = () => {
            if (this.requiresOrdering) { return; }
            this.requiresOrdering = true;
        };

        // `active` changed callback
        this.activeChanged = () => {
            if (this.requiresActivityEvaluation) { return; }
            this.requiresActivityEvaluation = true;
        };

        // Define "special case" properties
        Object.defineProperties(this, {
            active: {
                get: () => _active,
                set: x => {
                    errorIfNotTypeOnTarget$(Boolean, this, 'active', x);
                    _active = x;
                    this.activeChanged();
                },
                enumerable: true
            },
            order: {
                get: () => _order,
                set: x => {
                    errorIfNotTypeOnTarget$(Number, this, 'order', x);
                    _order = x;
                    this.orderChanged();
                },
                enumerable: true
            },
            pages: {
                get: () => {
                    if (this[PAGES_GENERATED] && !this.requiresActivityEvaluation && !this.requiresOrdering) {
                        return this[PAGES_GENERATED];
                    }
                    let pages = getPages(this);
                    if (this.requiresOrdering) {
                        pages = orderPages(pages);
                        this.requiresOrdering = false;
                    }
                    // if (this.requiresActivityEvaluation) {
                    //     pages = setActivePage(pages);
                    //     this.requiresActivityEvaluation = false;
                    // }
                    this[PAGES_GENERATED] = pages;
                    return pages;
                },
                enumerable: true

            },
            size: {
                get: function () { return this[PAGES_SET_INTERNAL].size; }
            },
            parent: {
                get: () => _parent,
                set: x => {
                    errorIfNotInstanceOf$(Page, this, 'parent', x);
                    _parent = x;
                }
            },
            navContainer: {
                get: () => _navContainer,
                set: x => {
                    errorIfNotInstanceOf$(Page, this, 'navContainer', x);
                    _navContainer = x;
                },
                enumerable: true
            },
            [UUID]: {value: _uuid},
            [PAGES_SET_INTERNAL]: {value: new Set()}, // Set for storing a unique set of add pages.
            [UUID_SET]: {value: new Set()}            // Set for storing fast list for searching for pages.
        });

        // Merge props only if `props`
        mergePropsOnPageContainer(props, this);
    }
}

export class UriPage extends Page {
    constructor (props) {
        super();
        if (props) {
            errorIfNotInstanceOf$(Object, this, 'props', props);
        }
        defineEnumProps$([
            [String, 'uri', '#']
        ], this);
        assignDeep(this, props);
        mergePropsOnPageContainer(props, this);
        this.type = 'uri';
    }
}

export class MvcPage extends Page {
    constructor (props) {
        super();
        if (props) {
            errorIfNotInstanceOf$(Object, this, 'props', props);
        }
        defineEnumProps$([
            [String, 'action', 'index'],
            [String, 'controller', 'index'],
            [Object, 'params'],
            [Object, 'route'],
            [Object, 'routeMatch'],
            [Boolean,'useRouteMatch', false],
            [Object, 'router']
        ], this);
        assignDeep(this, props);
        mergePropsOnPageContainer(props, this);
        this.type = 'mvc';
    }
}

export class Navigation extends Page {}

const getInternalPageSet = container => container[PAGES_SET_INTERNAL];

export const

    mergePropsOnPageContainer = (props, container) => {
        if (!props) {
            return container;
        }
        assignDeep(complement({pages: null}, props)); // merge all but pages
        if (props.pages) {
            addPages(props.pages, container);
        }
        return container;
    },

    isPage = instanceOf(Page),

    normalizePage = page =>
        isPage(page) ? page :
            (new (page.type === 'mvc' ? MvcPage : UriPage)(page)),

    addPage = (page, container) => {
        const {orderChanged, activeChanged} = container,
            _page = normalizePage(page);
        _page.parent = container;
        _page.orderChanged = orderChanged;
        _page.activeChanged = activeChanged;
        getInternalPageSet(container).add(_page);
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
        const s = getInternalPageSet(container);
        if (s.has(page)) {
            s.delete(page);
        }
        return container;
    },

    removePages = (pages, container) => {
        if (pages) {
            return removePagesBy(page => pages.includes(page), container);
        }
        getInternalPageSet(container).clear();
        return container;
    },

    removePagesBy = (pred, container) => {
        const s = getInternalPageSet(container),
            partitioned = partition(pred, Array.from(s.values()))[1];
        s.clear();
        partitioned.forEach(x => s.add(x));
        return container;
    },

    findPagesBy = (pred, container) => {
        const s = getInternalPageSet(container);
        return !s ? undefined :
            Array.from(s.values()).filter(pred);
    },

    findPagesByProp = (name, value, container) => {
        const s = getInternalPageSet(container);
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
    },

    getPages = container => toArray(container[PAGES_SET_INTERNAL]),

    orderPages = sortOn(page => page.order),

    setActivePage = (activePage, pages) => {
        // Set all pages to 'active: false' except active page
        return pages.map(page => page);
    }

;
