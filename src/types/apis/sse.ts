import { AnyObject, CustomNumberBooleanType } from '../common';
import { ApiTypeMethod, ApisBaseData } from './base';
import { ApiRequest } from './request';
import { BaseResponse } from './response';

export interface SSEDetailsData extends ApisBaseData {
  // Request method
  method: ApiTypeMethod;
  // Request URL
  url: string;
  // Description
  description: string;
  // Request object
  request: ApiRequest;
  // Response object
  response: BaseResponse;
  // Whether archived (1=yes, -1=no)
  is_exampled?: CustomNumberBooleanType;
  // Whether locked (1=yes, -1=no)
  is_locked: CustomNumberBooleanType;
  // Whether to push socket
  is_socket: CustomNumberBooleanType;
  // Whether force save
  is_force: CustomNumberBooleanType;
  attribute_info: AnyObject;
}
