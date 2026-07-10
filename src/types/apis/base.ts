import { APIS_TARGET_TYPE_ENUM, DEFAULT_API_MARK_ENUM } from '@/constants/apis';
import { CustomNumberBooleanType, HttpStatusCode } from '@/types/common';

import { ApiDetailsData } from './api';
import { SampleGroupsDetailsData } from './apiSample';
import { DocDetailsData } from './doc';
import { FolderDetailsData } from './folder';
import { GrpcDetailsData } from './grpc';
import { SocketDetailsData } from './socket';
import { SocketServiceDetailsData } from './socketService';
import { SSEDetailsData } from './sse';
import { WebsocketDetailsData } from './websocket';
import { Websocket2DetailsData } from './websocket2';
import { SocketIoDetailsData } from './socketio';
import { GraphQLDetailsData } from './graphql';

// API request method
export type ApiTypeMethod =
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'COPY'
  | 'HEAD'
  | 'OPTIONS'
  | 'LINK'
  | 'UNLINK'
  | 'PURGE'
  | 'LOCK'
  | 'UNLOCK'
  | 'PROPFIND'
  | 'VIEW';

// WebSocket request method
export type WebsocketMethod = 'Raw' | 'Socket.IO';

export interface ApisBaseData {
  // Parent directory ID
  parent_id: string;
  // Project ID
  project_id: string;
  // Collection unique ID
  target_id: string;
  // Data type: api, folder, doc, websocket
  target_type: APIS_TARGET_TYPE_ENUM;
  // API/directory/text/websocket name
  name: string;
  // Sort order in left directory, higher = later, starting from 0
  sort: number;
  // 1=Normal -1=Deleted -2 -99=Permanently deleted
  status: 1 | -1 | -2 | -99;
  // Request method
  method?: unknown;
  // Whether modified
  is_changed?: CustomNumberBooleanType;
  // Whether conflicted
  is_conflicted?: CustomNumberBooleanType;
  // Whether deleted
  is_deleted?: CustomNumberBooleanType;
  // Whether newly created
  is_create: CustomNumberBooleanType;
  // Archived
  is_exampled?: CustomNumberBooleanType;
  // API status: 1=In Development, 2=Completed, 3=Needs Modification, other=custom
  mark_id?: DEFAULT_API_MARK_ENUM | string;
  // Version
  version: number;
  // Created at
  created_at?: string;
  // Updated at
  updated_at?: number;
  // Tags
  tags?: string[];
  // Created by
  created_user?: {
    uid: string;
    nick_name: string;
    portrait: string;
  };
  // Updated by
  updated_user?: {
    uid: string;
    nick_name: string;
    portrait: string;
  };
  // Save loading (temporary field, not accepted by backend)
  save_loading?: boolean;
  // Whether changed (temporary field, not accepted by backend)
  has_changed?: CustomNumberBooleanType;

  // vscodeVersion
  vscode_version?:string;
}

export interface ApisBaseDataItem {
  // id
  param_id?: string;
  // Field data type
  field_type?: TypeFiledType;
  // Whether selected
  is_checked: CustomNumberBooleanType;
  // Field name
  key: string;
  // Whether empty value is not allowed
  not_null?: CustomNumberBooleanType;
  // Field value
  value?: string;
  // Field description
  description?: string;
  // form-data content-type
  content_type?: string;
  // File name
  file_name?: string;
  // Base64 file
  file_base64?: string;
  static?: boolean;
}

export type TypeFiledType =
  | 'Object'
  | 'Array'
  | 'String'
  | 'Number'
  | 'Integer'
  | 'Float'
  | 'Double'
  | 'File'
  | 'Date'
  | 'DateTime'
  | 'TimeStamp'
  | 'Boolean';

export interface ExpectItem {
  // Expect name
  name: string;
  // Whether default
  is_default: CustomNumberBooleanType;
  // HTTP status code
  code: HttpStatusCode | string;
  // Response content format
  content_type: 'json' | 'xml' | 'html' | 'binary';
  // Validation type
  verify_type: 'schema' | 'mock';
  // json schema
  schema: SchemaObj | any;
  // Mock data
  mock: string;
}

export interface SchemaObj {
  raw: string;
  raw_parameter: any[];
  raw_schema: any;
}

export type ApisDataTypeMapping = {
  [APIS_TARGET_TYPE_ENUM.API]: ApiDetailsData;
  [APIS_TARGET_TYPE_ENUM.SSE]: SSEDetailsData;
  [APIS_TARGET_TYPE_ENUM.FOLDER]: FolderDetailsData;
  [APIS_TARGET_TYPE_ENUM.DOC]: DocDetailsData;
  [APIS_TARGET_TYPE_ENUM.WEBSOCKET]: WebsocketDetailsData;
  [APIS_TARGET_TYPE_ENUM.GRPC]: GrpcDetailsData;
  [APIS_TARGET_TYPE_ENUM.API_SAMPLE]: Omit<ApiDetailsData, 'description' | 'attribute_info'>;
  [APIS_TARGET_TYPE_ENUM.API_SAMPLE_GROUP]: SampleGroupsDetailsData;
  [APIS_TARGET_TYPE_ENUM.SOCKET]: SocketServiceDetailsData;
  [APIS_TARGET_TYPE_ENUM.SOCKET_METHOD]: SocketDetailsData;
  [APIS_TARGET_TYPE_ENUM.WEBSOCKET2]: Websocket2DetailsData;
  [APIS_TARGET_TYPE_ENUM.SOCKETIO]: SocketIoDetailsData;
  [APIS_TARGET_TYPE_ENUM.GRAPHQL]: GraphQLDetailsData;
};
