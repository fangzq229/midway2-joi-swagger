/*
 * 生成swagger json doc
 */
import { WrapperOptions } from './interface';
import createInit from './swagger-template';
import { IMethodIn, IClassIn } from './interface';
const j2s = require('joi-to-swagger');
export const apiObjects = {};

/**
 * 根据类（controller） 生成swagger对象
 * @param paramIn
 * @param method
 */
export const addToApiGroup = (paramIn: IClassIn) => {
  Object.keys(apiObjects)
    .filter(p => p.split('|')[0] === paramIn.api)
    .forEach(p => {
      apiObjects[p].path = `${paramIn.path}${apiObjects[p].path}`.replace(
        '//',
        '/'
      );
      paramIn.description && (apiObjects[p].tags = [paramIn.description]);
    });
};

/**
 * 根据方法（api） 生成swagger对象
 * @param paramIn
 * @param method
 */
export const addToApiObject = (paramIn: IMethodIn, method: any) => {
  const key = `${paramIn.api}|${method}-${paramIn.path.replace('/', '_')}`;
  if (!apiObjects[key]) {
    apiObjects[key] = {};
  }
  Object.assign(apiObjects[key], {
    api: paramIn.api,
    tags: [paramIn.api],
    method,
    path: paramIn.path,
    summary: paramIn.description,
    description: paramIn.summary,
    pathParams: _paramsList(paramIn.pathParams, 'path'),
    query: _paramsList(paramIn.query, 'query'),
    body: _paramsBody(paramIn.body),
    formData: _paramsList(paramIn.formData, 'formData'),
    security: _auth(paramIn.auth),
    responses: _responsesBody(paramIn.responses),
  });
};

/**
 * 拼接swagger json
 * @param options
 * @param apiObjects
 */
export const swaggerJSON = (options: WrapperOptions, apiObjects: any) => {
  const {
    title = 'API DOC',
    description = 'API DOC',
    version = '1.0.0',
    prefix = '',
    swaggerOptions = {},
  } = options;
  const resultJSON = createInit(title, description, version, swaggerOptions);
  for (const k in apiObjects) {
    const value = apiObjects[k];
    const { method } = value;
    let { path } = value;
    path = `${prefix}${path}`.replace('//', '/');
    const summary = value.summary || '';
    const apiDescription = value.description || value.summary;
    const responses: any = {
      200: value.responses || { description: 'success' },
    };
    const {
      query = [],
      pathParams = [],
      body = [],
      tags,
      formData = [],
      security,
    } = value;
    const parameters = [...pathParams, ...query, ...formData, ...body];
    if (!resultJSON.paths[path]) {
      resultJSON.paths[path] = {};
    }
    // add content type [multipart/form-data] to support file upload
    const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;
    resultJSON.paths[path][method] = {
      consumes,
      summary,
      description: apiDescription,
      parameters,
      responses,
      tags,
      security,
    };
  }
  return resultJSON;
};

// body 参数 swagger json 化
const _paramsBody = (parameters: any) => {
  if (!parameters) {
    return undefined;
  }
  const { swagger } = j2s(parameters);
  return [
    {
      name: 'data',
      description: 'request body',
      schema: swagger,
      in: 'body',
    },
  ];
};

// query 参数 swagger json 化
const _paramsList = (parameters: any, type: string) => {
  if (!parameters) {
    return undefined;
  }
  const { swagger } = j2s(parameters);
  return Object.keys(swagger.properties).map(p => {
    const obj = {
      ...swagger.properties[p],
      name: p,
      in: type,
      required: swagger.required ? swagger.required.includes(p) : false,
    };
    if (
      swagger.properties[p].example &&
      swagger.properties[p].example === 'file'
    ) {
      Object.assign(obj, { type: 'file' });
    }
    return obj;
  });
};

// 请求 responsesBody swagger json 化
const _responsesBody = (body: any) => {
  if (!body) {
    return undefined;
  }
  const { swagger } = j2s(body);
  return {
    name: 'data',
    description: 'response body',
    schema: swagger,
    in: 'body',
  };
};

/**
 * 权限处理
 */
const _auth = (auth: any) => {
  if (!auth) {
    // 获取默认
    return [];
  }
  if (Array.isArray(auth) && auth.length > 0) {
    const result = {};
    [...auth].forEach(p => {
      result[p] = [];
    });
    return result;
  }
  return [
    {
      [auth as string]: [],
    },
  ];
};
