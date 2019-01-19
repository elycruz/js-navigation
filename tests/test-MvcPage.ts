import {MvcPage, Page} from '../src/JsNavigation';
// import {peek, log} from 'fjl';

describe ('#MvcPage', () => {
    test ('should be an instance of `Page`', () => {
        expect(new MvcPage()).toBeInstanceOf(Page);
    });

});
