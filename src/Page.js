import {defineEnumProps} from 'fjl-mutable';
import {assignDeep} from 'fjl';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from './Symbols';
import {uuid} from './utils';

export const isPage = x => x instanceof Page;

export default class Page {
    static isPage (x) { return isPage(x); }
    constructor (props) {
        defineEnumProps([
            [String, 'label'],
            [String, 'fragment'],
            [Object, 'htmlAttribs'],
            [Number, 'listOrder'],
            [String, 'resource'],
            [String, 'privilege'],
            [Boolean,'active'],
            [Boolean,'visible'],
            [String, 'type'],
            [Array, 'pages']
        ], this);
        assignDeep(props);

        // Set privates
        Object.defineProperties(this, {
            [UUID]: {value: uuid()},
            [PAGES_SET_INTERNAL]: {value: new Set()}, // Set for storing a unique set of add pages.
            [UUID_SET]: {value: new Set()}            // Set for storing fast list for searching for pages.
        });

    }
}
