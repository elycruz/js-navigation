import UriPage from '../src/UriPage';
import Page from '../src/Page';
import {log, peek, error, jsonClone} from 'fjl';
import util from 'util';

describe ('#UriPage', () => {
    test ('should be an instance of `Page`', () => {
        const instance = new UriPage({
            uri: '/hello-world',
            pages: [
                {
                    label: 'Hello World Page',
                    uri: '/hello-world-page'
                },
                {
                    label: 'Hello World Page 2',
                    uri: 'hello-world-page-2',
                    pages: [
                        {
                            label: 'Other Link',
                            uri: '/other-link'
                        }
                    ]
                }
            ]
        });

        util.inspect(jsonClone(instance), {depth: 10});

        expect(instance).toBeInstanceOf(Page);
    });
});
