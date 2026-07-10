import { ApisBaseDataItem, ApiTypeMethod, TypeFiledType } from "@/types/apis/base";
import urlParse from 'url-parse';
import { isURL, getUrlQueryToArray, createUrl, isJSON } from './common';
import { cloneDeep, filter, find, findIndex, forEach, head, isArray, isEqual, isPlainObject, isString, isUndefined, map, toUpper } from "lodash";
import { CONTENT_TYPES, OPENAPI_TYPES, STATUS_CODE } from "@/constants/common";
import { snowflakeId } from "apipost-tools";
import { AnyObject, CustomNumberBooleanType } from "@/types/common";
import { ApiDetailsData, ApisData, ParametersItem } from "@/types/apis/api";
import { EnvListItem } from "@/types/envManage";
import { useApis } from "@/store";
import { ApiSendResponseData } from "@/types/apis/send";
import { formatTime, TIME_FORMAT } from "./time";
import dayjs from "dayjs";
import { ApisBaseRequestBody } from "@/types/apis/request";
import { DEFAULT_API_RESPONSE } from "@/constants/apis/response";
import { Websocket2DetailsData } from "@/types/apis/websocket2";
import { SocketIoDetailsData } from "@/types/apis/socketio";
import { UrlGroupProps } from "@/components/business/UrlGroup";
import produce from "immer";
import { CurlDataType } from "@/types/apis/other";

// Generate new query array based on url
export const genQueryByUrl = (
  url: string,
  oldParameter: Array<ApisBaseDataItem>
): Array<ApisBaseDataItem> => {
  let queryList: Array<ApisBaseDataItem> = [];
  // Auto-prepend url http://
  if (!isURL(url)) {
    url = `http://${url}`;
  }

  const urlQuery = urlParse(url)?.query || '';

  // Extract query
  const searchParams = getUrlQueryToArray(urlQuery);

  queryList = filter(oldParameter, (item: ApisBaseDataItem) =>
    isEqual(item?.is_checked, STATUS_CODE.DISABLE)
  );

  let index = 0;

  forEach(searchParams, (item) => {
    const originObj =
      filter(oldParameter, (item: ApisBaseDataItem) =>
        isEqual(item?.is_checked, STATUS_CODE.ENABLE)
      )?.[index] || {};

    queryList.push({
      param_id: originObj?.param_id || snowflakeId(),
      field_type: originObj?.field_type || 'String', // Type
      is_checked: originObj?.is_checked || 1, // Whether enabled
      key: item?.key?.trim(), // Parameter name
      not_null: originObj?.not_null || 1, // Required | -1 optional
      value: item?.value?.trim(), // Parameter value
      description: originObj?.description || '', // Field description
    });

    index++;
  });

  return queryList;
};

// Generate new restful array based on url
export const genRestfulByUrl = (
  url: string,
  oldParameter: Array<ApisBaseDataItem>
): Array<ApisBaseDataItem> => {
  const restfulList: any = [];
  // Auto-prepend url http://
  if (!isURL(url)) {
    url = `http://${url}`;
  }
  const urlObj = createUrl(url);
  const paths = urlObj.pathname.split('/');

  forEach(paths, (pathsItem: any) => {
    if (pathsItem.substring(0, 1) === ':' && pathsItem.length > 1) {
      let obj: ApisBaseDataItem | null = null;

      const oldIndex = findIndex(oldParameter, {
        key: pathsItem.substring(1, pathsItem.length),
      });

      if (oldIndex !== -1) {
        obj = oldParameter[oldIndex];
      }

      restfulList.push({
        param_id: obj?.param_id || snowflakeId(),
        field_type: 'String',
        is_checked: 1,
        key: pathsItem.substring(1, pathsItem.length),
        not_null: 1,
        value: obj?.value || '',
        description: obj?.description || '',
      });
    }
  });

  const regex = /(?<!{){([^{}]+)}(?!})/g;

  try {
    const matches = url.match(regex);

    if (isArray(matches) && matches.length > 0) {
      forEach(matches, (matchesItem) => {
        if (matchesItem.length > 0) {
          matchesItem = matchesItem.replace(/^{|}$/g, '');

          let obj: ApisBaseDataItem | null = null;
          const oldIndex = findIndex(oldParameter, {
            key: matchesItem,
          });

          if (oldIndex !== -1) {
            obj = oldParameter[oldIndex];
          }

          restfulList.push({
            param_id: obj?.param_id || snowflakeId(),
            field_type: 'String',
            is_checked: 1,
            key: matchesItem,
            not_null: 1,
            value: obj?.value || '',
            description: obj?.description || '',
          });
        }
      });
    }
  } catch (error) { }
  return restfulList;
};

// Generate new restful array based on url
export const designGenRestfulByUrl = (
  url: string,
  oldParameter: Array<ParametersItem>
): Array<ParametersItem> => {
  const restfulList: any = [];
  // Auto-prepend url http://
  if (!isURL(url)) {
    url = `http://${url}`;
  }
  const regex = /(?<!{){([^{}]+)}(?!})/g;

  try {
    const matches = url.match(regex);

    if (isArray(matches) && matches.length > 0) {
      forEach(matches, (matchesItem) => {
        if (matchesItem.length > 0) {
          matchesItem = matchesItem.replace(/^{|}$/g, '');

          let obj: ParametersItem | null = null;
          const oldIndex = findIndex(oldParameter, {
            name: matchesItem,
          });

          if (oldIndex !== -1) {
            obj = oldParameter[oldIndex];
          }

          restfulList.push({
            name: matchesItem,
            in: 'path',
            description: obj?.description || '',
            required: true,
            example: obj?.example || '',
            schema: {
              type: 'string'
            }
          });
        }
      });
    }
  } catch (error) { }
  return restfulList;
};

// Generate new url based on query array
export const genUrlByQuery = (
  url: string,
  parameter: ApisBaseDataItem[] | undefined,
  query_add_equal: CustomNumberBooleanType | undefined = 1
): string => {
  let paramsStr = '';
  let newUrl = url || '';

  const handleEncode = (value: string | undefined = '') => {
    let _value = cloneDeep(value);

    try {
      // Encode # symbol
      _value = _value.replace(/#/g, encodeURIComponent('#'));
      // Encode & symbol
      _value = _value.replace(/&/g, encodeURIComponent('&'));
    } catch (e) { }

    return _value;
  };

  forEach(parameter, (item: ApisBaseDataItem) => {
    if (item.key && isEqual(item.is_checked, STATUS_CODE.ENABLE)) {
      paramsStr += `${paramsStr ? '&' : ''}${handleEncode(item.key)}${isEqual(query_add_equal, STATUS_CODE.DISABLE) && !item.value ? '' : '='
        }${handleEncode(item.value)}`;
    }
  });

  // NOTE If original url has hash, need to append it back
  newUrl = `${head(newUrl.split('?'))}${paramsStr ? '?' : ''}${paramsStr}${urlParse(newUrl)?.hash || ''
    }`;

  return newUrl;
};

// Get cloned api data
export const getHistoryOpensData = (value: any) => {
  const dataNew = cloneDeep(value);
  dataNew.target_id = snowflakeId();
  dataNew.is_changed = 1;
  dataNew.sort = 0;
  dataNew.is_locked = -1;
  dataNew.version = 0;
  delete dataNew?.history_id;
  return dataNew;
};

// Get api server id
export const getCollectionServerId = (target_id: string, parents_data: any,defaultServerId?:string): string => {
  const result = ''; // Use default by default
  // If unsaved, need to get from opens
  const targetInfo = parents_data?.[target_id];

  if (isUndefined(targetInfo)) {
    return defaultServerId || result;
  }

  if (isString(targetInfo?.server_id) && !isEqual(targetInfo?.server_id, '0')) {
    return targetInfo.server_id;
  }

  return getCollectionServerId(targetInfo.parent_id, parents_data, defaultServerId);
};

// Get api base url
export const getBaseUrl = (
  target_id: string,
  apisData: { [x: string]: ApisData },
  envInfo?: EnvListItem
): string => {
  const currentServerId = getCollectionServerId(target_id, apisData);
  const serversData = find(envInfo?.server_list, (it) => it?.server_id === currentServerId);

  if (isUndefined(serversData)) {
    return (
      find(envInfo?.server_list, (filterItem) => isEqual(filterItem.server_id, '1'))?.uri || ''
    );
  }

  return serversData?.uri || '';
};

function getNowAt(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Get timezone offset (minutes)
  const offset = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? '+' : '-';

  // Build timezone string
  const timeZoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(
    offsetMinutes
  ).padStart(2, '0')}`;

  // Build final datetime string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timeZoneString}`;
}

export const createBatchApi = (data: any, maxSort?: number, folder_id?: string) => {
  // Get max sort in directory
  let baseSort = maxSort || 0;
  const nowAt = getNowAt();
  const list = [];
  if (isArray(data)) {
    for (let index = 0; index < data.length; index++) {
      const item = cloneDeep(data[index]);
      if (!['api', 'folder', 'websocket2','sse','socketio','graphql'].includes(item.target_type)) {
        continue;
      }
      if (item?.is_create == 1) {
        item['created_at'] = nowAt;
        item['updated_at'] = nowAt;
      }
      if (item?.has_changed == 1) {
        item['updated_at'] = getNowAt();
      }
      if (!item?.created_at) {
        item['created_at'] = nowAt;
      }
      if(!item?.response && item?.target_type === 'api'){
        item['response'] = cloneDeep(DEFAULT_API_RESPONSE);
      }
      if (!item?.parent_id || item?.parent_id == '0') {
        item.parent_id = folder_id || '0';
      }
      for (const deleteKey of [
        'is_create',
        'save_loading',
        'has_changed',
        'is_conflicted',
        'is_deleted',
        'is_force',
        'is_changed',
      ]) {
        delete item[deleteKey];
      }
      item.version = 1;
      if (!item?.target_id) {
        item.target_id = snowflakeId();
        item.parent_id = '0';
      }

      if (item?.sort < 1) {
        baseSort += 1;
        // Calculate appropriate sort
        item.sort = baseSort;
      }
      list.push(item);
    }
  }

  // await guestDB.api_details_data.bulkPut(list);
  return list;
};

export const handleResponseConsole = (console: ApiSendResponseData['console']) => {
  const _console = cloneDeep(console);

  const time = formatTime(dayjs(), TIME_FORMAT.TIME_L);

  return map(_console, (item) => ({
    ...item,
    time: item?.time || time,
  }));
};

export const capitalizeFirstLetter=(str:string)=> {
  if (!str) return ''; // If input string is empty, return directly
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const openApiParamsToEchoApiParams = (arr: ParametersItem[]) => {
  const newParams: ApisBaseDataItem[] = [];
  arr.forEach(item => {
    newParams.push({
      param_id:snowflakeId(),
      is_checked: 1,
      key: item?.name || "",
      value: item?.example || '',
      description: item?.description || '',
      field_type: capitalizeFirstLetter(item.schema.type) as TypeFiledType
    });
  });
  return newParams;
};

export const echoApiParamsToOpenApiParams = (arr: ApisBaseDataItem[], inType: "header" | "query" | "cookie") => {
  const newParams: ParametersItem[] = [];
  arr.forEach(item => {
    newParams.push({
      name: item.key,
      in: inType,
      description: item?.description || '',
      required: item.is_checked == 1,
      example: item?.value || '',
      schema: {
        type: (item?.field_type || 'string').toLocaleLowerCase()
      }
    });
  });
  return newParams;
};

export const openApiRequestBodyToEchoApiRequestBody = (content: AnyObject) => {
  const body: ApisBaseRequestBody = {
    mode: "none",
    raw: "",
    raw_parameter: [],
    raw_schema: {}
  };
  const mode = Object.keys(content)[0];
  const bodyInfo = content[mode];
  if (OPENAPI_TYPES?.[mode]) {
    body.mode = OPENAPI_TYPES?.[mode];
  }
  if (isString(bodyInfo?.example)) {
    body.raw = bodyInfo.example;
  }

  if (isPlainObject(bodyInfo.schema.properties) && ['application/x-www-form-urlencoded', 'multipart/form-data'].includes(mode)) {
    forEach(bodyInfo.schema.properties, (val, key) => {
      body.raw_parameter.push({
        is_checked: 1,
        key: key,
        value: val?.example || '',
        description: val?.description || '',
        field_type: capitalizeFirstLetter(val?.type || 'String') as TypeFiledType
      });
    });
  }
  if (isPlainObject(bodyInfo.schema.properties) && !['application/x-www-form-urlencoded', 'multipart/form-data'].includes(mode)) {
    let newObj: any = {};
    forEach(bodyInfo.schema.properties, (val, key) => {
      newObj[key] = val?.format || val?.example || '';
    });
    body.raw = JSON.stringify(newObj, null, '\t');
  }
  return body;
};

export const EchoApiRequestBodyToopenApiRequestBody = (body: ApisBaseRequestBody) => {
  let newContent: any = {
    type: 'object',
    properties: {
      required: []
    }
  };
  const mode = CONTENT_TYPES?.[body.mode];
  if (mode == 'none') {
    return newContent;
  }
  if (['form-data', 'urlencoded'].includes(mode)) {
    forEach(body.parameter, (item) => {
      newContent.properties[item.key] = {
        type: item?.field_type?.toLocaleLowerCase() || "string",
        example: item?.value || '',
        description: item.description || ''
      };
      if (item.is_checked) {
        newContent.properties.required.push(item.key);
      }
    });
  }
  if (!['form-data', 'urlencoded'].includes(mode)) {
    if (isJSON(body.raw)) {
      const obj = JSON.parse(body.raw);
      forEach(obj, (val, key) => {
        newContent.properties[key] = {
          type: "string",
          example: val || '',
          description: ''
        };
        newContent.properties.required.push(key);
      });
    } else {
      newContent.properties.example = String(body.raw);
    }
  }
};

export const mergeDesignAndDebugParams = (designParams:Array<ApisBaseDataItem>,debugParams:Array<ApisBaseDataItem>)=>{
  forEach(designParams,(item)=>{
    const debugIndex = debugParams.findIndex(i=>i.key === item.key)
    // Check if debug already has this key; if so, keep debug's value and description
    if(debugIndex > -1){
      if(isString(debugParams[debugIndex]?.value) &&  debugParams[debugIndex]?.value.length > 0){
        item.value = debugParams[debugIndex].value;
      }
      if(isString(debugParams[debugIndex]?.description) &&  debugParams[debugIndex]?.description.length > 0){
        item.description = debugParams[debugIndex].description;
      }
    }
  });
  return designParams;
}

export const fillInOpenApi = async (apiData: ApiDetailsData) => {
  if (!isPlainObject(apiData?.open_api)) {
    apiData.open_api = {
      [apiData?.url || '/']: {
        [apiData.method.toLocaleLowerCase()]: {
          "summary": apiData?.name || "",
          "description": "",
          "tags": [],
          "parameters": [],
          "requestBody": {
            "content": {}
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {}
                  },
                  "example": ""
                }
              }
            },
            "404": {
              "description": "Failure",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {}
                  },
                  "example": ""
                }
              }
            }
          }
        }
      }
    };
  }
  return apiData;
}

export const genNewWsByUrlChange = (
  apisData: Websocket2DetailsData | SocketIoDetailsData,
  urlData: UrlGroupProps['data']
): Websocket2DetailsData | SocketIoDetailsData => {
  const result = produce(apisData, (draft) => {
    draft.url = urlData.url || '';

    if (urlData.url) {
      if (isArray(draft?.request?.query?.parameter)) {
        draft.request.query.parameter = genQueryByUrl(
          `${urlData.url}`,
          draft?.request?.query?.parameter || []
        );
      }
    } else {
      if (draft.request.query?.parameter) {
        draft.request.query.parameter = [];
      }
    }
  });

  return result;
};

export const getNewApisDataByCurlChange = (
  apisData: ApiDetailsData,
  curlData: CurlDataType
): ApiDetailsData => {
  const result = produce(apisData, (draft) => {
    draft.description = curlData.description || '';
    draft.method = curlData.method as ApiTypeMethod;
    draft.url = curlData.url || '';
    draft.request = {
      ...draft.request,
      header: curlData.request.header,
      body: curlData.request.body,
      query: curlData.request.query,
      auth: curlData.request.auth,
    };
    if (curlData.url) {
      if (isArray(draft?.request?.restful?.parameter)) {
        draft.request.restful.parameter = genRestfulByUrl(
          `${curlData.url}`,
          draft?.request?.restful?.parameter || []
        );
      }
    } else {
      if (draft.request.restful?.parameter) {
        draft.request.restful.parameter = [];
      }
    }
  });

  return result;
};

export const getParameterDataFilterContentLength = (oldParameter: Array<ApisBaseDataItem>) => {
  const result = produce(oldParameter, (draft) => {
    return filter(draft, (item) => !isEqual(toUpper(item.key), 'CONTENT-LENGTH'));
  });

  return result;
};