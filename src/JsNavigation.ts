import {uuid} from "./utils";
import {instanceOf, sortOn, partition, assignDeep, objComplement} from 'fjl';
import {PAGES_SET, UUID, UUID_SET, PAGES_GENERATED} from './Symbols';
import Constructable = jest.Constructable;

export class Page implements PageShape {
    // PagePropsLike props
    active = false;
    order: number = 0;
    visible: boolean = true;

    label?: string;
    fragment?: string;
    htmlAttribs?: object;
    resource?: string;
    privilege?: string;
    type?: string;
    parent?: PageShape;

    // PageShape props
    requiresOrdering = true;
    requiresActivityEvaluation = false;
    pages: PageShape[];
    readonly size: number;

    constructor(props?: PageLike) {
        const _uuid: number = uuid();

        let _active = false,
            _order: number;

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
                set: (x: number) => {
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
                set: (pages: PageLike[]) => {
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

    normalizePage = (page: PageLike,
                     otherProps?: PageLike | null | undefined,
                     AuxiliaryType: typeof PageConstructor = Page): PageShape => {
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

    addPage = (page: PageLike, container: PageShape): [PageShape, PageShape] => {
        const _page = normalizePage(page, {parent: container});
        container[PAGES_SET].add(_page);
        container[UUID_SET].add(_page[UUID]);
        return [_page, container];
    },

    addPages = (pages: PageLike[], parent: PageShape): PageShape => {
        if (!pages || !pages.length) {
            return parent;
        }
        pages.forEach(page => {
            if (isPage(page) && hasPage(page, parent)) {
                return;
            }
            addPage(page, parent);
        });
        return parent;
    },

    hasPage = (page: PageLike, container: PageShape): boolean =>
        container[UUID_SET].has(page[UUID]),

    removePage = (page: PageLike, container: PageShape): PageShape => {
        if (hasPage(page, container)) {
            container[PAGES_SET].delete(page);
            container.orderChanged();
        }
        return container;
    },

    removePages = (pages: PageLike[] | null | undefined, container: PageShape): PageShape => {
        if (pages) {
            return removePagesBy(page => pages.includes(page), container);
        }
        container[PAGES_SET].clear();
        container.orderChanged();
        return container;
    },

    removePagesBy = (pred, container: PageShape): PageShape => {
        const s = container[PAGES_SET],
            partitioned = partition(pred, Array.from(s))[1];
        s.clear();
        partitioned.forEach(x => s.add(x));
        container.orderChanged();
        return container;
    },

    findPagesBy = (pred: FilterPred, container: PageShape): PageShape[] =>
        <PageShape[]>Array.from(container[PAGES_SET]).filter(pred),

    findPagesByProp = (name: keyof PageShape, value: any, container: PageShape): PageShape[] =>
        findPagesBy(x => x[name] === value, container),

    findPageBy = (pred: FilterPred, container: PageShape): PageShape | undefined => {
        const ps = container.pages,
            psLen = ps.length;
        for (let i = 0; i < psLen; i += 1) {
            const p = ps[i];
            if (pred(p, i, ps)) {
                return p;
            }
        }
        return undefined;
    },

    findPageByProp = (prop: keyof PageShape, value: any, container: PageShape): PageShape | null | undefined =>
        findPagesByProp(prop, value, container).shift(),

    orderPages: (pages: PageLike[]) => PageLike[] = sortOn(page => page.order),

    setActivePage = (activePage: PageShape, container: PageShape): PageShape => {
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
