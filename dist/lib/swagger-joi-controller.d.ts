import { IMethodIn, IClassIn } from "./interface";
/**
 * used for building swagger docs object
 * 属性[controller]：[apiobject]
 */
declare const apiObjects: {};
declare const SwaggerJoiController: (paramIn: IClassIn) => ClassDecorator;
declare const SwaggerJoiGet: (paramIn: IMethodIn) => MethodDecorator;
declare const SwaggerJoiPost: (paramIn: IMethodIn) => MethodDecorator;
declare const SwaggerJoiPut: (paramIn: IMethodIn) => MethodDecorator;
declare const SwaggerJoiDel: (paramIn: IMethodIn) => MethodDecorator;
export { SwaggerJoiController, SwaggerJoiGet, SwaggerJoiPost, SwaggerJoiPut, SwaggerJoiDel, apiObjects, };
