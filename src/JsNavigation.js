import {uuid, errorIfNotInstanceOf$} from './utils';
import {defineEnumProps$, defineProps$, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {toArray, instanceOf, sortOn, partition, assignDeep} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET, PAGES_GENERATED} from './Symbols';

export class Page {
    constructor(props) {
        if (props) {
            errorIfNotInstanceOf$(Object, this, 'props', props);
        }
        const _uuid = uuid();
        let _active,
            _order = _uuid,
            _parent;

        // Define enumerable properties
        defineEnumProps$([
            [String,    'label'],
            [String,    'fragment'],
            [Object,    'htmlAttribs'],
            [String,    'resource'],
            [String,    'privilege'],
            [Boolean,   'visible', true],
            [String,    'type']
        ], this);

        // Define non-enumerable properties
        defineProps$([ [Boolean,   'requiresOrdering', true] ], this);

        // `order` changed callback
        this.orderChanged = () => {
            if (this.requiresOrdering) { return; }
            this.requiresOrdering = true;
            if (this.parent) {
                this.parent.orderChanged();
            }
        };

        // `active` changed callback
        this.activeChanged = () => {
            if (this.requiresActivityEvaluation) { return; }
            this.requiresActivityEvaluation = true;
            if (this.parent) {
                this.parent.activeChanged();
            }
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
                    if (this[PAGES_GENERATED] && !this.requiresOrdering) {
                        return this[PAGES_GENERATED];
                    }
                    let pages = orderPages(getPages(this));
                    this.requiresOrdering = false;
                    this[PAGES_GENERATED] = pages;
                    return pages;
                },
                set: pages => {
                    removePages(null, this);
                    addPages(pages, this);
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
        mergePropsOnPageContainer(props, this);
        this.type = 'mvc';
    }
}

export class Navigation extends Page {
    constructor (props) {
        super(props);
        this.visible = false; // is a page but used only for structure (navContainer)
    }
}

const

    getInternalPageSet = container => container[PAGES_SET_INTERNAL],

    getInternalUuidSet = container => container[UUID_SET]
;

export const

    mergePropsOnPageContainer = (props, container) => {
        if (!props) {
            return container;
        }
        assignDeep(container, props);
        return container;
    },

    isPage = instanceOf(Page),

    normalizePage = (page, otherProps, AuxType = Page) => {
        const merged = assignDeep(page, otherProps);
        if (isPage(page)) { return merged; }
        switch (page.type) {
            case 'mvc':
                return new MvcPage(merged);
            case 'uri':
                return new UriPage(merged);
            default:
                return new AuxType(merged);
        }
    },

    addPage = (page, container, notifyOrderChange = true) => {
        errorIfNotInstanceOf$(Object, 'JsNavigation.addPage', 'page', page);
        const _page = normalizePage(page, {parent: container});
        getInternalPageSet(container).add(_page);
        getInternalUuidSet(container).add(_page[UUID]);
        if (notifyOrderChange) {
            container.orderChanged();
        }
        return [_page, container];
    },

    addPages = (pages, parent) => {
        if (!pages || !pages.length) {
            return parent;
        }
        const {size} = parent;
        pages.forEach(page => {
            const _isPage = isPage(page);
            if (_isPage && hasPage(page, parent)) {
                return;
            }
            addPage(page, parent, false);
        });
        // Items were added, notify of order change
        if (size !== parent.size) {
            parent.orderChanged();
        }
        return parent;
    },

    hasPage = (page, container) =>
        getInternalUuidSet(container).has(page[UUID]),

    removePage = (page, container) => {
        const s = getInternalPageSet(container);
        if (s.has(page)) {
            s.delete(page);
            container.orderChanged();
        }
        return container;
    },

    removePages = (pages, container) => {
        if (pages) {
            return removePagesBy(page => pages.includes(page), container);
        }
        getInternalPageSet(container).clear();
        container.orderChanged();
        return container;
    },

    removePagesBy = (pred, container) => {
        const s = getInternalPageSet(container),
            partitioned = partition(pred, Array.from(s.values()))[1];
        s.clear();
        partitioned.forEach(x => s.add(x));
        container.orderChanged();
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

    getPages = container => toArray(container[PAGES_SET_INTERNAL]),

    orderPages = sortOn(page => page.order),

    setActivePage = (activePage, container) => {
        if (!container.size || !hasPage(activePage, container)) {
            return container;
        }
        // Set all pages to 'active: false' except active page
        container.pages = container.pages.map(page => {
            if (page[UUID] !== activePage[UUID]) {
                page.active = false;
            }
            return setActivePage(activePage, page);
        });
        return container;
    }

;
