import { wrapper } from "./lib/wrapper";
import {
  SwaggerJoiController,
  SwaggerJoiGet,
  SwaggerJoiPost,
  SwaggerJoiPut,
  SwaggerJoiDel,
} from "./lib/swagger-joi-controller";
import { ISwaggerConfig } from "./lib/interface";
const Controller = SwaggerJoiController;
const Get = SwaggerJoiGet;
const Post = SwaggerJoiPost;
const Del = SwaggerJoiDel;
const Put = SwaggerJoiPut;
export {
  wrapper,
  Controller,
  Get,
  Post,
  Del,
  Put,
  SwaggerJoiController,
  SwaggerJoiGet,
  SwaggerJoiPost,
  SwaggerJoiPut,
  SwaggerJoiDel,
  ISwaggerConfig,
};
