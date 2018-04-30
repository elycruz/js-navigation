import {log, jsonClone} from 'fjl';
import {Navigation, Page, UriPage, normalizePage, addPage, addPages} from '../src/JsNavigation';
import * as exampleNavConfig from './fixtures/example.cms.navigation.json';
import {inspect} from 'util';

describe ('#Navigation', () => {
    test ('should be an instance of `Navigation`', () => {
        expect(new Navigation()).toBeInstanceOf(Navigation);
    });

    test ('should be an instance of `Page`', () => {
        expect(new Navigation()).toBeInstanceOf(Page);
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

    describe ('#addPage', () => {
        const pageInfo = {
                uri: '/hello/world'
            },
            nav = new Navigation(),
            [returnedPage, returnedNav] = addPage(pageInfo, nav);

        it ('should return a [page, container] tuple', () => {
            expect(returnedPage).toBeInstanceOf(Page);
            expect(returnedNav).toEqual(nav);
            expect(returnedNav.size).toEqual(1);
        });

        it ('should not add pages that are already added', () => {
            addPage(returnedPage, returnedNav);
            expect(returnedNav.size).toEqual(1);
        });

        it ('should throw an error when receiving non-object type values', () => {
            expect(() => addPage(99, returnedNav)).toThrow(Error);
        });
        it ('should throw an error when receiving non `Page` (container) for`container` argument', () => {
            const page = new UriPage();
            [99, true, false, undefined, null, -1, (() => (undefined)), []]
                .forEach(container =>
                    expect(() => addPage(page, container)).toThrow(Error)
                );
        });
    });

    describe ('#addPages', () => {
        it ('should add pages passed in and return `container` after doing so', () => {
            const nav = new Navigation();
            const result = addPages(exampleNavConfig.pages, nav);

            expect(result.size).toEqual(exampleNavConfig.pages.length);
            expect(result).toBeInstanceOf(Navigation);
            expect(result).toBeInstanceOf(Page);

            log(inspect(jsonClone(result.pages), {depth: 10}));
        });

    });

});
