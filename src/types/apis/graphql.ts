import { AnyObject, CustomNumberBooleanType } from '../common';
import { ApisBaseData } from './base';
import { GraphQLRequest } from './request';
import { BaseResponse } from './response';

export interface GraphQLDetailsData extends ApisBaseData {
  // Request method
  // method: ApiTypeMethod;
  // Request URL
  url: string;
  // Description
  description: string;
  // Request object
  request: GraphQLRequest;
  // Response object
  response: BaseResponse;
  // Whether archived (1=yes, -1=no)
  is_exampled?: CustomNumberBooleanType;
  // Whether locked (1=yes, -1=no)
  is_locked: CustomNumberBooleanType;
  // Whether to enable response validation
  is_check_result: CustomNumberBooleanType;
  // Whether force save
  is_force: CustomNumberBooleanType;
  // Whether to push socket
  is_socket: CustomNumberBooleanType;
  // API test case group ID
  sample_group_id?: -1 | string;
  // Server ID, optional
  server_id?: string;
  // Pre-request URL, optional
  pre_url?: string;
  // Query ID
  search_id?: string;
  // Properties
  attribute_info: AnyObject;
}

export type ApiComponentType = {
  apisData: GraphQLDetailsData;
  onApisDataChange: (data: GraphQLDetailsData) => void;
};

export type GraphQLChangeFuncType<T> = <K extends keyof T>(
  key: K,
  value: T[K],
  search_id?: string
) => void;

export type FilterDataType = {
  [keyPath: string]: any;
};
