import * as exampleCmsNav from './example.cms.navigation';
import {jsonClone} from "fjl";

export const provideExampleCmsNav = () => {
    return jsonClone(exampleCmsNav);
};
