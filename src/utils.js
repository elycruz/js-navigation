import {typeOf, isString} from 'fjl';

let _uuid = 0;

export const

    uuid = () => _uuid++,

    errorIfNotInstanceOf$ = (ExpectedType, context, propName, propValue) => {
        if (propValue instanceof ExpectedType) {
            return;
        }
        const ContextName = isString(context) ? context : context.constructor.name;
        throw new Error(
            `${ContextName}.${propName} is not ` +
            `an instance of ${ExpectedType.name}.  Type received: ${typeOf(propValue)}; ` +
            `Value received: ${propValue}`
        );
    }

;
