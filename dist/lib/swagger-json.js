"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * 生成swagger json doc
 */
var _ = require("lodash");
var swagger_template_1 = require("./swagger-template");
// const tagList = [];
/**
 * 配凑swagger json
 * @param options
 * @param apiObjects
 */
var swaggerJSON = function (options, apiObjects) {
    var _a = options.title, title = _a === void 0 ? 'API DOC' : _a, _b = options.description, description = _b === void 0 ? 'API DOC' : _b, _c = options.version, version = _c === void 0 ? '1.0.0' : _c, _d = options.prefix, prefix = _d === void 0 ? '' : _d, _e = options.swaggerOptions, swaggerOptions = _e === void 0 ? {} : _e;
    var resultJSON = swagger_template_1.default(title, description, version, swaggerOptions);
    _.chain(apiObjects)
        .forEach(function (value) {
        var method = value.method;
        var path = value.path;
        // path = getPath(prefix, path); // 根据前缀补全path
        path = ("" + prefix + path).replace('//', '/');
        var summary = _.get(value, 'summary', '');
        var apiDescription = _.get(value, 'description', summary);
        var responses = {
            200: _.get(value, 'responses', { description: 'success' }),
        };
        var _a = value.query, query = _a === void 0 ? [] : _a, _b = value.pathParams, pathParams = _b === void 0 ? [] : _b, _c = value.body, body = _c === void 0 ? [] : _c, tags = value.tags, _d = value.formData, formData = _d === void 0 ? [] : _d, security = value.security;
        var parameters = __spreadArrays(pathParams, query, formData, body);
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
        // !resultJSON.tags.includes(tags[0]) && resultJSON.tags.push(tags[0]);
    })
        .value();
    return resultJSON;
};
exports.default = swaggerJSON;
