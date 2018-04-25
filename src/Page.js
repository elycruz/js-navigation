import {defineEnumProps} from 'fjl-mutable';
import {assignDeep} from 'fjl';

export default class Page {
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
            [Object, 'pages'],
            [Map,    '_pagesMap', new Map()]
        ], this);
        assignDeep(props);
    }
}
