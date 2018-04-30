import {MvcPage, Page} from '../src/JsNavigation';
// import {peek, log} from 'fjl';

describe ('#MvcPage', () => {

    const propTypeAndNameList = [
        [String, 'action'],
        [String, 'controller'],
        [Object, 'params'],
        [Object, 'route'],
        [Object, 'routeMatch'],
        [Boolean,'useRouteMatch'],
        [Object, 'router']
    ];

    test ('should be an instance of `Page`', () => {
        expect(new MvcPage()).toBeInstanceOf(Page);
    });

    test ('should have expected properties that only allow expected types', () => {
        propTypeAndNameList.forEach(([Type, key]) => {
            const page = new MvcPage();
            const someValue = Type();
            expect(page.hasOwnProperty(key)).toEqual(true);
            page[key] = someValue;
            expect(page[key]).toEqual(someValue);
            expect(() => { page[key] = null; }).toThrow(Error);
        });
    });

});
