import UriPage from '../src/UriPage';
import Page from '../src/Page';
import {log, peek, error} from 'fjl';

describe ('#UriPage', () => {
    test ('should be an instance of `Page`', () => {
        const instance = new UriPage({
            uri: '/hello-world',
            pages: {
                helloWorld: {
                    label: 'Hello World Page',
                    uri: '/hello-world-page'
                },
                helloWorld2: {
                    label: 'Hello World Page 2',
                    uri: 'hello-world-page-2',
                    pages: {
                        anotherLink: {
                            label: 'Other Link',
                            uri: '/other-link'
                        }
                    }
                }
            }
        });
        expect(instance).toBeInstanceOf(Page);
    });
});
