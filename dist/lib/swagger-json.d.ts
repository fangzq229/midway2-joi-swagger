import { WrapperOptions } from './interface';
/**
 * 配凑swagger json
 * @param options
 * @param apiObjects
 */
declare const swaggerJSON: (options: WrapperOptions, apiObjects: any) => {
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
export default swaggerJSON;
