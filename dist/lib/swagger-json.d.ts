import { WrapperOptions } from './interface';
import { IMethodIn, IClassIn } from './interface';
export declare const apiObjects: {};
/**
 * 根据类（controller） 生成swagger对象
 * @param paramIn
 * @param method
 */
export declare const addToApiGroup: (paramIn: IClassIn) => void;
/**
 * 根据方法（api） 生成swagger对象
 * @param paramIn
 * @param method
 */
export declare const addToApiObject: (paramIn: IMethodIn, method: any) => void;
/**
 * 拼接swagger json
 * @param options
 * @param apiObjects
 */
export declare const swaggerJSON: (options: WrapperOptions, apiObjects: any) => {
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
