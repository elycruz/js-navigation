import Navigation, {normalizePage} from '../src/Navigation';
import Page from '../src/Page';
import {isNumber} from 'fjl';

describe ('#Navigation', () => {
    test ('should be an instance of `Navigation`', () => {
        expect(new Navigation()).toBeInstanceOf(Navigation);
    });
    test ('should be an instance of `Page`', () => {
        expect(new Navigation()).toBeInstanceOf(Page);
    });
    test ('It should have a read-only `size` property which returns a number', () => {
        expect(isNumber((new Navigation()).size)).toEqual(true);
    });

    describe ('#normalizePage', () => {
        test ('should return an instance of `Page` whether or not the incoming value is an instance of `Page`', () => {
            expect(normalizePage({})).toBeInstanceOf(Page);
        });
        test ('should return an object which has all incoming values on the outgoing object', () => {
            const subj = {
                reactComponentPath: './components/SomeReactComponent',
                order: 99,
                uri: '/hello-world'
            },
            result = normalizePage(subj);
            expect(result).toBeInstanceOf(Page);
            Object.keys(subj).forEach(key => {
                expect(result[key]).toEqual(subj[key]);
            });
        });
    });
});
