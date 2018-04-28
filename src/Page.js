import {defineEnumProps, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {assignDeep, compose} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from './Symbols';
import {uuid} from './utils';

const PAGES_GENERATED = Symbol('pages_generated');

export const

    errorIfNotInstanceOf$ = (ExpectedType, context, propName, propValue) => {
        if (propValue instanceof ExpectedType) {
            return;
        }
        const ContextName = context.constructor.name;
        throw new Error(
            `${ContextName}.${propName} is not ` +
            `an instance of ${ExpectedType.name}.  Value received: ${propValue}`
        );
    },

    isPage = x => x instanceof Page,

    getPages = container =>
        Array.from(container[PAGES_SET_INTERNAL].values()),

    orderPages = pages => pages.map(page => {

    }),

    refreshActivityOnPages = (activePage, pages) => {
        // Set all pages to 'active: false' except active page
        return pages.map();
    }

;

export default class Page {
    constructor(props) {
        const _uuid = uuid();
        let _active,
            _order = _uuid,
            _parent,
            _navContainer;
        defineEnumProps([
            [String,    'label'],
            [String,    'fragment'],
            [Object,    'htmlAttribs'],
            [String,    'resource'],
            [String,    'privilege'],
            [Boolean,   'visible'],
            [String,    'type'],
            [Boolean,   'requiresOrdering', false],
            [Boolean,   'requiresActivityEvaluation', false]
        ], this);

        // Listeners (not defined via 'definePropert(ies|y)' so we can
        // eliminate one functional call (getter/setter etc...)
        this.orderChanged = () => {
            if (this.requiresOrdering) { return; }
            this.requiresOrdering = true;
        };
        this.activeChanged = () => {
            if (this.requiresActivityEvaluation) { return; }
            this.requiresActivityEvaluation = true;
        };

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
                    }
                    if (this.requiresActivityEvaluation) {
                        pages = refreshActivityOnPages(pages);
                    }
                    this[PAGES_GENERATED] = pages;
                    return pages;
                },
                enumerable: true
            },
            size: {
                get: function () { return this[PAGES_SET_INTERNAL].size; },
                enumerable: true
            },
            parent: {
                get: () => _parent,
                set: x => {
                    errorIfNotInstanceOf$(Page, this, 'parent', x);
                    _parent = x;
                },
                enumerable: true
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

        assignDeep(props);
    }

}
