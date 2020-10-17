import { Application } from 'egg';
import { WrapperOptions } from './interface';
/**
 * swagger注册
 * @param app
 * @param options
 */
declare const wrapper: (app: Application, options?: WrapperOptions | undefined) => void;
export { wrapper };
