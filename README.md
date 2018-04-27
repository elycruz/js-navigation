# js-navigation (WIP (pre-alpha))
A reusable javascript navigation container for use in implementing reusable navigation configurations, 
menu components, breadcrumb components, sitemap components and other components that may pertain to navigation
information (routers and the such).

## Inspiritation
The need for one-way/one-data-model to handle breadcrumbs, navigation components, sitemaps etc..,
(**see:** https://docs.zendframework.com/zend-navigation/intro/ )

## Pre-requisites
@todo

## Usage
@todo

## Target/expected usage
```
import Navigation from 'js-navigation';

const navModel = new Navigation([{
        label: 'Page 1',
        uri: '/page-1', 
        pages: [{
            label: 'Page 1-1',
            uri: '/page-1-1'
        }]
    },
    {
        label: 'Some Controller Action',
        type: 'mvc',
        controller: 'some-controller',
        action: 'action',
        params: { ... },
        pages: [ ... ]
    }
]);

console.log(navModel);

/*
Navigation {
    pages: [
        UriPage {
            label: 'Page 1',
            uri: '/page-1',
            pages: [
                UriPage {
                    label: 'Page 1-1',
                    uri: '/page-1-1'
                }
            ]
        },
        MvcPage {
            label: 'Some Controller Action',
            controller: 'some-controller'       // Could be composed into 
            action: 'action'
                                                //  '/some-controller/action' and 
                                                //  further composed to `SomeController.actionAction()`
            htmlAttribs: {...},
            params: {...},
            pages: [ ... ]
        }
    ]
}

*/

```

## Other alpha-version Considerations
- Consider making the structure more functional (mappable, foldable etc. (look into what to consider)).
@todo

## Docs
@todo 

## Development
@todo 

## Resources
- Zend/Navigation - https://docs.zendframework.com/zend-navigation/intro/

## License
BSD 3.0 

