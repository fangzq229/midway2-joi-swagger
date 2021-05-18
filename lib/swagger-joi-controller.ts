import { Controller, Get, Post, Put, Del } from '@midwayjs/decorator';
import { IMethodIn, IClassIn } from './interface';
import { addToApiGroup, addToApiObject } from './swagger-json';
import validate from './mid-validate';

export const SwaggerJoiController = (paramIn: IClassIn): ClassDecorator => {
  // swagger json
  addToApiGroup(paramIn);
  // 组织controller
  return Controller(_convertPath(paramIn.path), paramIn.routerOptions);
};

export const SwaggerJoiGet = (paramIn: IMethodIn) => {
  paramIn.method = 'get';
  const realPath = _allSet(paramIn, 'get');
  _paramInUpdMiddeware(paramIn);
  return Get(realPath, paramIn.routerOptions);
};

export const SwaggerJoiPost = (paramIn: IMethodIn) => {
  paramIn.method = 'post';
  const realPath = _allSet(paramIn, 'post');
  _paramInUpdMiddeware(paramIn);
  return Post(realPath, paramIn.routerOptions);
};

export const SwaggerJoiPut = (paramIn: IMethodIn) => {
  paramIn.method = 'put';
  const realPath = _allSet(paramIn, 'put');
  _paramInUpdMiddeware(paramIn);
  return Put(realPath, paramIn.routerOptions);
};

export const SwaggerJoiDel = (paramIn: IMethodIn) => {
  paramIn.method = 'del';
  const realPath = _allSet(paramIn, 'delete');
  _paramInUpdMiddeware(paramIn);
  return Del(realPath, paramIn.routerOptions);
};

/**
 * 路由 path 参数转换
 * egg. /api/{id} -> /api/:id
 * @param {String} path
 */
const _convertPath = (path: string) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const _allSet = (paramIn: IMethodIn, method: string) => {
  // swagger json
  addToApiObject(paramIn, method);
  const realPath = _convertPath(paramIn.path);
  return realPath;
};

const _createSchemaMiddleware = (paramIn: IMethodIn) => {
  const schemaName = [
    { sname: 'body', key: 'request.body' },
    { sname: 'pathParams', key: 'params' },
    { sname: 'query' },
    { sname: 'formData' },
  ];
  const schemaList = schemaName
    .filter(p => paramIn[p.sname])
    .map(p => {
      return {
        ctxkey: p.key || p.sname,
        schemas: paramIn[p.sname],
      };
    });
  return validate(schemaList);
};

// 添加 Schemas 验证中间件
const _paramInUpdMiddeware = (paramIn: IMethodIn) => {
  const tempMidd = paramIn?.routerOptions?.middleware;
  const validateMid = _createSchemaMiddleware(paramIn);
  if (paramIn.routerOptions?.middleware && Array.isArray(tempMidd)) {
    paramIn.routerOptions.middleware = [validateMid, ...tempMidd];
  } else {
    paramIn.routerOptions = { middleware: [validateMid] };
  }
};
