import {defineEnumProps, errorIfNotTypeOnTarget$} from 'fjl-mutable';
import {assignDeep} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from './Symbols';
import {uuid} from './utils';

export const

    isPage = x => x instanceof Page,

    UUID_AND_ORDER_MAP = Symbol('uuid_and_order_map')

;

export default class Page {
    constructor (props) {
        let _order;
        defineEnumProps([
            [String, 'label'],
            [String, 'fragment'],
            [Object, 'htmlAttribs'],
            [String, 'resource'],
            [String, 'privilege'],
            [Boolean,'active'],
            [Boolean,'visible'],
            [String, 'type'],
            [Array, 'pages'],
            [Page, 'parent']
        ], this);

        this.propChanged = () => (undefined);

        Object.defineProperties(this, {
            order: {
                get: () => _order,
                set: x => {
                    errorIfNotTypeOnTarget$(Number, this, 'order', x);
                    _order = x;
                    this.dispatchPropChanged('order');
                },
                enumerable: true
            },
            [UUID]: {value: uuid()},
            [PAGES_SET_INTERNAL]: {value: new Set()}, // Set for storing a unique set of add pages.
            [UUID_SET]: {value: new Set()},            // Set for storing fast list for searching for pages.
            [UUID_AND_ORDER_MAP]: {value: new Map()}            // Set for storing fast list for searching for pages.
        });

        assignDeep(props);
    }

    onPropChanged (e) {
        if (e.detail.propName === 'order' && this.parent) {
            if (this.parent.setNeedsOrdering) {
                this.parent.setNeedsOrdering();
            }
        }
        this.propChanged(e);
    }

    dispatchPropChanged (propName) {
        this.onPropChanged({
            detail: {
                propName: propName,
                propValue: this[propName]
            }
        });
    }

}
