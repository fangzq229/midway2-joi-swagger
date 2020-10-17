/*
 * 初始化对象默认值合并
 */

/**
 * init swagger definitions
 */
export default (
  title: string,
  description: string,
  version: string,
  options = {}
) =>
  Object.assign(
    {
      info: { title, description, version },
      paths: {},
      responses: {},
    },
    {
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
    },
    options
  );
