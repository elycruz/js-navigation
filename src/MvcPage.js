import Page from './Page';
import {defineEnumProps$} from 'fjl-mutable';
import {assignDeep} from 'fjl';

export default class MvcPage extends Page {
    constructor (props) {
        super();
        defineEnumProps$([
            [String, 'action', 'index'],
            [String, 'controller', 'index'],
            [Object, 'params'],
            [Object, 'route'],
            [Object, 'routeMatch'],
            [Boolean,'useRouteMatch', false],
            [Object, 'router'],
        ], this);
        assignDeep(this, props);
        this.type = 'mvc';
    }
}
