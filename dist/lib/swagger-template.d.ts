declare const _default: (title: string, description: string, version: string, options?: {}) => {
    info: {
        title: string;
        description: string;
        version: string;
    };
    paths: {};
    responses: {};
} & {
    definitions: {};
    tags: never[];
    swagger: string;
    securityDefinitions: {
        Token: {
            type: string;
            in: string;
            name: string;
        };
    };
};
/**
 * init swagger definitions
 */
export default _default;
