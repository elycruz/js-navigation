import {defineEnumProps} from 'fjl-mutable';
import {assignDeep, isset, toArrayMap, instanceOf, compose} from 'fjl';

export const

    addPage = (pageName, page, container) => {
        if (!container._pagesMap.has(pageName)) {
            const {constructor} = container;
            container._pagesMap.set(
                pageName, !instanceOf(constructor, page) ?
                    new constructor(page) : page);
        }
        return container;
    },

    removePage = (pageName, container) => {
        if (container._pagesMap.has(pageName)) {
            container._pagesMap.delete(pageName);
        }
        return container;
    },

    findOneByProp = (prop, value, container) => {
        return !container._pagesMap ? undefined :
            Array.from(container._pagesMap.values())
                .reduce((agg, obj) => {
                    if (obj.pages) {
                        agg.push(compose(isset, findOneByProp)(prop, value, obj));
                    }
                    else if (obj[prop] === value) {
                        agg.push(obj[prop]);
                    }
                    return agg;
                }, []).shift();
    },

    findAllByProp = (prop, value, container) => {
        return !container._pagesMap ? undefined :
            Array.from(container._pagesMap.values())
                .reduce((agg, obj) => {
                    if (obj.pages) {
                        return agg.concat.apply(agg, findAllByProp(prop, value, obj));
                    }
                    else if (obj[prop] === value) {
                        agg.push(obj[prop]);
                    }
                    return agg;
                }, []);
    },

    addPagesFromObj = (pages, container) => {
        if (pages) {
            Object.keys(pages)
                .forEach(key =>
                    addPage(key, pages[key], container)
                );
        }
        return container;
    }
;

export default class Page {
    constructor (props) {
        defineEnumProps([
            [String, 'label'],
            [String, 'fragment'],
            [Object, 'htmlAttribs'],
            [Number, 'listOrder'],
            [String, 'resource'],
            [String, 'privilege'],
            [Boolean,'active'],
            [Boolean,'visible'],
            [String, 'type'],
            [Object, 'pages'],
            [Map,    '_pagesMap', new Map()]
        ], this);
        assignDeep(props);
        this.addPagesFromObj(this.pages);
    }

    findOneBy (prop, value) {
        return findOneByProp(prop, value, this);
    }

    findAllBy (prop, value) {
        return findAllByProp(prop, value, this);
    }

    addPagesFromObj (pages) {
        return addPagesFromObj(pages, this);
    }

}
