import { APIS_TASK_TYPES_ENUM } from '@/constants/apis';

import { CustomNumberBooleanType } from '../common';
import { Auth } from './auth';
import { ApisBaseDataItem } from './base';

export type RequestBodyContentType =
  | 'none'
  | 'form-data'
  | 'urlencoded'
  | 'binary'
  | 'json'
  | 'xml'
  | 'javascript'
  | 'plain'
  | 'html'
  | 'msgpack';

export type ApisBaseRequestBody = {
  // Request body type, none，form-data,urlencoded,json,xml,javascript,plain,html
  mode: RequestBodyContentType;
  // Valid when mode is form-data or urlencoded
  parameter?: Array<ApisBaseDataItem>;
  // Valid when mode is json, xml, javascript, plain, html
  raw: string;
  // Valid when mode is json, xml, javascript, plain, html
  raw_parameter: Array<ApisBaseDataItem>;
  raw_schema: object;
  binary?: {
    file_name: string;
    data_url: string;
    file_path?: string;
  } | null;
};

// API base request object
export interface ApisBaseRequest {
  // Request auth info
  auth?: Auth;
  // Request body info
  body?: ApisBaseRequestBody;
}

export interface ApiRequest extends ApisBaseRequest {
  // Request header info
  header?: { parameter: Array<ApisBaseDataItem> };
  // Request query info
  query?: {
    parameter: Array<ApisBaseDataItem>;
    // Whether to add equals sign to query parameters
    query_add_equal?: CustomNumberBooleanType;
  };
  // Request cookie info
  cookie?: { parameter: Array<ApisBaseDataItem> };
  // Request path variable info
  restful?: { parameter: Array<ApisBaseDataItem> };
  // Pre-request operations
  pre_tasks?: TaskBaseItem[];
  // Post-response operations
  post_tasks?: TaskBaseItem[];
  // Protocol
  protocol?: string;
  // Request tab default active key (temporary field, not accepted by backend)
  tabs_default_active_key?: string;
}

export interface FolderRequest {
  // Request header info
  header: { parameter: Array<ApisBaseDataItem> };
  // Request query info
  query: { parameter: Array<ApisBaseDataItem> };
  // Request cookie info
  cookie: { parameter: Array<ApisBaseDataItem> };
  // Request query info
  body: { parameter: Array<ApisBaseDataItem> };
  // Request auth info
  auth: Auth;
  // Pre-request operations
  pre_tasks: any[];
  // Post-response operations
  post_tasks: any[];
}

export interface SocketRequestBody {
  //Parameter type
  mode: 'iso8583' | 'json' | 'xml' | 'raw' | 'fixed_message' | 'delimiter_message';
  //  Use this data for iso8583 type parameters
  parameter: any[];
  //  'json' | 'xml' | 'raw' Use this data for
  raw: string;
  raw_parameter: any[];
  raw_schema: any;
}

export interface SocketRequestFunc {
  id: string; //Function ID
  title: string; //Function display title
  option: any; // Function definition, may be object or text
}

export interface SocketRequest {
  // Request body info
  body: SocketRequestBody;
  // Post-response operations
  post_tasks: any[];
  //Send settings info
  configs: {
    charset: string;
    func: {
      request: SocketRequestFunc[];
      response: SocketRequestFunc[];
    };
  };
}

export interface WebSocketRequest {
  // Request header info
  header: { parameter: Array<ApisBaseDataItem> };
  // Request query info
  query: { parameter: Array<ApisBaseDataItem> };
  // API request URL
  event: { parameter: Array<ApisBaseDataItem> };
  // Description
  message: {
    mode: string;
    raw: string;
    raw_parameter: Array<ApisBaseDataItem>;
    raw_schema: any;
  };
}

export type DefaultRequestSystemHeaders = {
  key: string;
  value: string;
  is_checked: 1 | -1;
  field_type: string;
};

export type TaskBaseItem = {
  type: APIS_TASK_TYPES_ENUM;
  id: string;
  enabled: CustomNumberBooleanType;
  name: string;
  data: any;
};

export type GraphQLRequestBodyQueryItem = {
  // id
  param_id: string;
  // Field name
  name: string;
  // Request body
  query: string;
  // Variables
  variables: string;
  // Response
  response: {
    mode: any;
    raw: string;
    raw_parameter: Array<ApisBaseDataItem>;
    raw_schema: any;
  };
};


export type GraphQLRequestBody = {
  query_schema: object;
  query_list: Array<GraphQLRequestBodyQueryItem>;
};

export interface GraphQLRequest {
  // Request auth info
  auth?: Auth;
  // Request header info
  header: { parameter: Array<ApisBaseDataItem> };
  // Pre-request operations
  pre_tasks: TaskBaseItem[];
  // Post-response operations
  post_tasks: TaskBaseItem[];
  // Request body info
  body: GraphQLRequestBody;
  cookie: { parameter: Array<ApisBaseDataItem> };
}