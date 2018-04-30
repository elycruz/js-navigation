import {defineEnumProps, defineProps, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {assignDeep, instanceOf} from 'fjl';
import {PAGES_SET_INTERNAL, PAGES_GENERATED, UUID, UUID_SET} from '../../src/Symbols';
import {uuid, errorIfNotInstanceOf$} from '../../src/utils';

export const isPage = instanceOf(Page);

export default class Page {
    constructor(props) {
        if (props) {
            errorIfNotInstanceOf$(Object, this, 'props', props);
        }
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
            [String,    'type']
        ], this);

        defineProps([
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
                        this.requiresOrdering = false;
                    }
                    if (this.requiresActivityEvaluation) {
                        pages = refreshActivityOnPages(pages);
                        this.requiresActivityEvaluation = false;
                    }
                    this[PAGES_GENERATED] = pages;
                    return pages;
                },
                set: () => ({}),
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

        if (props) {
            assignDeep(props);
        }
    }
}
