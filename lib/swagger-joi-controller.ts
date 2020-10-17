import { Controller, Get, Post, Put, Del } from '@midwayjs/decorator';
import * as _ from 'lodash';
import { IApiObject, IMethodIn, IClassIn } from './interface';
const j2s = require('joi-to-swagger');
import validate from './mid-validate';

/**
 * used for building swagger docs object
 * 属性[controller]：[apiobject]
 */
const apiObjects = {};

/**
 * egg. /api/{id} -> /api/:id
 * @param {String} path
 */
const convertPath = (path: string) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
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
  return Object.keys(swagger.properties).map((p) => {
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
 * @param auth
 */
const _auth = (auth: string | string[]) => {
  if (!auth) {
    // 获取默认
    return [];
  }
  if (Array.isArray(auth) && auth.length > 0) {
    const result = {};
    [...auth].forEach((p) => {
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

/**
 *
 * @param target
 * @param name
 * @param apiObj
 * @param content
 */
const _addToApiObject = (key: any, apiObj: any, content: IApiObject) => {
  if (!apiObj[key]) {
    apiObj[key] = {};
  }
  Object.assign(apiObj[key], content);
};

const SwaggerJoiController = (paramIn: IClassIn): ClassDecorator => {
  Object.keys(apiObjects)
    .filter((p) => p.split('|')[0] === paramIn.api)
    .forEach((p) => {
      apiObjects[p].path = `${paramIn.path}${apiObjects[p].path}`.replace(
        '//',
        '/'
      );
      paramIn.description && (apiObjects[p].tags = [paramIn.description]);
    });

  // 组织controller
  return Controller(convertPath(paramIn.path), paramIn.routerOptions);
};

const allSet = (paramIn: IMethodIn, method: string) => {
  const key = `${paramIn.api}|${method}-${paramIn.path.replace('/', '_')}`;

  _addToApiObject(key, apiObjects, {
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
  const realPath = convertPath(paramIn.path);
  return realPath;
};

const createSchemaMiddleware = (paramIn: IMethodIn) => {
  const schemaName = [
    { sname: 'body', key: 'request.body' },
    { sname: 'pathParams', key: 'params' },
    { sname: 'query' },
    { sname: 'formData' },
  ];
  const schemaList = schemaName
    .filter((p) => paramIn[p.sname])
    .map((p) => {
      return {
        ctxkey: _.get(p, 'key', p.sname),
        schemas: paramIn[p.sname],
      };
    });

  return validate(schemaList);
};

const paramInUpdMiddeware = (paramIn: IMethodIn) => {
  const tempMidd = _.get(paramIn, 'routerOptions.middleware');
  const validateMid = createSchemaMiddleware(paramIn);
  if (_.isArray(tempMidd)) {
    _.set(paramIn, 'routerOptions.middleware', [validateMid, ...tempMidd]);
  } else if (_.isString(tempMidd)) {
    _.set(paramIn, 'routerOptions.middleware', [validateMid, tempMidd]);
  } else {
    _.set(paramIn, 'routerOptions.middleware', [validateMid]);
  }
};

const SwaggerJoiGet = (paramIn: IMethodIn) => {
  paramIn.method = 'get';
  const realPath = allSet(paramIn, 'get');
  paramInUpdMiddeware(paramIn);
  return Get(realPath, paramIn.routerOptions);
};

const SwaggerJoiPost = (paramIn: IMethodIn) => {
  paramIn.method = 'post';
  const realPath = allSet(paramIn, 'post');
  paramInUpdMiddeware(paramIn);
  return Post(realPath, paramIn.routerOptions);
};

const SwaggerJoiPut = (paramIn: IMethodIn) => {
  paramIn.method = 'put';
  const realPath = allSet(paramIn, 'put');
  paramInUpdMiddeware(paramIn);
  return Put(realPath, paramIn.routerOptions);
};

const SwaggerJoiDel = (paramIn: IMethodIn) => {
  paramIn.method = 'del';
  const realPath = allSet(paramIn, 'delete');
  paramInUpdMiddeware(paramIn);
  return Del(realPath, paramIn.routerOptions);
};

export {
  SwaggerJoiController,
  SwaggerJoiGet,
  SwaggerJoiPost,
  SwaggerJoiPut,
  SwaggerJoiDel,
  apiObjects,
};
