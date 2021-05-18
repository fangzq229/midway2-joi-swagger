"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerJSON = exports.addToApiObject = exports.addToApiGroup = exports.apiObjects = void 0;
var swagger_template_1 = require("./swagger-template");
var j2s = require('joi-to-swagger');
exports.apiObjects = {};
/**
 * 根据类（controller） 生成swagger对象
 * @param paramIn
 * @param method
 */
var addToApiGroup = function (paramIn) {
    Object.keys(exports.apiObjects)
        .filter(function (p) { return p.split('|')[0] === paramIn.api; })
        .forEach(function (p) {
        exports.apiObjects[p].path = ("" + paramIn.path + exports.apiObjects[p].path).replace('//', '/');
        paramIn.description && (exports.apiObjects[p].tags = [paramIn.description]);
    });
};
exports.addToApiGroup = addToApiGroup;
/**
 * 根据方法（api） 生成swagger对象
 * @param paramIn
 * @param method
 */
var addToApiObject = function (paramIn, method) {
    var key = paramIn.api + "|" + method + "-" + paramIn.path.replace('/', '_');
    if (!exports.apiObjects[key]) {
        exports.apiObjects[key] = {};
    }
    Object.assign(exports.apiObjects[key], {
        api: paramIn.api,
        tags: [paramIn.api],
        method: method,
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
exports.addToApiObject = addToApiObject;
/**
 * 拼接swagger json
 * @param options
 * @param apiObjects
 */
var swaggerJSON = function (options, apiObjects) {
    var _a = options.title, title = _a === void 0 ? 'API DOC' : _a, _b = options.description, description = _b === void 0 ? 'API DOC' : _b, _c = options.version, version = _c === void 0 ? '1.0.0' : _c, _d = options.prefix, prefix = _d === void 0 ? '' : _d, _e = options.swaggerOptions, swaggerOptions = _e === void 0 ? {} : _e;
    var resultJSON = swagger_template_1.default(title, description, version, swaggerOptions);
    for (var k in apiObjects) {
        var value = apiObjects[k];
        var method = value.method;
        var path = value.path;
        path = ("" + prefix + path).replace('//', '/');
        var summary = value.summary || '';
        var apiDescription = value.description || value.summary;
        var responses = {
            200: value.responses || { description: 'success' },
        };
        var _f = value.query, query = _f === void 0 ? [] : _f, _g = value.pathParams, pathParams = _g === void 0 ? [] : _g, _h = value.body, body = _h === void 0 ? [] : _h, tags = value.tags, _j = value.formData, formData = _j === void 0 ? [] : _j, security = value.security;
        var parameters = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], pathParams), query), formData), body);
        if (!resultJSON.paths[path]) {
            resultJSON.paths[path] = {};
        }
        // add content type [multipart/form-data] to support file upload
        var consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;
        resultJSON.paths[path][method] = {
            consumes: consumes,
            summary: summary,
            description: apiDescription,
            parameters: parameters,
            responses: responses,
            tags: tags,
            security: security,
        };
    }
    return resultJSON;
};
exports.swaggerJSON = swaggerJSON;
// body 参数 swagger json 化
var _paramsBody = function (parameters) {
    if (!parameters) {
        return undefined;
    }
    var swagger = j2s(parameters).swagger;
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
var _paramsList = function (parameters, type) {
    if (!parameters) {
        return undefined;
    }
    var swagger = j2s(parameters).swagger;
    return Object.keys(swagger.properties).map(function (p) {
        var obj = __assign(__assign({}, swagger.properties[p]), { name: p, in: type, required: swagger.required ? swagger.required.includes(p) : false });
        if (swagger.properties[p].example &&
            swagger.properties[p].example === 'file') {
            Object.assign(obj, { type: 'file' });
        }
        return obj;
    });
};
// 请求 responsesBody swagger json 化
var _responsesBody = function (body) {
    if (!body) {
        return undefined;
    }
    var swagger = j2s(body).swagger;
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
var _auth = function (auth) {
    var _a;
    if (!auth) {
        // 获取默认
        return [];
    }
    if (Array.isArray(auth) && auth.length > 0) {
        var result_1 = {};
        __spreadArray([], auth).forEach(function (p) {
            result_1[p] = [];
        });
        return result_1;
    }
    return [
        (_a = {},
            _a[auth] = [],
            _a),
    ];
};
