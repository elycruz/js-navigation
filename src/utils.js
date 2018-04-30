let _uuid = 0;

export const

    uuid = () => _uuid++,

    errorIfNotInstanceOf$ = (ExpectedType, context, propName, propValue) => {
        if (propValue instanceof ExpectedType) {
            return;
        }
        const ContextName = context.constructor.name;
        throw new Error(
            `${ContextName}.${propName} is not ` +
            `an instance of ${ExpectedType.name}.  Value received: ${propValue}`
        );
    }

;
