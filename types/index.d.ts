declare interface UriPageLike {
    uri?: string;
}

declare interface MvcPageLike {
    action?: string;
    controller?: string;
    params?: object;
    route?: object;
    routeMatch?: object;
    useRouteMatch?: boolean;
    router?: object;
}

declare interface PageLike extends UriPageLike, MvcPageLike {
    type?: string;
    active?: boolean;
    order?: number;
    parent?: PageLike;
    label?: string;
    fragment?: string;
    htmlAttribs?: object;
    resource?: string;
    privilege?: string;
    visible?: boolean;
    pages?: PageLike[]
}

declare interface PageShape extends PageLike {
    parent: PageShape;
    requiresOrdering: boolean;
    requiresActivityEvaluation: boolean;
    orderChanged(): void;
    activeChanged(): void;
    pages: PageShape[];
    readonly size: number;
}

declare class PageConstructor implements PageShape {
    // PagePropsLike props
    active: boolean;
    parent: PageShape;
    order: number;
    visible: boolean;

    type?: string;
    label?: string;
    fragment?: string;
    htmlAttribs?: object;
    resource?: string;
    privilege?: string;

    // PageShape props
    requiresOrdering: boolean;
    requiresActivityEvaluation: boolean;
    pages: PageShape[];
    readonly size: number;

    constructor(props?: PageLike);

    orderChanged (): void;
    activeChanged (): void;
}

declare type FilterPred = (any, number?, array?) => boolean;
