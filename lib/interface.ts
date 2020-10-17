export interface ISwaggerConfig {
  title: string;
  description: string;
  version: string;
  prefix: string;
  swaggerOptions: any;
}

export interface WrapperOptions {
  title?: string;
  description?: string;
  version?: string;
  prefix?: string;
  swaggerOptions?: any;
  swaggerJsonEndpoint?: string;
  swaggerHtmlEndpoint?: string;
  makeSwaggerRouter?: boolean;
  [param: string]: any;
  test?: boolean;
}

export interface IApiObject {
  /**
   * controllerName
   */
  api: string;
  security?: any;
  tags: string[];
  method?: string;
  path?: string;
  pathParams?: any;
  query?: any;
  body?: any;
  formData?: any;
  summary?: string;
  description?: string;
  responses?: any;
}

export interface IMethodIn {
  path: string;
  routerOptions?: {
    routerName?: string;
    middleware?: Array<any>;
  };
  pathParams?: any;
  query?: any;
  body?: any;
  formData?: any;
  api: string;
  /**
   * actionName
   */
  summary: string;
  description?: string;
  responses?: any;
  auth?: string | string[];
  method?: string;
}

export interface IClassIn {
  path: string;
  routerOptions?: { middleware: Array<any> };
  /**
   * controllerName
   */
  api: string;
  summary?: string;
  description?: string;
  /**
   * 方法说明 test
   */
  actions?: IMethodIn[];
}
