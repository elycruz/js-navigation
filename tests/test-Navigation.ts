import {log, jsonClone} from 'fjl';
import {Navigation, Page, UriPage, MvcPage, normalizePage, addPage, addPages} from '../src/JsNavigation';
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
        it ('should construct an object of the correct type when incoming object\'s `type` property is ' +
            'set to "mvc" or "uri"', () => {
            expect(normalizePage({ type: 'mvc' })).toBeInstanceOf(MvcPage);
            expect(normalizePage({ type: 'uri' })).toBeInstanceOf(UriPage);
        });
        it ('should return an object constructed with the available/passed `AuxillaryType` constructor (3rd parameter)' +
            ' when `type` property is not set or said property is not set to one of "mvc" or "uri"', () => {
            class AbcPage extends Page {}
            expect(normalizePage({ })).toBeInstanceOf(Page); // Default `AuxType` is `Page`
            expect(normalizePage({ }, null, AbcPage)).toBeInstanceOf(AbcPage);
        });
        it ('should construct an object of the correct type with the incoming props merged in on resulting object' +
            'set to "mvc" or "uri"', () => {
            const someNavObj = new Navigation();
            (<Array<[PageLike, PageLike]>>[
                [normalizePage({type: 'mvc'}, {parent: someNavObj}), MvcPage],
                [normalizePage({type: 'uri'}, {parent: someNavObj}), UriPage]
            ])
                .forEach(([result, Type]) => {
                    expect(result).toBeInstanceOf(Type);
                    expect(result.parent).toEqual(someNavObj);
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

        it ('should set the outgoing\'s `parent` property to incoming `container`', () => {
            const [page] = addPage({label: 'New Page', uri: '/hello/world'}, nav);
            expect(page.parent).toEqual(nav);
        });
    });

    describe ('#addPages', () => {
        it ('should add pages passed in and return `container` after doing so', () => {
            const nav = new Navigation();
            const result = addPages(exampleNavConfig.pages, nav);

            expect(result.size).toEqual(exampleNavConfig.pages.length);
            expect(result).toBeInstanceOf(Navigation);
            expect(result).toBeInstanceOf(Page);

            const expectPageValues = (configPages, resultPages) => {
                configPages.forEach((p1, ind) => {
                    const resultPage = resultPages[ind];
                    Object.keys(p1)
                        .filter(key => key !== 'pages')
                        .forEach(key => expect(p1[key] === resultPage[key]).toEqual(true));
                    if (p1.pages) {
                        expectPageValues(p1.pages, resultPage.pages);
                    }
                });
            };

            expectPageValues(exampleNavConfig.pages, result.pages);
            // log(inspect(jsonClone(result.pages), {depth: 10}));
        });
    });

    describe ('#hasPage', () => {
        const container1 = {};
        [
            ['exist_in_popluted===true', ]
        ].forEach(([descr, args, expected]) => {
            it (descr, () => {

            });
        });

    });

});
