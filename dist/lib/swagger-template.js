"use strict";
/*
 * 初始化对象默认值合并
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * init swagger definitions
 */
exports.default = (function (title, description, version, options) {
    if (options === void 0) { options = {}; }
    return Object.assign({
        info: { title: title, description: description, version: version },
        paths: {},
        responses: {},
    }, {
        definitions: {},
        tags: [],
        swagger: '2.0',
        securityDefinitions: {
            Token: {
                type: 'apiKey',
                in: 'header',
                name: 'token',
            },
        },
    }, options);
});
