import {Page, UriPage} from '../src/JsNavigation';
import {log, jsonClone} from 'fjl';
import * as exampleNavConfig1 from './fixtures/example-navigation-1.json';
import * as util from 'util';

describe ('#UriPage', () => {
    test ('should be an instance of `Page`', () => {
        const instance = new UriPage(exampleNavConfig1);
        // log(util.inspect(jsonClone(instance), {depth: 10}));
        expect(instance).toBeInstanceOf(Page);
    });

    test ('It\'s `type` property should be set to "uri"', () => {
        expect((new UriPage()).type).toEqual('uri');
    });

});
