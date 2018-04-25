import Page from "./Page";
import {defineEnumProps$} from 'fjl-mutable';
import {assignDeep} from 'fjl';

export default class UriPage extends Page {
    constructor (props) {
        super();
        defineEnumProps$([
            [String, 'uri', '#']
        ], this);
        assignDeep(this, props);
        this.type = 'uri';
    }
}
