declare interface PagePropsLike {
    active?: boolean;
    order?: number;
    parent?: PageLike;
    label?: string;
    fragment?: string;
    htmlAttribs?: object;
    resource?: string;
    privilege?: string;
    visible?: boolean;
    type?: string;
}

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

declare interface PageLike extends PagePropsLike, UriPageLike, MvcPageLike {
    requiresOrdering?: boolean;
    requiresActivityEvaluation?: boolean;
    orderChanged?: () => void;
    activeChanged?: () => void;
    pages?: PageLike[],
    size?: number;
}

declare interface PageShape extends PageLike {
    type: string;
    requiresOrdering: boolean;
    requiresActivityEvaluation: boolean;
    orderChanged: () => void;
    activeChanged: () => void;
    pages: PageLike[];
    size: number;
}

declare class PageConstructor implements PageShape {
    // PagePropsLike props
    active: boolean;
    order: number;
    label: string;
    fragment: string;
    htmlAttribs: object;
    resource: string;
    privilege: string;
    visible: boolean;
    type: string;
    parent: PageLike;

    // PageShape props
    requiresOrdering: boolean;
    requiresActivityEvaluation: boolean;
    pages: PageShape[];
    size: number;

    constructor(props?: PagePropsLike);

    orderChanged (): void;
    activeChanged (): void;
}