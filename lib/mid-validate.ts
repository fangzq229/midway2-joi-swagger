import * as joi from "joi";

/*
 * joi参数校验处理
 */
const validate = (schemaList: Array<{ ctxkey: string; schemas: any }>): any => {
  return async (ctx: any, next: () => Promise<any>) => {
    try {
      for (const p of schemaList) {
        const param = p.ctxkey.includes("body")
          ? ctx.request.body
          : ctx[p.ctxkey];
        if (!param) {
          continue;
        }
        joi.assert(param, p.schemas);
        // query 参数 number 类型格式化
        const joiArr = p.schemas?.$_terms?.keys || [];
        for (const k in param) {
          const p1 = joiArr.find((i: any) => i.key === k);
          if (p1?.schema?.type === "number") {
            param[k] = Number(param[k]);
          }
        }
      }
    } catch (error) {
      const e = error.details ? error.details[0]?.message : "parameter error";
      return ctx.throw(422, e);
    }
    await next();
  };
};
export default validate;
