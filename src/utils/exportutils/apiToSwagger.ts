import i18next from 'i18next';
import {
  cloneDeep,
  concat,
  has,
  isArray,
  isEmpty,
  isEqual,
  isNumber,
  isPlainObject,
  isString,
  keys,
  sortBy,
  values,
} from 'lodash';

import { ApipostObj } from '@/types/project/export';
import { DEFAULT_AUTH } from '@/constants/apis/auth';
import { snowflakeId } from 'apipost-tools';
import { getSubstring } from '@/utils/common';
import { genUrlByQuery } from '@/utils/apis';
import { DEFAULT_API_RESPONSE, ERROR_RESPONSE, SUCCESS_RESPONSE } from '@/constants/apis/response';

type PreObject = {
  [key: string]: any;
};
export enum REQUEST_BODY_MODE_ENUM {
  NONE = 'none',
  FORM_DATA = 'form-data',
  URLENCODED = 'urlencoded',
  BINARY = 'binary',
  RAW = 'raw',
  JSON = 'json',
}

const MAX_DEEP_COUNT = 10;

const MEDIA_TYPE: any = {
  'form-data': 'multipart/form-data',
  urlencoded: 'application/x-www-form-urlencoded',
  json: 'application/json',
  xml: 'application/xml',
  javascript: 'application/javascript',
  plain: 'text/plain',
  html: 'text/html',
};

const isEqualVersion = (version: string | undefined) => {
  if (isEqual(version, '2.0')) {
    return { swagger: '2.0' };
  }
  if (isEqual(version, '3.0') || isEqual(version, '3.0.0')) {
    return { openapi: '3.0.0' };
  }
  return {};
};

const hasLength = (arr: any) => {
  return isArray(arr) && arr.length > 0;
};

export const removeQuery = (url: string) => {
  let path = url;
  try {
    const parts = url.split('?');
    path = parts[0];
  } catch (error) {
    return '/';
  }

  return path || '/';
};

const getEnvs = (envs: any[]) => {
  try {
    if (hasLength(envs)) {
      const data = envs?.reduce?.((pre, item) => {
        const servers: any = {
          url: item?.url || '',
          description: item?.name || i18next.t('global_setting.create'),
        };
        if (isPlainObject(item?.env_var_list)) {
          const variables = keys(item?.env_var_list)?.reduce((pre: PreObject, key) => {
            const variable = item.env_var_list[key];
            pre[key] = {
              default: variable?.current_value || variable?.value,
              description: variable?.description || '',
            };
            return pre;
          }, {});
          servers.variables = variables;
        }
        pre.push(servers);
        return pre;
      }, []);
      return data;
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};

const setParameter = (
  parameter: any[],
  pathItem: any,
  inType: string,
  version: string | undefined
) => {
  const queryParameters = parameter?.map((item) => {
    const parametersItem: any = {
      name: item?.key || '',
      in: inType,
      description: item?.description || '',
      required: item?.not_null === 1,
      example: item?.item?.value || '',
    };
    if (version === '2.0') {
      parametersItem['type'] = item?.field_type?.toLowerCase();
    } else {
      parametersItem['schema'] = {
        type: item?.field_type?.toLowerCase(),
      };
    }
    return parametersItem;
  });
  pathItem.parameters = concat(pathItem.parameters, queryParameters);
};

const setBodyParameter = (
  body: any,
  pathItem: any,
  version: string | undefined,
  schemaMap: PreObject
) => {
  if (version === '2.0') {
    if (
      [REQUEST_BODY_MODE_ENUM.FORM_DATA, REQUEST_BODY_MODE_ENUM.URLENCODED].includes(body?.mode)
    ) {
      const bodyParameters = body?.parameter?.map((item: any) => ({
        name: item?.key || '',
        in: 'formData',
        description: item?.description || '',
        required: item?.not_null === 1,
        example: item?.item?.value || '',
        // Here we use swagger's schema field to map field_type;
        schema: {
          type: item?.field_type?.toLowerCase(),
        },
      }));
      pathItem.parameters = concat(pathItem.parameters, bodyParameters);
    } else if ([REQUEST_BODY_MODE_ENUM.JSON].includes(body?.mode)) {
      const item = {
        in: 'body',
        name: 'body',
        description: '',
        schema: deepModelRef(body?.raw_schema || { tpye: 'object', properties: {} }, schemaMap),
        type: 'string',
        example: body?.raw || '',
      };
      pathItem.parameters = concat(pathItem.parameters, [item]);
    }
  } else {
    if (body && body?.mode) {
      if (body?.mode === REQUEST_BODY_MODE_ENUM.NONE) {
        pathItem['requestBody'] = {};
        pathItem.requestBody['content'] = {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        };
      } else if (
        [REQUEST_BODY_MODE_ENUM.FORM_DATA, REQUEST_BODY_MODE_ENUM.URLENCODED].includes(body?.mode)
      ) {
        pathItem['requestBody'] = {};
        const mode = MEDIA_TYPE[body?.mode];
        pathItem.requestBody['content'] = {
          [mode]: {
            schema: {
              type: 'object',
              properties: body?.parameter?.reduce((pre: PreObject, item: any) => {
                if (item?.key) {
                  pre[item?.key] = {
                    type: item?.field_type?.toLowerCase() || 'string',
                    example: item?.value || '',
                    description: item?.description || '',
                  };
                }
                return pre;
              }, {}),
              required: body?.parameter?.reduce((pre: any[], item: any) => {
                if (item?.not_null === 1 && item?.key) {
                  pre.push(item?.key);
                }
                return pre;
              }, []),
            },
          },
        };
      } else if ([REQUEST_BODY_MODE_ENUM.BINARY].includes(body?.mode)) {
        pathItem['requestBody'] = {};
        pathItem.requestBody['content'] = {
          'application/octet-stream': {
            schema: {
              type: 'string',
              format: 'binary',
            },
          },
        };
      } else if ([REQUEST_BODY_MODE_ENUM.JSON].includes(body?.mode)) {
        pathItem['requestBody'] = {};
        const mode = MEDIA_TYPE[body?.mode];
        pathItem.requestBody['content'] = {
          [mode]: {
            // Here we need to process the exported schema - must generate standard schema format instead of using it directly
            schema: deepModelRef(
              body?.raw_schema || {
                type: 'object',
                properties: {},
              },
              schemaMap
            ),
            example: body?.raw || '',
          },
        };
      }
    }
  }
};

const getPathItemResponse = (response: any, schemaMap: PreObject) => {
  const temp_responses: any = {};
  const example = response?.example || [];
  if (isPlainObject(response)) {
    example.forEach(({ expect, raw }: any) => {
      const code = expect?.code;
      if (isNumber(code) || isString(code)) {
        temp_responses[code] = {
          description: expect?.name || '',
          content: {
            [MEDIA_TYPE?.[expect?.content_type] || '*/*']: {
              schema: deepModelRef(expect?.schema || {}, schemaMap),
              example: raw,
            },
          },
        };
      }
    });
  }
  return temp_responses;
};

const recursiveFolderPath = (path: string, sourceObj: any, pid: string, pidName = 'pid'): any => {
  if (pid && sourceObj[pid]) {
    if (path) {
      path = `${sourceObj[pid].name}/${path}`;
    } else {
      path = sourceObj[pid].name;
    }

    if (sourceObj[pid][pidName] && sourceObj[pid][pidName] != '0')
      return recursiveFolderPath(path, sourceObj, sourceObj[pid][pidName], pidName);
    return path;
  }
  return path;
};

const getApis: any = (
  originApis: any[],
  schemaMap: PreObject,
  version: string | undefined,
  tags: any[]
) => {
  const apis = cloneDeep(originApis);
  const tagList = tags;
  if (!hasLength(apis)) {
    return [];
  }
  const paths: PreObject = {};
  const folderObj: any = {};
  const sourceObj: any = {};
  const key = 'target_id';
  const parentKey = 'parent_id';
  apis.forEach((item) => {
    sourceObj[item[key]] = item;
  });
  for (const item of apis) {
    const id = item[key];
    const pid = item[parentKey];
    if (!id || id == undefined) {
      continue;
    }
    if (item?.target_type === 'folder') {
      const path = recursiveFolderPath(`${item?.name}`, sourceObj, pid, parentKey);
      item.path = path;
      if (!has(folderObj, item?.name)) {
        tagList.push({
          name: item?.name || i18next.t('common.folder_operate.new_folder'),
          description: item?.description || '',
        });
        folderObj[item?.name] = item;
      }
    } else if (item?.target_type === 'api') {
      const pathUrl = removeQuery(item?.url);
      const method = item?.method?.toLocaleLowerCase();
      // Reuse old logic
      const path = recursiveFolderPath('', sourceObj, pid, parentKey);
      if (!has(paths, pathUrl)) {
        paths[pathUrl] = {};
      }
      item.path = path;
      if (!has(paths[pathUrl], method)) {
        // No request method for this URL yet
        const pathItem: any = {
          summary: item?.name || '',
          description: item?.description || '',
          tags: [],
          parameters: [],
        };
        if (hasLength(item?.request?.query?.parameter)) {
          setParameter(item?.request?.query?.parameter, pathItem, 'query', version);
        }
        if (hasLength(item?.request?.header?.parameter)) {
          setParameter(item?.request?.header?.parameter, pathItem, 'header', version);
        }
        if (hasLength(item?.request?.cookie?.parameter)) {
          setParameter(item?.request?.cookie?.parameter, pathItem, 'cookie', version);
        }
        setBodyParameter(item?.request?.body, pathItem, version, schemaMap);
        if (path && path.length > 0 && !pathItem.tags.includes(path)) {
          pathItem.tags.push(path);
        }
        pathItem['responses'] = getPathItemResponse(item?.response || {}, schemaMap);
        paths[pathUrl][method] = pathItem;
      } else if (path && path.length > 0 && !paths[pathUrl][method]?.tags.includes(path)) {
        paths[pathUrl][method]?.tags.push(path);
      }
    }
  }
  return {
    paths,
    tagList,
  };
};

export const deepModelRef = (
  originSchema: any,
  schemaMap: PreObject,
  startSchema?: any,
  count = 0
) => {
  try {
    let deepCount = cloneDeep(count);
    const schema = cloneDeep(originSchema);
    if (has(schema, 'ECHOAPI_REFS')) {
      const refsValue = schema?.ECHOAPI_REFS;
      if (
        !isEmpty(refsValue) &&
        Object.prototype.toString.call(schema?.properties) === '[object Object]'
      ) {
        const properties =
          Object.prototype.toString.call(schema?.properties) === '[object Object]'
            ? schema?.properties
            : {};
        schema['properties'] = values(refsValue)?.reduce((pre: PreObject, item) => {
          if (
            item?.ref &&
            has(schemaMap, item?.ref) &&
            !isEqual(startSchema || originSchema, schemaMap[item?.ref]?.schema)
          ) {
            const mapValue = schemaMap[item?.ref];
            if (mapValue && mapValue?.name) {
              let mapSchema = mapValue?.schema;
              if (has(mapValue?.schema, 'APIPOST_REFS')) {
                if (deepCount > MAX_DEEP_COUNT) {
                  mapSchema = mapValue?.schema;
                } else {
                  mapSchema = deepModelRef(
                    mapValue?.schema,
                    schemaMap,
                    startSchema || originSchema,
                    ++deepCount
                  );
                }
              }
              pre = {
                ...pre,
                ...(mapSchema?.properties || {}),
              };
            }
            if (isEqual(startSchema || originSchema, schemaMap[item?.ref]?.schema)) {
              pre = {};
            }
          }
          return pre;
        }, properties);
      }
    }
    if (
      has(schema, 'properties') &&
      Object.prototype.toString.call(schema?.properties) === '[object Object]'
    ) {
      let properties_keys = keys(schema?.properties);
      if (
        // Optimize display order
        schema?.ECHOAPI_ORDERS &&
        isArray(schema?.ECHOAPI_ORDERS) &&
        isEqual(sortBy(schema?.ECHOAPI_ORDERS), sortBy(keys(schema?.properties)))
      ) {
        properties_keys = schema?.ECHOAPI_ORDERS;
      }

      schema['properties'] = properties_keys?.reduce((pre: PreObject, key) => {
        if (key && !isEmpty(schema?.properties[key])) {
          if (deepCount > MAX_DEEP_COUNT) {
            pre[key] = schema?.properties[key];
          } else {
            pre[key] = deepModelRef(
              schema?.properties[key],
              schemaMap,
              startSchema || originSchema,
              ++deepCount
            );
          }
        }
        return pre;
      }, {});
    }
    if (schema?.type === 'array' && has(schema, 'items')) {
      if (
        has(schema?.items, 'properties') &&
        Object.prototype.toString.call(schema?.items?.properties) === '[object Object]'
      ) {
        if (deepCount <= MAX_DEEP_COUNT) {
          schema.items = deepModelRef(
            schema?.items,
            schemaMap,
            startSchema || originSchema,
            ++deepCount
          );
        }
      }
    }
    // Handle array references
    delete schema?.ECHOAPI_ORDERS;
    delete schema?.ECHOAPI_REFS;
    return schema;
  } catch (err) {
    return originSchema;
  }
};

const getModels = (models: any, schemaMap: PreObject, version: string | undefined) => {
  const childModels = models?.filter((item: any) => item?.model_type === 'model');
  if (hasLength(childModels)) {
    const schemas = values(schemaMap)?.reduce((pre: PreObject, item) => {
      if (item?.name && item?.schema) {
        pre[item?.name] = deepModelRef(item?.schema, schemaMap);
      }
      return pre;
    }, {});
    // For now, don't distinguish directory concepts - put all schemas in the schemas directory. Multi-directory generation will be added later.
    if (version === '2.0') {
      return { definitions: schemas };
    }
    if (isEqual(version, '3.0') || isEqual(version, '3.0.0')) {
      return { components: { schemas } };
    }
    return {};
  }
  return {};
};

const schemaPath = (name: any, version: string | undefined) => {
  if (version === '2.0') {
    return `#/definitions/${name}`;
  }
  return `#/components/schemas/${name}`;
};

export const apiToswagger = (data: ApipostObj, version: string | undefined) => {
  const { project, apis, envs, models } = data;
  const schemaMap = {};
  try {
    const apiInfo = getApis(apis, schemaMap, version, []);
    const versionInfo = isEqualVersion(version);
    const res = {
      info: {
        title: project?.name || i18next.t('supplement.new_imp'),
        description: project?.description || '',
        version: '1.0.0',
      },
      ...versionInfo,
      servers: versionInfo?.openapi === '3.0.0' ? getEnvs(envs) : undefined,
      paths: apiInfo?.paths || [],
      tags: [],
    };
    return {
      status: 'success',
      data: res,
      message: 'success',
    };
  } catch (err) {
    return {
      status: 'error',
      data: {},
      message: String(err),
    };
  }
};

export const ApiItemInit = (res: any, apis: any, parent_id: string = '0', project_id: string) => {
  if (isArray(apis) && apis.length) {
    apis.forEach(
      ({
        name,
        target_type,
        tags,
        url,
        method,
        description,
        response,
        request,
        children,
        mark_id,
      }) => {
        const targetItem: any = {
          target_type,
          description,
          mark_id: mark_id || '1',
          request: {
            auth: DEFAULT_AUTH,
            pre_tasks: [],
            post_tasks: [],
            header: {
              parameter: request?.header?.parameter || [],
            },
            query: {
              parameter: request?.query?.parameter || [],
            },
            cookie: {
              parameter: request?.cookie?.parameter || [],
            },
            restful: {
              parameter: request?.restful?.parameter || [],
            },
          },
          ai_expect_enable: -1,
          is_check_result: 1,
          is_socket: 1,
          is_locked: -1,
          is_force: -1,
          attribute_info: {},
          protocol: 'http/1.1',
          ai_expect: {
            list: [],
            none_math_expect_id: '1',
          },
          project_id,
          target_id: snowflakeId(),
          parent_id,
          sort: 0,
          version: 0,
          server_id: '0',
          status: 1,
          is_changed: -1,
        };
        if (target_type === 'api') {
          targetItem['name'] = getSubstring(name, 255) || i18next.t('supplement.new_api');
          targetItem['tags'] = tags || [];
          targetItem['url'] = url || '';
          targetItem['method'] = method || '';
          targetItem['request'] = {
            ...targetItem['request'],
            body: {
              mode: request?.body?.mode || 'none',
              parameter: request?.body?.parameter || [],
              raw: request?.body?.raw || '',
              raw_parameter: request?.body?.raw_parameter || [],
              raw_schema: request?.body?.raw_schema || { type: 'object' },
              binary: null,
            },
          };
          targetItem['response'] = {
            ...DEFAULT_API_RESPONSE,
            ...response,
          };
          if (!response?.example?.find((e: { example_id: string }) => e?.example_id === '2')) {
            targetItem['response']?.example.unshift(ERROR_RESPONSE);
          }
          if (!response?.example?.find((e: { example_id: string }) => e?.example_id === '1')) {
            targetItem['response']?.example.unshift(SUCCESS_RESPONSE);
          }
          // Regenerate URL from query parameters
          if (targetItem.url && isArray(targetItem?.request?.query?.parameter)) {
            const newUrl = genUrlByQuery(targetItem.url, targetItem?.request?.query?.parameter);
            targetItem.url = newUrl;
          }
          res.apis.push(targetItem);
          if (isArray(children) && children.length) {
            ApiItemInit(res, children, targetItem.target_id, project_id);
          }
        } else if (target_type === 'folder') {
          targetItem['name'] = getSubstring(name, 255) || i18next.t('supplement.new_folder');
          targetItem['request'] = {
            ...targetItem['request'],
            body: {
              parameter: request?.body?.parameter || [],
            },
          };
          res.apis.push(targetItem);
          if (isArray(children) && children.length) {
            ApiItemInit(res, children, targetItem.target_id, project_id);
          }
        }
      }
    );
  }
};

export const completionSwaggerEnv = (res: any, env: any[]) => {
  res['global']['envs'] = env?.map(({ name, env_var_list, url }: any) => ({
    env_id: snowflakeId(),
    name,
    is_private: -1,
    env_var_list: env_var_list || {},
    server_list: url
      ? [{ name: i18next.t('supplement.default_server'), server_id: '1', uri: url }]
      : undefined,
  }));
};

export const completionSwaggerApis = (res: any, apis: any, project_id: string) => {
  res['apis'] = [];
  ApiItemInit(res, apis, res?.config?.folder, project_id);
};
