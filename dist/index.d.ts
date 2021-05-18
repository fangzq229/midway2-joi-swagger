import { wrapper } from "./lib/wrapper";
import { SwaggerJoiController, SwaggerJoiGet, SwaggerJoiPost, SwaggerJoiPut, SwaggerJoiDel } from "./lib/swagger-joi-controller";
import { ISwaggerConfig } from "./lib/interface";
declare const Controller: (paramIn: import("./lib/interface").IClassIn) => ClassDecorator;
declare const Get: (paramIn: import("./lib/interface").IMethodIn) => any;
declare const Post: (paramIn: import("./lib/interface").IMethodIn) => any;
declare const Del: (paramIn: import("./lib/interface").IMethodIn) => any;
declare const Put: (paramIn: import("./lib/interface").IMethodIn) => any;
export { wrapper, Controller, Get, Post, Del, Put, SwaggerJoiController, SwaggerJoiGet, SwaggerJoiPost, SwaggerJoiPut, SwaggerJoiDel, ISwaggerConfig, };
