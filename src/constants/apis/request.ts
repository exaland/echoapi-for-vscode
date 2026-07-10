import { ApisBaseDataItem } from '@/types/apis/base';
import { DefaultRequestSystemHeaders, RequestBodyContentType } from '@/types/apis/request';
import { CustomNumberBooleanType } from '@/types/common';

import { DEFAULT_AUTH } from './auth';
import i18next from 'i18next';
import { snowflakeId } from 'apipost-tools';

// api default request
export const DEFAULT_API_REQUEST = {
  auth: DEFAULT_AUTH,
  body: {
    mode: 'none' as RequestBodyContentType,
    parameter: [],
    raw: '',
    raw_parameter: [],
    raw_schema: { type: 'object' },
    binary: null,
  },
  pre_tasks: [],
  post_tasks: [],
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
    query_add_equal: 1 as CustomNumberBooleanType,
  },
  cookie: {
    parameter: [],
  },
  restful: {
    parameter: [],
  },
};

// folder default request
export const DEFAULT_FOLDER_REQUEST = {
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
  },
  body: {
    parameter: [],
  },
  cookie: {
    parameter: [],
  },
  auth: DEFAULT_AUTH,
  pre_tasks: [],
  post_tasks: [],
};

export const DEFAULT_WEBSOCKET2_REQUEST = {
  // event: {
  //   parameter: [],
  // },
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
  },
};

export const DEFAULT_WEBSOCKET2_MESSAGE = {
  name: i18next.t('supplement.msg') || 'Message',
  param_id: snowflakeId(),
  request: {
    mode: 'text',
    raw: '',
    raw_parameter: [],
    raw_schema: { type: 'object' },
  },
  response: {
    mode: 'text',
    raw: '',
    raw_parameter: [],
    raw_schema: { type: 'object' },
  },
};

// websocket default request
export const DEFAULT_WEBSOCKET_REQUEST = {
  event: {
    parameter: [],
  },
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
  },
  message: {
    mode: 'text',
    raw: '',
    raw_parameter: [],
    raw_schema: { type: 'object' },
  },
};

export const PARAMETER_ITEM: ApisBaseDataItem = {
  description: '',
  field_type: 'String' as ApisBaseDataItem['field_type'],
  is_checked: 1 as CustomNumberBooleanType,
  key: '',
  value: '',
  not_null: 1 as CustomNumberBooleanType,
  static: true,
  // file_base64: '',
  // file_name: '',
  // content_type: '',
};

// apipost default request headers
export const DEFAULT_REQUEST_SYSTEM_HEADERS: DefaultRequestSystemHeaders[] = [
  {
    key: 'Accept',
    value: '*/*',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Accept-Encoding',
    value: 'gzip, deflate, br',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'User-Agent',
    value: 'EchoapiRuntime/1.1.0',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Connection',
    value: 'keep-alive',
    is_checked: 1,
    field_type: 'String',
  },
];

export const DEFAULT_SOCKETIO_REQUEST = {
  cookie: {
    parameter: [],
  },
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
  },
  event: {
    parameter: [],
  },
};


// apipost default ws2 request headers
export const DEFAULT_REQUEST_SYSTEM_HEADERS_WS2: DefaultRequestSystemHeaders[] = [
  {
    key: 'Host',
    value: '<calculated at runtime>',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Connection',
    value: 'Upgrade',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Upgrade',
    value: 'websocket',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Sec-WebSocket-Key',
    value: '<calculated at runtime>',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Sec-WebSocket-Version',
    value: '13',
    is_checked: 1,
    field_type: 'String',
  },
  {
    key: 'Sec-WebSocket-Extensions',
    value: 'permessage-deflate; client_max_window_bits',
    is_checked: 1,
    field_type: 'String',
  },
];

export const DEFAULT_GRAPHQL_QUERY_ITEM = {
  param_id: '',
  name: i18next.t('graphql.cus_search') || 'New Query',
  query: '',
  variables: '',
  response: {
    mode: 'json',
    raw: '',
    raw_parameter: [],
    raw_schema: { type: 'object' },
  },
};

export const DEFAULT_GRAPHQL_REQUEST = {
  auth: DEFAULT_AUTH,
  header: {
    parameter: [],
  },
  cookie: {
    parameter: [],
  },
  pre_tasks: [],
  post_tasks: [],
  body: {
    query_schema: {},
    query_list: [],
  },
};