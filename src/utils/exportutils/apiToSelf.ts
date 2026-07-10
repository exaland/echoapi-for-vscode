import { snowflakeId } from 'apipost-tools';
import i18next from 'i18next';
import { cloneDeep, has, isArray, isEmpty, isEqual, isPlainObject, isString, keys } from 'lodash';

import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { DEFAULT_WEBSOCKET2_MESSAGE } from '@/constants/apis/request';
import { Auth } from '@/types/apis/auth';
import { ApisBaseDataItem, ExpectItem } from '@/types/apis/base';
import {
  GrpcProtos,
  GrpcProtosServices,
  GrpcProtosServicesMethods,
  IncludesInfo,
} from '@/types/apis/grpc';
import {
  ApisBaseRequestBody,
  GraphQLRequest,
  GraphQLRequestBodyQueryItem,
  SocketRequestBody,
  WebSocketRequest,
} from '@/types/apis/request';
import { BaseResponse } from '@/types/apis/response';
import { SocketDetailsData } from '@/types/apis/socket';
import { SocketServiceDetailsData } from '@/types/apis/socketService';
import { SocketIoConfig, SocketIoRequest } from '@/types/apis/socketio';
import { WebsocketConfig } from '@/types/apis/websocket';
import { MessageItem, WebSocket2Request, Websocket2Config } from '@/types/apis/websocket2';
import { EnvListItem, ServerItem } from '@/types/envManage';
import { RequestGlobalParams } from '@/types/project';
import { ApiProjectImportParams, GlobalVars } from '@/types/project/export';
import { genUrlByQuery } from '@/utils/apis';
import { getSubstring } from '@/utils/common';

export const completionServerList = (
  server_list: ServerItem[],
  serversMap: { [key: string]: string }
) => {
  if (isArray(server_list)) {
    return server_list?.map(({ name, uri, server_id, sort }) => ({
      server_id: has(serversMap, server_id) ? serversMap[server_id] : snowflakeId(),
      name,
      uri,
      sort,
    }));
  }
  return [];
};

export const completionVarList = (env_var_list: any) => {
  if (isPlainObject(env_var_list)) {
    return keys(env_var_list)?.reduce((pre: { [key: string]: any }, key) => {
      pre[key] = {
        value: env_var_list[key]?.value || '',
        current_value: env_var_list[key]?.current_value || '',
        description: env_var_list[key]?.description || '',
      };
      return pre;
    }, {});
  }
  return {};
};

export const completionGlobalVars = (
  global_vars: ApiProjectImportParams['global']['global_vars']
) => {
  if (isPlainObject(global_vars)) {
    return keys(global_vars).reduce((prev, key) => {
      if (!has(prev, key)) {
        prev[key] = global_vars[key];
      }
      return prev;
    }, {} as GlobalVars);
  }
  return {};
};

export const completionEnv = (
  envs: ApiProjectImportParams['global']['envs'],
  envMap: { [k: string]: string },
  serversMap: { [key: string]: string }
) => {
  if (isArray(envs)) {
    return envs?.map(
      ({
        name,
        env_var_list,
        is_private = -1,
        server_list,
        env_id = snowflakeId(),
        sort,
      }: EnvListItem) => {
        const newEnvId = snowflakeId();
        if (['1', '2'].includes(env_id)) {
          envMap[env_id] = env_id;
        } else {
          envMap[env_id] = newEnvId;
        }
        return {
          env_id: envMap[env_id],
          name,
          is_private,
          server_list: completionServerList(server_list, serversMap),
          env_var_list: completionVarList(env_var_list),
          sort,
        };
      }
    );
  }
  return [];
};

export const completionServers = (
  servers: ApiProjectImportParams['global']['servers'],
  serversMap: { [key: string]: string }
) => {
  if (isArray(servers)) {
    return servers.map(({ name = '', server_id = snowflakeId() }) => {
      return {
        server_id: serversMap?.[server_id] || snowflakeId(),
        name,
      };
    });
  }
  return [];
};

export const completionParameter = (parameter: RequestGlobalParams['header']['parameter']) => {
  if (isArray(parameter)) {
    return parameter.map(
      ({
        description = '',
        field_type = 'String',
        is_checked = 1,
        key = '',
        value = '',
        not_null = 1,
        schema = {},
      }) => {
        const param = {
          param_id: snowflakeId(),
          description,
          field_type,
          is_checked,
          key,
          value,
          not_null,
          schema,
        }
        return param;
      }
    );
  }
  return [];
};

export const completionBodyParameter = (parameter: ApisBaseDataItem[]) => {
  if (isArray(parameter)) {
    return parameter?.map(
      ({
        field_type = 'String',
        is_checked = 1,
        key,
        not_null = 1,
        value = '',
        description = '',
        content_type = '',
        file_name = '',
        file_base64 = '',
        schema = {},
      }) => ({
        param_id: snowflakeId(),
        field_type,
        is_checked,
        key,
        not_null,
        value,
        description,
        content_type,
        file_name,
        file_base64,
        schema,
      })
    );
  }
  return [];
};

export const completionBodyRawParameter = (raw_parameter: ApisBaseDataItem[]) => {
  if (isArray(raw_parameter)) {
    return raw_parameter?.map(
      ({
        description = '',
        field_type = 'String',
        is_checked = 1,
        key = '',
        not_null = 1,
        value = '',
      }) => ({
        param_id: snowflakeId(),
        description,
        field_type,
        is_checked,
        key,
        not_null,
        value,
      })
    );
  }
  return [];
};

export const completionTasks = (tasks: RequestGlobalParams['post_tasks']) => {
  if (isArray(tasks)) {
    return tasks?.map(({ data = '', enabled = 1, type = 'customScript', name = '' }) => ({
      data,
      enabled,
      id: snowflakeId(),
      type,
      name,
    }));
  }
  return [];
};

export const completionAuth = (
  {
    type = 'noauth',
    kv,
    bearer,
    basic,
    digest,
    hawk,
    awsv4,
    ntlm,
    edgegrid,
    oauth1,
    oauth2,
    jwt,
    asap,
  }: Auth = {},
  isGlobal: boolean
) => {
  const defaultType = isGlobal ? 'noauth' : 'inherit';
  return {
    type: type || defaultType,
    kv: {
      key: kv?.key || '',
      value: kv?.value || '',
      in: kv?.in || 'header',
    },
    bearer: {
      key: bearer?.key || '',
    },
    basic: {
      username: basic?.username || '',
      password: basic?.password || '',
    },
    digest: {
      username: digest?.username || '',
      password: digest?.password || '',
      realm: digest?.realm || '',
      nonce: digest?.nonce || '',
      algorithm: digest?.algorithm || 'MD5',
      qop: digest?.qop || '',
      nc: digest?.nc || '',
      cnonce: digest?.cnonce || '',
      opaque: digest?.opaque || '',
      disableRetryRequest: digest?.disableRetryRequest ? true : false,
    },
    hawk: {
      authId: hawk?.authId || '',
      authKey: hawk?.authKey || '',
      algorithm: hawk?.algorithm || '',
      user: hawk?.user || '',
      nonce: hawk?.nonce || '',
      extraData: hawk?.extraData || '',
      app: hawk?.app || '',
      delegation: hawk?.delegation || '',
      timestamp: hawk?.timestamp || '',
      includePayloadHash: hawk?.includePayloadHash ? true : false,
    },
    awsv4: {
      accessKey: awsv4?.accessKey || '',
      secretKey: awsv4?.secretKey || '',
      region: awsv4?.region || '',
      service: awsv4?.service || '',
      sessionToken: awsv4?.sessionToken || '',
      addAuthDataToQuery: awsv4?.addAuthDataToQuery ? true : false,
    },
    ntlm: {
      username: ntlm?.username || '',
      password: ntlm?.password || '',
      domain: ntlm?.domain || '',
      workstation: ntlm?.workstation || '',
      disableRetryRequest: ntlm?.disableRetryRequest ? true : false,
    },
    edgegrid: {
      accessToken: edgegrid?.accessToken || '',
      clientToken: edgegrid?.clientToken || '',
      clientSecret: edgegrid?.clientSecret || '',
      nonce: edgegrid?.nonce || '',
      timestamp: edgegrid?.timestamp || '',
      baseURi: edgegrid?.baseURi || '',
      headersToSign: edgegrid?.headersToSign || '',
    },
    oauth1: {
      consumerKey: oauth1?.consumerKey || '',
      consumerSecret: oauth1?.consumerSecret || '',
      signatureMethod: oauth1?.signatureMethod || '',
      addEmptyParamsToSign: oauth1?.addEmptyParamsToSign ? true : false,
      includeBodyHash: oauth1?.includeBodyHash ? true : false,
      addParamsToHeader: oauth1?.addParamsToHeader ? true : false,
      realm: oauth1?.realm || '',
      version: oauth1?.version || '',
      nonce: oauth1?.nonce || '',
      timestamp: oauth1?.timestamp || '',
      verifier: oauth1?.verifier || '',
      callback: oauth1?.callback || '',
      tokenSecret: oauth1?.tokenSecret || '',
      token: oauth1?.token || '',
      disableHeaderEncoding: oauth1?.disableHeaderEncoding ? true : false,
    },
    oauth2: {
      addTokenTo: oauth2?.addTokenTo || 'header',
      headerPrefix: oauth2?.headerPrefix || 'Bearer',
      access_token: oauth2?.access_token || '',
      grant_type: oauth2?.grant_type || 'authorization_code',
      redirect_uri: oauth2?.redirect_uri || '',
      authUrl: oauth2?.authUrl || '',
      accessTokenUrl: oauth2?.accessTokenUrl || '',
      clientId: oauth2?.clientId || '',
      clientSecret: oauth2?.clientSecret || '',
      username: oauth2?.username || '',
      password: oauth2?.password || '',
      challengeAlgorithm: oauth2?.challengeAlgorithm || 'S256',
      code_verifier: oauth2?.code_verifier || 'Bearer',
      scope: oauth2?.scope || '',
      state: oauth2?.state || '',
      client_authentication: oauth2?.client_authentication || 'header',
      refreshTokenUrl: oauth2?.refreshTokenUrl || '',
      authRequestParams: oauth2?.authRequestParams || [],
      tokenRequestParams: oauth2?.tokenRequestParams || [],
      refreshRequestParams: oauth2?.refreshRequestParams || [],
    },
    jwt: {
      addTokenTo: jwt?.addTokenTo || 'header',
      algorithm: jwt?.algorithm || 'HS256',
      secret: jwt?.secret || '',
      isSecretBase64Encoded: jwt?.isSecretBase64Encoded ? true : false,
      payload: jwt?.payload || '',
      headerPrefix: jwt?.headerPrefix || 'Bearer',
      queryParamKey: jwt?.queryParamKey || 'token',
      header: jwt?.header || '',
    },
    asap: {
      alg: asap?.alg || 'HS256',
      iss: asap?.iss || '',
      aud: asap?.aud || '',
      kid: asap?.kid || '',
      privateKey: asap?.privateKey || '',
      sub: asap?.sub || '',
      claims: asap?.claims || '',
      exp: asap?.exp || '',
    },
  };
};

export const completionGlobalParam = (global_param: RequestGlobalParams, isGlobal = false) => {
  return {
    auth: completionAuth(global_param?.auth, isGlobal),
    body: {
      parameter: completionParameter(global_param?.body?.parameter),
    },
    pre_tasks: completionTasks(global_param?.pre_tasks),
    post_tasks: completionTasks(global_param?.post_tasks),
    header: {
      parameter: completionParameter(global_param?.header?.parameter),
    },
    query: {
      parameter: completionParameter(global_param?.query?.parameter),
    },
    cookie: {
      parameter: completionParameter(global_param?.cookie?.parameter),
    },
    restful: global_param?.restful
      ? { parameter: completionParameter(global_param?.restful?.parameter) }
      : undefined,
  };
};

export const completionCodes = (codes: ApiProjectImportParams['global']['codes']) => {
  if (isArray(codes)) {
    return codes?.map(({ code_number = '', code_msg = '' }) => ({
      code_number,
      code_msg,
    }));
  }
  return [];
};

export const completionMarks = (
  marks: ApiProjectImportParams['global']['marks'],
  project_id: string
) => {
  if (isArray(marks)) {
    return marks?.map(
      ({ mark_id, name = '', color = '#2857FF', is_sys_default = 1, is_default_mark = -1 }) => ({
        mark_id: mark_id,
        project_id,
        name,
        color,
        is_sys_default,
        is_default_mark,
      })
    );
  }
  return [];
};

export const completionAttributes = (
  attributes: ApiProjectImportParams['global']['attributes'],
  project_id: string
) => {
  if (isArray(attributes)) {
    return attributes?.map(
      ({
        field_name = '',
        field_type = 1,
        enable = 1,
        tooltip = '',
        sort = 1,
        extra = [],
        open_api_field = '',
        attribute_id,
      }) => ({
        attribute_id,
        project_id,
        field_name,
        field_type,
        enable,
        tooltip,
        sort,
        extra,
        open_api_field,
      })
    );
  }
  return [];
};

export const completionCustomRules = (
  mock_custom_rules: ApiProjectImportParams['global']['mock_custom_rules'],
  project_id: string
) => {
  if (isArray(mock_custom_rules)) {
    return mock_custom_rules?.map(
      ({
        field_type = 'string',
        match_type = 'wildcard',
        match_rule = '',
        match_case = 1,
        mock_type = 1,
        mock_rule_content = '',
        intro = '',
      }) => ({
        mock_custom_rule_id: snowflakeId(),
        project_id,
        field_type,
        match_type,
        match_rule,
        match_case,
        mock_type,
        mock_rule_content,
        intro,
      })
    );
  }
  return [];
};

export const completionDbLink = (
  db_link: ApiProjectImportParams['global']['db_link'],
  project_id: string
) => {
  if (isArray(db_link)) {
    return db_link?.map(({ name = '', intro = '', type, config = null, sort = 0 }) => ({
      db_id: snowflakeId(),
      project_id,
      name,
      type,
      intro,
      config,
      sort,
    }));
  }
  return [];
};

export const completionDesLibrary = (
  describe_library: ApiProjectImportParams['global']['describe_library'],
  project_id: string
) => {
  if (isArray(describe_library)) {
    return describe_library?.map(({ key = '', description = '' }) => ({
      id: snowflakeId(),
      project_id,
      key,
      description,
    }));
  }
  return [];
};

export const completionCustomFunc = (custom_func: any) => {
  if (isArray(custom_func)) {
    return custom_func.map(({ func_name = '', func_desc = '', func_body = '' }) => ({
      func_id: snowflakeId(),
      func_name,
      func_desc,
      func_body,
    }));
  }
  return [];
};

export const recursionSchema = (schemaObj: any, modelsMap: Record<string, string>): any => {
  try {
    const schema = cloneDeep(schemaObj);
    // 1. Non-object/array - return directly
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // 2. Handle arrays (recursively process each item)
    if (Array.isArray(schema)) {
      return schema.map((item) => recursionSchema(item, modelsMap));
    }
    // 3. Handle objects (deep copy then recursively process all properties)
    for (const key in schema) {
      const value = schema[key];
      if (['ECHOAPI_REFS', 'x-schema-refs'].includes(key) && isPlainObject(value)) {
        keys(value)?.map((e) => {
          const $ref = value[e]?.$ref;
          if (has(value[e], 'ref')) {
            schema[key][e]['$ref'] = cloneDeep(modelsMap?.[value[e]['ref']]);
            delete schema[key][e]['ref'];
          } else if (has(value[e], '$ref') && $ref) {
            const refId = $ref.split('/').pop() || '';
            schema[key][e].$ref = cloneDeep(modelsMap?.[refId]);
          }
          // Recursively process refEntry
          schema[key][e] = recursionSchema(value[e], modelsMap);
        });
        schema['x-schema-refs'] = schema[key];
        delete schema['ECHOAPI_REFS'];
      } else if (['ECHOAPI_ORDERS', 'x-schema-orders'].includes(key)) {
        schema['x-schema-orders'] = value;
        delete schema['ECHOAPI_ORDERS'];
      } else if (
        (key === 'properties' || key === 'x-schema-overrides') &&
        isPlainObject(schema[key]) &&
        !isEmpty(schema[key])
      ) {
        schema[key] = keys(schema[key])?.reduce((pre: { [key: string]: any }, propertiesKey) => {
          pre[propertiesKey] = recursionSchema(schema[key][propertiesKey], modelsMap);
          return pre;
        }, {});
      } else if (key === '$ref' && isString(schema[key])) {
        // Handle direct model reference in properties
        const refId = schema[key].split('/').pop() || '';
        if (modelsMap?.[refId]) {
          schema[key] = cloneDeep(modelsMap?.[refId]);
        }
      } else {
        schema[key] = recursionSchema(value, modelsMap);
      }
    }
    return schema;
  } catch (err) {
    return schemaObj;
  }
};

export const completionModels = (
  models: ApiProjectImportParams['models'],
  modelsMap: { [key: string]: string }
) => {
  if (isArray(models)) {
    const newModels = cloneDeep(models);
    return newModels?.map(
      ({
        model_type = 'model',
        description = '',
        parent_id = '0',
        name = '',
        schema = { type: 'object', properties: {} },
        display_name = '',
        sort = 0,
        model_id,
      }) => ({
        model_id: modelsMap?.[model_id] || snowflakeId(),
        model_type,
        description,
        parent_id: modelsMap?.[parent_id] || '0',
        schema: recursionSchema(schema, modelsMap), // schema recursion
        name,
        display_name,
        sort,
      })
    );
  }
  return [];
};

export const completionBody = (body: ApisBaseRequestBody, modelsMap: { [key: string]: string }) => {
  return {
    mode: body?.mode || 'none',
    parameter: completionBodyParameter(body?.parameter || []),
    raw: body?.raw || '',
    raw_parameter: completionBodyRawParameter(body?.raw_parameter || []),
    raw_schema: recursionSchema(body?.raw_schema, modelsMap), // schema recursion
    binary: body?.binary || null,
  };
};

export const completionSocketMethodBody = (
  body: SocketRequestBody,
  modelsMap: { [key: string]: string }
) => {
  return {
    mode: body?.mode || 'xml',
    parameter: body?.parameter || [],
    raw: body?.raw || '',
    raw_parameter: body?.raw_parameter || [],
    raw_schema: recursionSchema(body?.raw_schema, modelsMap), // schema recursion
  };
};

export const completionExpect = (expect: ExpectItem, modelsMap: { [key: string]: string }) => {
  return {
    code: getSubstring(expect?.code, 128) || '',
    content_type: expect?.content_type || '',
    is_default: expect?.is_default || 1,
    mock: expect?.mock || '',
    name: getSubstring(expect?.name, 255) || '',
    verify_type: expect?.verify_type || '',
    schema: recursionSchema(expect?.schema, modelsMap), // schema recursion
  };
};

export const completionExample = (
  example: BaseResponse['example'],
  modelsMap: { [key: string]: string }
) => {
  if (isArray(example)) {
    let exampleList = cloneDeep(example);
    const successExample = example?.find((e) => e?.example_id === '1');
    const failExample = example?.find((e) => e?.example_id === '2');
    const res = [];
    if (successExample) {
      res.push({
        example_id: '1',
        raw: successExample?.raw || '',
        raw_parameter: completionBodyRawParameter(successExample?.raw_parameter),
        expect: completionExpect(successExample?.expect as ExpectItem, modelsMap),
        headers: isArray(successExample?.headers) ? successExample.headers : [],
      });
      exampleList = exampleList?.filter((e) => e?.example_id !== successExample?.example_id);
    }
    if (failExample) {
      res.push({
        example_id: '2',
        raw: failExample?.raw || '',
        raw_parameter: completionBodyRawParameter(failExample?.raw_parameter),
        expect: completionExpect(failExample?.expect as ExpectItem, modelsMap),
        headers: isArray(failExample?.headers) ? failExample.headers : [],
      });
      exampleList = exampleList?.filter((e) => e?.example_id !== failExample?.example_id);
    }

    return exampleList?.reduce((pre, item) => {
      res.push({
        example_id: snowflakeId(),
        raw: item?.raw || '',
        raw_parameter: completionBodyRawParameter(item?.raw_parameter),
        expect: completionExpect(item?.expect as ExpectItem, modelsMap),
        headers: isArray(item?.headers) ? item.headers : [],
      });
      return pre;
    }, res);
  }
  return [];
};

export const completionResponse = (
  response: BaseResponse,
  modelsMap: { [key: string]: string }
) => {
  return {
    is_check_result: response?.is_check_result || 1,
    example: completionExample(response?.example, modelsMap),
  };
};

export const completionAttributeInfo = (attribute_info: Record<string, any>) => {
  if (isPlainObject(attribute_info)) {
    return attribute_info;
  }
  return {};
};

export const completionWs2Config = (config: Websocket2Config | undefined) => {
  if (isPlainObject(config)) {
    return {
      information_size: config?.information_size || 5,
      certificate_verification: config?.certificate_verification || -1,
      reconnect_num: config?.reconnect_num || 5,
      reconnect_time: config?.reconnect_time || 5000,
      shake_hands_timeout: config?.shake_hands_timeout || 0,
    };
  }
  return {
    certificate_verification: -1,
    information_size: 5,
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_timeout: 0,
  };
};

export const completionSocketIoConfig = (config: SocketIoConfig | undefined) => {
  if (isPlainObject(config)) {
    return {
      reconnect_num: config?.reconnect_num || 5,
      reconnect_time: config?.reconnect_time || 5000,
      shake_hands_path: config?.shake_hands_path || '/socket.io',
      shake_hands_timeout: config?.shake_hands_timeout || 0,
      socket_version: config?.socket_version || 'v4',
      certificate_verification: config?.certificate_verification || -1,
    };
  }
  return {
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_path: '/socket.io',
    shake_hands_timeout: 0,
    socket_version: 'v4',
    certificate_verification: -1,
  };
};

export const completionWsConfig = (config: WebsocketConfig | undefined) => {
  if (isPlainObject(config)) {
    return {
      information_size: config?.information_size || 5,
      certificate_verification: -1,
      reconnect_num: config?.reconnect_num || 5,
      reconnect_time: config?.reconnect_time || 5000,
      shake_hands_timeout: config?.shake_hands_timeout || 0,
    };
  }
  return {
    certificate_verification: -1,
    information_size: 5,
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_timeout: 0,
  };
};

export const completionWsMessage = (
  msg: WebSocketRequest['message'],
  modelsMap: { [key: string]: string }
) => {
  if (!msg || !isPlainObject(msg)) {
    return [
      {
        ...DEFAULT_WEBSOCKET2_MESSAGE,
        param_id: snowflakeId(),
      },
    ];
  }
  return [
    {
      name: i18next.t('supplement.msg'),
      param_id: snowflakeId(),
      request: {
        mode: msg?.mode || 'text',
        raw: msg?.raw || '',
        raw_parameter: completionBodyRawParameter(msg?.raw_parameter),
        raw_schema: recursionSchema(msg?.raw_schema, modelsMap),
      },
      response: {
        mode: 'text',
        raw: '',
        raw_parameter: [],
        raw_schema: { type: 'object' },
      },
    },
  ];
};

export const completionWs2Message = (
  msg: Array<MessageItem>,
  modelsMap: { [key: string]: string }
) => {
  if (!msg || !isArray(msg)) {
    return [
      {
        ...DEFAULT_WEBSOCKET2_MESSAGE,
        param_id: snowflakeId(),
      },
    ];
  }
  return msg?.map(({ name, request, response }) => ({
    name: name || i18next.t('supplement.msg'),
    param_id: snowflakeId(),
    request: {
      mode: request?.mode || 'text',
      raw: request?.raw || '',
      raw_parameter: completionBodyRawParameter(request?.raw_parameter),
      raw_schema: recursionSchema(request?.raw_schema, modelsMap),
    },
    response: {
      mode: response?.mode || 'text',
      raw: response?.raw || '',
      raw_parameter: completionBodyRawParameter(response?.raw_parameter),
      raw_schema: recursionSchema(response?.raw_schema, modelsMap),
    },
  }));
};

export const completionSocketIoRequest = (request: SocketIoRequest) => {
  return {
    header: {
      parameter: completionParameter(
        request?.header?.parameter as RequestGlobalParams['header']['parameter']
      ),
    },
    query: {
      parameter: completionParameter(
        request?.query?.parameter as RequestGlobalParams['query']['parameter']
      ),
    },
    cookie: {
      parameter: completionParameter(
        request?.cookie?.parameter as RequestGlobalParams['cookie']['parameter']
      ),
    },
    event: {
      parameter: isArray(request?.event?.parameter)
        ? request?.event?.parameter?.map(
            ({
              description = '',
              field_type = 'String',
              is_checked = 1,
              key = '',
              value,
              not_null = 1,
            }) => ({
              param_id: snowflakeId(),
              description,
              field_type,
              is_checked,
              key,
              value: isEqual(value, '1') ? value : '-1',
              not_null,
            })
          )
        : [],
    },
  };
};

export const completionWs2Request = (request: WebSocket2Request) => {
  return {
    header: {
      parameter: completionParameter(
        request?.header?.parameter as RequestGlobalParams['header']['parameter']
      ),
    },
    query: {
      parameter: completionParameter(
        request?.query?.parameter as RequestGlobalParams['query']['parameter']
      ),
    },
    cookie: {
      parameter: completionParameter(
        request?.cookie?.parameter as RequestGlobalParams['cookie']['parameter']
      ),
    },
  };
};

export const completionWsRequest = (request: WebSocketRequest) => {
  return {
    header: {
      parameter: completionParameter(
        request?.header?.parameter as RequestGlobalParams['header']['parameter']
      ),
    },
    query: {
      parameter: completionParameter(
        request?.query?.parameter as RequestGlobalParams['header']['parameter']
      ),
    },
    cookie: {
      parameter: [],
    },
  };
};

export const completionSocketRequest = (request: SocketServiceDetailsData['request']) => {
  return {
    timeout: request?.timeout || 10,
    end_func: {
      name: request?.end_func?.name || 'none',
      option: request?.end_func?.option || '',
    },
  };
};

export const completionSocketMethodRequest = (
  request: SocketDetailsData['request'],
  modelsMap: { [key: string]: string }
) => {
  return {
    body: completionSocketMethodBody(request?.body as SocketRequestBody, modelsMap),
    post_tasks: request?.post_tasks || [],
    configs: {
      charset: request?.configs?.charset || 'utf8',
      func: {
        request: request?.configs?.func?.request || [],
        response: request?.configs?.func?.response || [],
      },
    },
  };
};

export const completionGrpcProtosServicesMethodsRequest = (
  request: GrpcProtosServicesMethods['request']
) => {
  const message = isArray(request?.message)
    ? request?.message?.map(({ name, raw = '', raw_parameter }) => ({
        param_id: snowflakeId(),
        name,
        raw,
        raw_parameter: completionBodyRawParameter(raw_parameter),
      }))
    : [];
  const metadata = isArray(request?.metadata?.parameter)
    ? completionBodyRawParameter(request?.metadata?.parameter)
    : [];
  return {
    message,
    metadata: {
      parameter: metadata,
    },
  };
};

export const completionGrpcProtosServicesMethods = (
  methods: GrpcProtosServices['methods'],
  modelsMap: { [key: string]: string }
) => {
  if (isArray(methods)) {
    return methods?.map(
      ({
        name,
        reconnect_num = 0,
        url,
        request,
        response,
        request_stream = -1,
        response_stream = -1,
        tls = -1,
        ssl = -1,
      }) => ({
        grpc_method_id: snowflakeId(),
        name,
        reconnect_num,
        request: completionGrpcProtosServicesMethodsRequest(request),
        response: {
          example: completionExample(response?.example, modelsMap),
        },
        request_stream,
        response_stream,
        ssl,
        tls,
        url,
      })
    );
  }
  return [];
};

export const completionGrpcProtosServices = (
  services: GrpcProtos['services'],
  modelsMap: { [key: string]: string }
) => {
  if (isArray(services)) {
    return services?.map(({ service_name, methods }) => ({
      service_id: snowflakeId(),
      service_name,
      methods: completionGrpcProtosServicesMethods(methods, modelsMap),
    }));
  }
  return [];
};

export const completionGrpcProtosFiles = (include_files: IncludesInfo[]) => {
  if (isArray(include_files)) {
    return include_files?.map(({ name = '', path = '', proto = '' }) => ({
      name,
      path,
      proto,
    }));
  }
  return [];
};

export const completionGrpcProtos = (
  protos: GrpcProtos[],
  modelsMap: { [key: string]: string }
) => {
  if (isArray(protos)) {
    return protos?.map(
      ({
        proto_content,
        proto_name,
        proto_path,
        url,
        services,
        include_files,
        include_dirs,
        proto_is_cloud = 1,
      }) => ({
        include_dirs: completionGrpcProtosFiles(include_dirs as unknown as IncludesInfo[]),
        include_files: completionGrpcProtosFiles(include_files as unknown as IncludesInfo[]),
        proto_content,
        proto_id: snowflakeId(),
        proto_is_cloud,
        proto_name,
        proto_path,
        url,
        services: completionGrpcProtosServices(services, modelsMap),
      })
    );
  }
  return [];
};

export const completionGraphqlRequestBody = (
  body: GraphQLRequest['body'],
  modelsMap: { [key: string]: string }
) => {
  let query_list: GraphQLRequestBodyQueryItem[] = [];
  if (isArray(body?.query_list)) {
    query_list = body?.query_list?.map(({ name = '', query = '', variables = '', response }) => ({
      param_id: snowflakeId(),
      name,
      query,
      variables,
      response: {
        mode: response?.mode || 'json',
        raw: response?.raw || '',
        raw_parameter: completionBodyRawParameter(response?.raw_parameter) || [],
        raw_schema: recursionSchema(response?.raw_schema || {}, modelsMap),
      },
    }));
  }
  return {
    query_list,
    query_schema: isPlainObject(body?.query_schema) ? body?.query_schema : {},
  };
};

export const completionGraphqlRequest = (
  request: GraphQLRequest,
  modelsMap: { [key: string]: string }
) => {
  return {
    auth: completionAuth(request?.auth, false),
    header: {
      parameter: completionParameter(
        request?.header?.parameter as RequestGlobalParams['header']['parameter']
      ),
    },
    cookie: {
      parameter: completionParameter(
        request?.cookie?.parameter as RequestGlobalParams['cookie']['parameter']
      ),
    },
    pre_tasks: completionTasks(request?.pre_tasks),
    post_tasks: completionTasks(request?.post_tasks),
    body: completionGraphqlRequestBody(request?.body, modelsMap),
  };
};

export const completionApis = (
  apis: ApiProjectImportParams['apis'],
  apiMap: { [key: string]: string },
  modelsMap: { [key: string]: string },
  serversMap: { [key: string]: string },
  project_id: string
) => {
  if (isArray(apis)) {
    return apis?.reduce(
      (
        pre: unknown[],
        {
          target_id,
          target_type,
          parent_id,
          name = '',
          sort = 0,
          version = 0,
          server_id,
          description,
          is_changed = -1,
          is_socket = 1,
          request,
          method = 'GET',
          url = '',
          mark_id = '1',
          protocol = 'http/1.1',
          response,
          attribute_info,
          tags,
          config,
          protos,
          message,
        }
      ) => {
        const baseApiInfo = {
          target_id: apiMap?.[target_id] || snowflakeId(),
          project_id,
          parent_id: apiMap?.[parent_id] || '0',
          target_type,
          name: getSubstring(name, 255),
          version,
          sort,
          description,
        };
        if (target_type === APIS_TARGET_TYPE_ENUM.FOLDER) {
          pre.push({
            ...baseApiInfo,
            server_id: has(serversMap, server_id) ? serversMap[server_id] : '0',
            request: completionGlobalParam(request as unknown as RequestGlobalParams),
            is_changed,
            is_socket,
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.API) {
          pre.push({
            ...baseApiInfo,
            method,
            url:
              url && isArray(request?.query?.parameter)
                ? genUrlByQuery(url, request?.query?.parameter)
                : url,
            mark_id,
            protocol,
            request: {
              ...completionGlobalParam(request as unknown as RequestGlobalParams),
              body: {
                ...completionBody(request?.body as ApisBaseRequestBody, modelsMap),
              },
            },
            response: completionResponse(response, modelsMap),
            attribute_info: completionAttributeInfo(attribute_info),
            tags,
            is_force: -1,
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.WEBSOCKET) {
          if (isEqual(method, 'Socket.IO')) {
            pre.push({
              ...baseApiInfo,
              target_type: APIS_TARGET_TYPE_ENUM.SOCKETIO,
              method: '',
              url:
                url && isArray(request?.query?.parameter)
                  ? genUrlByQuery(url, request?.query?.parameter)
                  : url,
              request: completionSocketIoRequest(request as unknown as SocketIoRequest),
              message: (request as any)?.message
                ? completionWsMessage((request as any)?.message, modelsMap)
                : [
                    {
                      ...DEFAULT_WEBSOCKET2_MESSAGE,
                      param_id: snowflakeId(),
                    },
                  ],
              attribute_info: completionAttributeInfo(attribute_info),
              tags,
              config: completionSocketIoConfig(config as unknown as SocketIoConfig),
            });
          } else {
            pre.push({
              ...baseApiInfo,
              target_type: APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
              method,
              mark_id,
              url,
              is_socket,
              config: completionWsConfig(config as WebsocketConfig),
              request: completionWsRequest(request as unknown as WebSocketRequest),
              message: (request as any)?.message
                ? completionWsMessage((request as any)?.message, modelsMap)
                : [
                    {
                      ...DEFAULT_WEBSOCKET2_MESSAGE,
                      param_id: snowflakeId(),
                    },
                  ],
            });
          }
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.WEBSOCKET2) {
          pre.push({
            ...baseApiInfo,
            method,
            mark_id,
            url,
            is_socket,
            config: completionWs2Config(config as Websocket2Config),
            request: completionWs2Request(request as unknown as WebSocket2Request),
            message: completionWs2Message(message as unknown as Array<MessageItem>, modelsMap),
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.DOC) {
          pre.push({
            ...baseApiInfo,
            attribute_info: completionAttributeInfo(attribute_info),
            is_socket,
            tags,
            mark_id,
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.SOCKET) {
          pre.push({
            ...baseApiInfo,
            method,
            url,
            request: completionSocketRequest(request as SocketServiceDetailsData['request']),
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.SOCKETIO) {
          pre.push({
            ...baseApiInfo,
            method: '',
            url:
              url && isArray(request?.query?.parameter)
                ? genUrlByQuery(url, request?.query?.parameter)
                : url,
            request: completionSocketIoRequest(request as unknown as SocketIoRequest),
            message: completionWs2Message(message as unknown as Array<MessageItem>, modelsMap),
            attribute_info: completionAttributeInfo(attribute_info),
            tags,
            config: completionSocketIoConfig(config as unknown as SocketIoConfig),
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.SOCKET_METHOD) {
          pre.push({
            ...baseApiInfo,
            method,
            url,
            mark_id,
            attribute_info,
            tags,
            request: completionSocketMethodRequest(
              request as SocketDetailsData['request'],
              modelsMap
            ),
            response: {
              example: completionExample(response?.example, modelsMap),
              is_check_result: 1,
            },
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.GRPC) {
          pre.push({
            ...baseApiInfo,
            mark_id,
            protos: completionGrpcProtos(protos, modelsMap),
            status: 1,
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.SSE) {
          pre.push({
            ...baseApiInfo,
            method,
            url:
              url && isArray(request?.query?.parameter)
                ? genUrlByQuery(url, request?.query?.parameter)
                : url,
            mark_id,
            protocol,
            request: {
              ...completionGlobalParam(request as unknown as RequestGlobalParams),
              body: {
                ...completionBody(request?.body as ApisBaseRequestBody, modelsMap),
              },
            },
            response: completionResponse(response, modelsMap),
            attribute_info: completionAttributeInfo(attribute_info),
            tags,
            is_force: -1,
          });
        }
        if (target_type === APIS_TARGET_TYPE_ENUM.GRAPHQL) {
          pre.push({
            ...baseApiInfo,
            url,
            mark_id,
            attribute_info: completionAttributeInfo(attribute_info),
            tags,
            request: completionGraphqlRequest(request as unknown as GraphQLRequest, modelsMap),
            response: completionResponse(response, modelsMap),
          });
        }
        return pre;
      },
      []
    );
  }
  return [];
};

export const completionSamples = (
  samples: ApiProjectImportParams['samples'],
  apiMap: { [key: string]: string },
  sampleMap: { [key: string]: string },
  modelsMap: { [key: string]: string },
  project_id: string
) => {
  try {
    if (isArray(samples)) {
      return samples?.reduce(
        (
          pre: any,
          {
            sample_id,
            parent_id,
            target_id,
            name = '',
            type,
            method,
            url,
            sort = 1,
            description = '',
            protocol = 'http/1.1',
            request,
            response,
          }
        ) => {
          if (has(apiMap, target_id)) {
            if (type === 'sample_group') {
              pre.push({
                sample_id: sampleMap?.[sample_id],
                parent_id: sampleMap?.[parent_id],
                target_id: apiMap?.[target_id],
                project_id,
                name,
                type,
                method,
                url,
                sort,
              });
            }
            if (type === 'sample') {
              pre.push({
                sample_id: sampleMap?.[sample_id],
                parent_id: sampleMap?.[parent_id],
                target_id: apiMap?.[target_id],
                project_id,
                name,
                type,
                method,
                url,
                sort,
                description,
                protocol,
                request: {
                  ...completionGlobalParam(request as unknown as RequestGlobalParams),
                  body: {
                    ...completionBody(request?.body as ApisBaseRequestBody, modelsMap),
                  },
                },
                response: completionResponse(response, modelsMap),
              });
            }
          }

          return pre;
        },
        []
      );
    }
    return [];
  } catch (err) {
    return [];
  }
};


