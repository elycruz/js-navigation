import UriPage from '../src/UriPage';
import Page from '../src/Page';
import {log, jsonClone} from 'fjl';
import exampleNavConfig1 from './fixtures/example-navigation-1.json';
import util from 'util';

describe ('#UriPage', () => {
    const propTypeAndNameList = [
            [String, 'uri']
        ]
    ;

    test ('should be an instance of `Page`', () => {
        const instance = new UriPage(exampleNavConfig1);
        log(util.inspect(jsonClone(instance), {depth: 10}));
        expect(instance).toBeInstanceOf(Page);
    });

    test ('It\'s `type` property should be set to "uri"', () => {
        expect((new UriPage()).type).toEqual('uri');
    });

    test ('should have expected properties that only allow expected types', () => {
        propTypeAndNameList.forEach(([Type, key]) => {
            const page = new UriPage();
            const someValue = Type();
            expect(page.hasOwnProperty(key)).toEqual(true);
            page[key] = someValue;
            expect(page[key]).toEqual(someValue);
            expect(() => { page[key] = null; }).toThrow(Error);
        });
    });


});
