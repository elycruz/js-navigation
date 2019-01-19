import {uuid} from "./utils";
import {instanceOf, sortOn, partition, assignDeep} from 'fjl';
import {PAGES_SET, UUID, UUID_SET, PAGES_GENERATED} from './Symbols';

export class Page implements PageShape {
    // PagePropsLike props
    active: boolean;
    order: number;
    label: string;
    fragment: string;
    htmlAttribs: object;
    resource: string;
    privilege: string;
    visible: boolean = true;
    type: string;
    parent: Page;

    // PageShape props
    requiresOrdering: boolean = true;
    requiresActivityEvaluation: boolean = false;
    size: number;

    constructor(props?: PageLike) {
        const _uuid = uuid();

        let _active = false,
            _order;

        // Define "special case" properties
        Object.defineProperties(this, {
            active: {
                get: () => _active,
                set: (x: boolean) => {
                    _active = x;
                    this.activeChanged();
                },
                enumerable: true
            },
            order: {
                get: () => _order,
                set: (x: boolean) => {
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
                    let pages = orderPages(Array.from(this[PAGES_SET]));
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
                get: function () { return this[PAGES_SET].size; }
            },
            [UUID]: {value: _uuid},
            [PAGES_SET]: {value: new Set()}, // Set for storing a unique set of add pages.
            [UUID_SET]: {value: new Set()}            // Set for storing fast list for searching for pages.
        });

        // Merge props only if `props`
        assignDeep(this, props);
    }

    orderChanged () {
        if (this.requiresOrdering) { return; }
        this.requiresOrdering = true;
        if (this.parent) {
            this.parent.orderChanged();
        }
    }

    activeChanged () {
        if (this.requiresActivityEvaluation) { return; }
        this.requiresActivityEvaluation = true;
        if (this.parent) {
            this.parent.activeChanged();
        }
    }
}

export class UriPage extends Page {
    uri = '#';
    constructor (props?: PageLike) {
        super(props);
        this.type = 'uri';
    }
}

export class MvcPage extends Page {
    action = 'index';
    controller = 'index';
    params: object;
    route: object;
    routeMatch: object;
    useRouteMatch = false;
    router: object;
    constructor (props?: PageLike) {
        super(props);
        this.type = 'mvc';
    }
}

export class Navigation extends Page {
    constructor (props?: PageLike) {
        super(props);
        this.visible = false; // is a page but used only for structure (navContainer)
    }
}

export const

    isPage: (any) => boolean = instanceOf(Page),

    normalizePage = (page: PageLike, otherProps?: PagePropsLike, AuxiliaryType = Page) => {
        const merged = assignDeep(page, otherProps);
        if (isPage(page)) { return merged; }
        switch (page.type) {
            case 'mvc':
                return new MvcPage(merged);
            case 'uri':
                return new UriPage(merged);
            default:
                return new AuxiliaryType(merged);
        }
    },

    addPage = (page: PageLike, container: PageLike): [PageLike, PageLike] => {
        const _page = normalizePage(page, {parent: container});
        container[PAGES_SET].add(_page);
        container[UUID_SET].add(_page[UUID]);
        return [_page, container];
    },

    addPages = (pages: PageLike[], parent: PageLike): PageLike => {
        if (!pages || !pages.length) {
            return parent;
        }
        pages.forEach(page => {
            const _isPage = isPage(page);
            if (_isPage && hasPage(page, parent)) {
                return;
            }
            addPage(page, parent);
        });
        return parent;
    },

    hasPage = (page: PageLike, container: PageLike): boolean =>
        container[UUID_SET].has(page[UUID]),

    removePage = (page: PageLike, container: PageLike): PageLike => {
        if (hasPage(page, container)) {
            container[PAGES_SET].delete(page);
            container.orderChanged();
        }
        return container;
    },

    removePages = (pages: PageLike[], container: PageLike): PageLike => {
        if (pages) {
            return removePagesBy(page => pages.indexOf(page) > -1, container);
        }
        container[PAGES_SET].clear();
        container.orderChanged();
        return container;
    },

    removePagesBy = (pred, container) => {
        const s = container[PAGES_SET],
            partitioned = partition(pred, Array.from(s))[1];
        s.clear();
        partitioned.forEach(x => s.add(x));
        container.orderChanged();
        return container;
    },

    findPagesBy = (pred, container) =>
        Array.from(container[PAGES_SET]).filter(pred),

    findPagesByProp = (name, value, container) =>
        Array.from(container[PAGES_SET]).filter(x => x[name] === value),

    findPageBy = (pred, container) =>
        findPagesBy(pred, container).shift(),

    findPageByProp = (prop, value, container) =>
        findPagesByProp(prop, value, container).shift(),

    orderPages = sortOn(page => page.order),

    setActivePage = (activePage, container) => {
        if (!container.size || !hasPage(activePage, container)) {
            return container;
        }
        container.pages = container.pages.map(page => {
            if (page[UUID] !== activePage[UUID]) {
                page.active = false;
            }
            return setActivePage(activePage, page);
        });
        return container;
    }

;
