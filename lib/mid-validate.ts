/*
 * 自定义中间件，进行校验处理
 */
import * as _ from 'lodash';
import * as joi from 'joi';

const validate = (schemaList: Array<{ ctxkey: string; schemas: any }>): any => {
  return async (ctx: any, next: () => Promise<any>) => {
    try {
      for (const p of schemaList) {
        joi.assert(_.get(ctx, p.ctxkey), p.schemas);
      }
    } catch (error) {
      return ctx.throw(422, JSON.stringify(error.message));
    }
    await next();
  };
};
export default validate;
