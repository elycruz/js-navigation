import MvcPage from '../src/MvcPage';
import Page from '../src/Page';
// import {peek, log} from 'fjl';

describe ('#MvcPage', () => {
    test ('should be an instance of `Page`', () => {
        expect(new MvcPage()).toBeInstanceOf(Page);
    });
});
