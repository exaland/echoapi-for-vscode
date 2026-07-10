import { ItemType } from 'antd/lib/menu/hooks/useItems';

import {
  APIS_CREATE_ITEM_OTHER_ENUM,
  APIS_PRESSURE_CONFIG_KEYS,
  APIS_PRESSURE_MODE,
  APIS_TARGET_TYPE_ENUM,
  DEFAULT_API_MARK_ENUM,
} from '@/constants/apis';

import { AnyObject, CompareCalcSymbols, CustomNumberBooleanType } from '../common';
import { ApiTypeMethod, ApisBaseData, ApisBaseDataItem } from './base';
import { ApiRequest, RequestBodyContentType } from './request';
import { BaseResponse } from './response';
import { JSONSchemaObject } from '../jsonSchema';

export interface ApiDetailsData extends ApisBaseData {
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
  // AI expect
  ai_expect?: AIExpect;
  // Whether AI expect is enabled
  ai_expect_enable: CustomNumberBooleanType;
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
  attribute_info: AnyObject;
  // Protocol
  protocol: string;
  // OpenAPI data
  open_api?: OpenApiData;
}

export type OpenApiData = {
  [url: string]: {
    [method: string]: OpenApiMainObj
  }
};

export type OpenApiMainObj = {
  summary: string;
  description: string;
  tags: string[];
  parameters: ParametersItem[];
  requestBody: {
    content: { [content_type: string]: {
      schema?:JSONSchemaObject,
      example?: any,
    } };
  };
  responses: {
    [code: string]: {
      description: string,
      content: {
        [content_type: string]: {
          schema?:JSONSchemaObject,
          example?: any,
        }
      }
    }
  }
}

export type ParametersItem = {
  name: string,
  in: "header" | 'query' | 'cookie' | 'path',
  description: string,
  required: boolean,
  example: string,
  schema: JSONSchemaObject
};

// Tree directory item generated from base data
export type TreeDataItem = Pick<
  ApisBaseData,
  'target_id' | 'target_type' | 'name' | 'sort' | 'mark_id' | 'status' | 'method' | 'parent_id'
> & {
  method: string;
  url: string;
  is_locked: -1 | 1;
  is_exampled: CustomNumberBooleanType;
  sample_group_id?: string;
  origin_parent_id?: string;
  children?: Array<TreeDataItem>;
  [x: string]: any;
};

export type ApisCreateListItem = ItemType &
  Partial<{
    key: APIS_TARGET_TYPE_ENUM | APIS_CREATE_ITEM_OTHER_ENUM;
    icon: string;
    label: string;
    type: string;
    gradientColor: string[];
  }>;

export type ApisCreateList = ApisCreateListItem[];

// api mark
export type ApiMark = {
  value: DEFAULT_API_MARK_ENUM;
  label: string;
  color: string;
  is_default: number;
};

// AI expect condition collection item
export interface ExpectConditionItem {
  conditionId?: string;
  location: 'header' | 'query' | 'body' | '';
  // Parameter name
  name: string;
  // Comparison type
  compareType: CompareCalcSymbols;
  // Parameter value
  value: string;
}

// AI expect condition collection info
export interface ExpectItem {
  id: string;
  // Whether enabled
  enable: CustomNumberBooleanType;
  // Associated expect key
  expect_id: string;
  desc?: string;
  // Expect condition list
  conditions: Array<ExpectConditionItem>;
}

// AI expect info
export interface AIExpect {
  // Condition list
  list: Array<ExpectItem>;
  // Default expect when no match
  none_math_expect_id: string;
}

// Type used when apis content type cannot be determined
export type ApisData = ApisBaseData & AnyObject;

export type ApisDataContext<T> = {
  apisData: T;
  onApisDataChange: (apisData: T) => void;
};

export type MockDetails = {
  mock_server_enable: CustomNumberBooleanType;
  ai_expect: AIExpect;
};

type Params = {
  is_checked: CustomNumberBooleanType;
  key: string;
  definition: string;
  value: string;
  description: string;
};

export type IsoDetails = {
  project_id: string;
  iso_temp_id: string;
  name: string;
  description: string;
  content: Params[];
};

export type ApiComponentType = {
  apisData: ApiDetailsData;
  onApisDataChange: (data: ApiDetailsData) => void;
  type?: string;
};

export type OpenApiComponentType = {
  apisData?: ApiDetailsData;
  openApiData: OpenApiData;
  onOpenApiDataChange: (data: OpenApiData) => void;
  setPreView?: (val: any) => void
};

export type ApiPressureData = {
  /*Whether to use test data */
  [APIS_PRESSURE_CONFIG_KEYS.USE_PRESSURE_DATA]: boolean;
  /**Shared test data path */
  [APIS_PRESSURE_CONFIG_KEYS.TEST_DATA_PATH]: string;
  /**Concurrency count */
  [APIS_PRESSURE_CONFIG_KEYS.CONCURRENCY]: number;
  /**Mode */
  [APIS_PRESSURE_CONFIG_KEYS.MODE]: APIS_PRESSURE_MODE.COUNT;
  /**Rounds */
  [APIS_PRESSURE_CONFIG_KEYS.COUNT]: number; // Pressure test rounds
  /**Duration */
  [APIS_PRESSURE_CONFIG_KEYS.DURATION]: number; // Duration
  /**Whether logging is enabled */
  [APIS_PRESSURE_CONFIG_KEYS.LOG_TYPE]: 1 | 0; // Enable logging
};

export type echoapiResult = {
  url?: string;
  method?: string;
  header: Array<ApisBaseDataItem>;
  cookie: Array<ApisBaseDataItem>;
  query: Array<ApisBaseDataItem>;
  path: Array<ApisBaseDataItem>;
  bodyParameter?: Array<ApisBaseDataItem>;
  bodyRaw?: string;
  bodyBinary?: {
    file_name: string;
    data_url: string;
    file_path?: string;
  } | null;
  bodyRawSchema?: object;
  bodyMode?: RequestBodyContentType;
  diffArr:Array<string>;
}

export type openapiResult={
  parameters:ParametersItem[],
  requestBodyContent:{ [content_type: string]: {
    schema?:JSONSchemaObject,
    example?: any,
  } },
  method:string,
  url:string,
  responses:any
}
