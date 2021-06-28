# midway2-joi-swagger

基于 midway-joi-swagger2 升级修改，项目地址 [https://www.npmjs.com/package/midway-joi-swagger2](https://www.npmjs.com/package/midway-joi-swagger2)

适用于**midway 2.0** 版本

集成 joi 和 swagger，支持自动生成 swagger 和 支持joi参数校验，支持环境配置启停swagger文档，支持Get参数Number类型自动格式化，支持swagger单文件上传

依赖 joi-to-swagger 包 [https://www.npmjs.com/package/joi-to-swagger](https://www.npmjs.com/package/joi-to-swagger)

joi 文档地址 [https://joi.dev/api/?v=17.4.0](https://joi.dev/api/?v=17.4.0)


## 安装

```
yarn add midway2-joi-swagger

npm install midway2-joi-swagger
```

## 使用

###  默认配置修改 config.default.ts 文件

```

// swagger 配置
config.joiSwagger = {
title: 'API DOC',
version: 'v1.0.0',
description: 'TEST',
swaggerOptions: {
	  securityDefinitions: {
	    apikey: {
	      type: 'apiKey',
	      name: 'token',
	      in: 'header',
	    },
	  },
	},
};

// 配置是否生成 swagger  默认false  (*建议只在dev环境生成*)
 config.swagger = true; // 开启生产swagger
 
 // 关闭 CSRF 攻击 防范 ( *只在dev环境关闭* ) 
 config.security = {
    csrf: {
      enable: false,
    },
  };
```

### 修改 configuration.ts 文件（不存在则创建）

```
import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application } from 'egg';
import { wrapper } from 'midway2-joi-swagger';

@Configuration()
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: Application;

  async onReady(container: IMidwayContainer): Promise<void> {
    // 添加如下代码
    wrapper(this.app, this.app.config.joiSwagger);
  }
}
```

### 在 controller 中使用

```
import * as joi from 'joi';
import { Inject, Provide } from '@midwayjs/decorator';
import { Context } from 'egg';
import {
  SwaggerJoiController as Sjc,
  SwaggerJoiPost as Sjp,
  SwaggerJoiDel as Sjd,
  SwaggerJoiPut as Sjt,
  SwaggerJoiGet as Sjg,
} from 'midway2-joi-swagger';

@Provide()
@Sjc({
  api: 'api',
  path: '/api',
  description: '测试',
})
export class TestController {
  @Inject()
  ctx: Context;

  @Sjg({
    api: 'api',
    path: '/list',
    summary: 'list',
    routerOptions: { middleware: [] },  // 自定义中间件
    query: joi.object().keys({
      search: joi.string().max(20).description('搜索'),
    }),
    pathParams: joi.object().keys({
      search: joi.string().description('搜索'),
    }),
    responses: joi.object().keys({
      search: joi.string().max(20).description('搜索'),
    }),
    description: '获取列表',
  })
  async getUser(ctx): Promise<void> {
    ctx.body = ctx.query;
  }

  @Sjp({
    api: 'api',
    path: '/add',
    summary: 'add',
    body: joi.object().keys({
      name: joi.string().max(20).min(6).description('名称'),
    }),
    responses: joi.object().keys({ id: joi.number().description('id') }),
    description: '添加',
  })
  async add(ctx): Promise<void> {
    ctx.body = ctx.request.body;
  }

  @Sjp({
    api: 'api',
    path: '/upload',
    summary: 'upload',
    formData: joi.object().keys({
      file: joi.any().meta({ swaggerType: 'file' }).description('simpleFile'),
    }),
    description: '上传文件',
  })
  async upload(ctx): Promise<void> {
    ctx.body = {};
  }

  @Sjt({
    api: 'api',
    path: '/edit/{id}',
    summary: 'edit',
    body: joi.object().keys({
      name: joi.string().required().description('名称'),
    }),
    pathParams: joi.object().keys({
      id: joi.number().required().description('id'),
    }),
    responses: joi.object().keys({
      name: joi.string().required().description('名称'),
      id: joi.number().required().description('id'),
    }),
    description: '更新',
  })
  async edit(ctx): Promise<void> {
    ctx.body = { ...ctx.request.body, ...ctx.params };
  }

  @Sjd({
    api: 'api',
    path: '/del/{id}',
    summary: 'del',
    pathParams: joi.object().keys({
      id: joi.number().required().description('id'),
    }),
    responses: joi.object().keys({
      id: joi.number().required().description('id'),
    }),
    description: '删除',
  })
  async del(ctx): Promise<void> {
    ctx.body = { ...ctx.params };
  }
}

``` 

### swagger 生成效果

访问 http://127.0.0.1:7001/swagger-html



![Markdown preferences pane](https://fzq.oss-cn-beijing.aliyuncs.com/commom/WeChatc45f9ed6c833d0debb8294851f28d0fc.png)


## 新添加导出支持

```
  import { Controller, Get, Post, Del, Put } from 'midway2-joi-swagger';
```