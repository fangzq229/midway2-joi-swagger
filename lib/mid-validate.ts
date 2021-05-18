import * as joi from 'joi';

/*
 * joi参数校验处理
 */
const validate = (schemaList: Array<{ ctxkey: string; schemas: any }>): any => {
  return async (ctx: any, next: () => Promise<any>) => {
    try {
      for (const p of schemaList) {
        const param = ctx[p.ctxkey];
        joi.assert(param, p.schemas);
        // query 参数 number 类型格式化
        const joiArr = p.schemas?.$_terms?.keys || [];
        for (const k in param) {
          const p1 = joiArr.find((i: any) => i.key === k);
          if (p1.schema?.type === 'number') {
            ctx[p.ctxkey][k] = Number(ctx[p.ctxkey][k]);
          }
        }
      }
    } catch (error) {
      return ctx.throw(422, JSON.stringify(error.message));
    }
    await next();
  };
};
export default validate;
