import {Navigation, Page, isPage, UriPage, MvcPage} from '../src/JsNavigation';
import {PAGES_SET, UUID, UUID_SET} from '../src/Symbols';
import {isNumber, isSet} from 'fjl';

describe ('#Page', () => {
    test ('should be an instance of `Page`', () => {
        expect(new Page()).toBeInstanceOf(Page);
    });

    test ('should have `UUID`, `PAGES_SET` and `UUID_SET` privately set (via symbols)', () => {
        const page = new Page();
        expect(isNumber(page[UUID])).toEqual(true);
        expect(isSet(page[PAGES_SET])).toEqual(true);
        expect(isSet(page[UUID_SET])).toEqual(true);
    });

    describe ('#isPage', () => {
        test ('should return `true` when value is a `Page`', () => {
            [new Navigation(), new Page(), new UriPage(), new MvcPage()].forEach(x => {
                expect(isPage(x)).toEqual(true);
            });
        });
        test ('should return `false` when value is "not" a `Page`', () => {
            [[], 99, 0, {}, (() => ({}))].forEach(x =>
                expect(isPage(x)).toEqual(false)
            );
        });
    });

});

