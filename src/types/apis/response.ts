import { ApisBaseDataItem, ExpectItem } from './base';

export interface BaseResponseExample {
  // Example ID
  example_id: string;
  // Response expect ID
  expect?: ExpectItem;
  // Response field description
  raw_parameter: Array<ApisBaseDataItem>;
  // Response content
  raw: string;
}

export interface BaseResponse {
  is_check_result: 1 | -1;
  example: BaseResponseExample[];
}
