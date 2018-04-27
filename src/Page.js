import {defineEnumProps, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {assignDeep, compose} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from './Symbols';
import {uuid} from './utils';

const noop = () => (undefined);

export const

    isPage = x => x instanceof Page,

    getPages = container => [],

    orderPages = pages => [],

    refreshActivityOnPages = (activePage, pages) => {
        // Set all pages to 'active: false' except active page
    },

    UUID_AND_ORDER_MAP = Symbol('uuid_and_order_map')

;

export default class Page {
    constructor(props) {
        const _uuid = uuid();
        let _active,
            _order = _uuid;
        defineEnumProps([
            [String, 'label'],
            [String, 'fragment'],
            [Object, 'htmlAttribs'],
            [String, 'resource'],
            [String, 'privilege'],
            [Boolean, 'visible'],
            [String, 'type'],
            [Page, 'parent'],
            [Page, 'navContainer']
        ], this);

        this.orderChanged = noop;
        this.activeChanged = noop;

        Object.defineProperties(this, {
            active: {
                get: () => _active,
                set: x => {
                    errorIfNotTypeOnTarget$(Boolean, this, 'active', x);
                    _active = x;
                    this.dispatchActiveChanged();
                },
                enumerable: true
            },
            order: {
                get: () => _order,
                set: x => {
                    errorIfNotTypeOnTarget$(Number, this, 'order', x);
                    _order = x;
                    this.dispatchOrderChanged();
                },
                enumerable: true
            },
            pages: {
                get: () => compose(orderPages, refreshActivityOnPages, getPages)(this),
                enumerable: true
            },
            [UUID]: {value: _uuid},
            [PAGES_SET_INTERNAL]: {value: new Set()}, // Set for storing a unique set of add pages.
            [UUID_SET]: {value: new Set()},           // Set for storing fast list for searching for pages.
            [UUID_AND_ORDER_MAP]: {value: new Map()}  // Set for storing fast list for searching for pages.
        });

        assignDeep(props);
    }

    dispatchOrderChanged() {
        this.orderChanged({detail: {
                order: this.order,
                page: this
            }});
    }

    dispatchActiveChanged() {
        this.activeChanged({
            detail: {
                active: this.active,
                page: this
            }
        });
    }

}
