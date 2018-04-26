import Page, {isPage} from '../src/Page';
import {PAGES_SET_INTERNAL, UUID, UUID_SET} from '../src/Symbols';
import {peek, log, isNumber, isSet} from 'fjl';

describe ('#Page', () => {
    const propTypeAndNameList = [[String, 'label'],
        [String, 'fragment'],
        [Object, 'htmlAttribs'],
        [Number, 'listOrder'],
        [String, 'resource'],
        [String, 'privilege'],
        [Boolean, 'active'],
        [Boolean, 'visible'],
        [String, 'type'],
        [Array, 'pages']];

    test ('should be an instance of `Page`', () => {
        expect(new Page()).toBeInstanceOf(Page);
    });
    test ('should have expected properties that only allow expected types', () => {
        propTypeAndNameList.forEach(([Type, key]) => {
            const page = new Page();
            const someValue = Type();
            expect(page.hasOwnProperty(key)).toEqual(true);
            page[key] = someValue;
            expect(page[key]).toEqual(someValue);
            expect(() => { page[key] = null; }).toThrow(Error);
        });
    });

    test ('should have `UUID`, `PAGES_SET_INTERNAL` and `UUID_SET` privately set (via symbols)', () => {
        const page = new Page();
        expect(isNumber(page[UUID])).toEqual(true);
        expect(isSet(page[PAGES_SET_INTERNAL])).toEqual(true);
        expect(isSet(page[UUID_SET])).toEqual(true);
    });

    describe ('#isPage', () => {
        test ('should return `true` when value is a `Page`', () => {
            expect(isPage(new Page())).toEqual(true);
        });
        test ('should return `false` when value is "not" a `Page`', () => {
            [[], 99, 0, {}, (() => ({}))].forEach(x =>
                expect(isPage(x)).toEqual(false)
            );
        });
    });

});

