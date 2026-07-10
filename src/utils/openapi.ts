import { DEBUG_REQUEST_BODY_MODE_ENUM, OPENAPI_REQUEST_BODY_MODE_ENUM } from '@/constants/apis';
import { CONTENT_TYPES, DESIGN_CONTENT_TYPES } from '@/constants/common';
import { ApiDetailsData, echoapiResult, OpenApiData, openapiResult } from '@/types/apis/api';
import { ApisBaseDataItem, TypeFiledType } from '@/types/apis/base';
import { RequestBodyContentType } from '@/types/apis/request';
import { snowflakeId } from 'apipost-tools';
import { forEach, isArray, isEmpty, isPlainObject, isString, toLower, upperCase } from 'lodash';
import { capitalizeFirstLetter } from './apis';
import { parseModelToJsonSchema } from '@/utils/dataModel';
import MockSchema from 'apipost-mock-schema';
import { areKeysOneToOne, EditFormat, isJSON } from '@/utils/common';
import { Mockjs } from 'mockjs5-pro';
import { useProjectSetting } from '@/store';
import { JSONSchemaType } from '@/types/jsonSchema';
import Type from 'type-of-is';
import { AnyObject } from '@/types/common';

const getProxyMockRulesList = () => {
  const { mockInfo, mockList, mockInnerList } = useProjectSetting.getState();
  const mockConfig = mockInfo || {};
  const mock_rule_switch = mockConfig?.mock_rule_switch === 1 ? 1 : -1;

  let result = mockList;
  if (mock_rule_switch === 1) {
    result = result.concat(mockInnerList);
  }

  return result?.map((e) => ({
    ...e,
    type: e?.field_type,
    mock: e?.mock_rule_content,
  }));
};

export const handleAutoGeneration = async (json: any) => {
  try {
    const jsonSchema = await parseModelToJsonSchema(
      json?.schema || {},
      [],
      {}
    );
    const mockRules = getProxyMockRulesList();
    // 7.2.3 default required field related bug fix
    const mockDataRequired: any = {};

    if (isPlainObject(jsonSchema)) {
      const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
      await mockSchema.mock(jsonSchema, mockRules);
      const mockList = mockSchema.getMockDataList();

      if (isArray(mockList)) {
        mockList.forEach((item) => {
          if (isArray(item?.path)) {
            const descKey = item.path.filter((item: any) => !/^[0-9]$/.test(item)).join('.');
            if (!isEmpty(descKey)) {
              mockDataRequired[descKey] = item.is_required;
            }
          }
        });
      }
    }
    let jsonExample = '';
    const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
    jsonExample = await mockSchema.mock(jsonSchema || {}, mockRules);

    jsonExample = JSON.stringify(jsonExample);

    const formatValue = EditFormat(jsonExample || '').value;
    const raw = !formatValue || formatValue === '{}' ? '' : formatValue;

    return raw;
  } catch (err) {

    return '';
  }
};

export const tryMock = (val: string) => {
  try {
    let replaceStr = val.replace(/\$/g, '@');
    let mockStr = Mockjs.mock(replaceStr);
    if (mockStr !== replaceStr) {
      return mockStr;
    }
  } catch (error) { }
  return val;
};

function createEmptyObject(obj:any) {
  const result:any = {};
  
  for (const key in obj.properties) {
    if (obj.properties.hasOwnProperty(key)) {
      const property = obj.properties[key];
      
      if (property.type === "string") {
        result[key] = property?.mock?.mock ? tryMock(property?.mock?.mock) : property?.example || property?.default || '';
      } else if (property.type === "object") {
        result[key] = createEmptyObject(property); // recursive call
      }
    }
  }
  
  return result;
}

export const handleOpenApiToEchoapi = async (open_api: OpenApiData, apisData: ApiDetailsData): Promise<echoapiResult> => {
  let bodyMode = apisData?.request?.body?.mode as RequestBodyContentType;

  let result: echoapiResult = {
    diffArr: [],
    header: [],
    cookie: [],
    query: [],
    path: []
  };
  if (!open_api || isEmpty(open_api)) {
    return result;
  }
  let url, urlData;
  for (const key in open_api) {
    url = key;
    urlData = open_api[key];
    break;
  }

  let method, methodData;
  for (const key in urlData) {
    method = key;
    methodData = urlData[key];
    break;
  }

  result.url = url;
  result.method = upperCase(method);

  // Convert parameters
  if (isArray(methodData?.parameters)) {
    forEach(methodData.parameters, (parameter) => {
      switch (parameter?.in) {
        case 'query':
          result.query.push({
            param_id: snowflakeId(),
            field_type: parameter?.schema?.type as TypeFiledType || 'String',
            key: parameter?.name || '',
            not_null: parameter.required ? 1 : -1,
            value: parameter?.example || '',
            description: parameter?.description || '',
            is_checked: 1
          });
          break;
        case 'cookie':
          result.cookie.push({
            param_id: snowflakeId(),
            field_type: parameter?.schema?.type as TypeFiledType || 'String',
            key: parameter?.name || '',
            not_null: parameter.required ? 1 : -1,
            value: parameter?.example || '',
            description: parameter?.description || '',
            is_checked: 1
          });
          break;
        case 'header':
          result.header.push({
            param_id: snowflakeId(),
            field_type: parameter?.schema?.type as TypeFiledType || 'String',
            key: parameter?.name || '',
            not_null: parameter.required ? 1 : -1,
            value: parameter?.example || '',
            description: parameter?.description || '',
            is_checked: 1
          });
          break;
        case 'path':
          result.path.push({
            param_id: snowflakeId(),
            field_type: parameter?.schema?.type as TypeFiledType || 'String',
            key: parameter?.name || '',
            not_null: parameter.required ? 1 : -1,
            value: parameter?.example || '',
            description: parameter?.description || '',
            is_checked: 1
          });
          break;
        default:
          break;
      }
    });
  }

  const requestBody = methodData?.requestBody?.content || {};
  const bodyModeType = CONTENT_TYPES?.[bodyMode];
  const bodyModeInfo = requestBody?.[bodyModeType];

  // When debug is none, default to filling in the first body data from design.
  if (bodyMode === 'none') {
    // Get the first body data from design
    let firstBodyKey, firstBodyData;
    for (const key in requestBody) {
      firstBodyKey = key;
      firstBodyData = requestBody[key];
      break;
    }
    if (firstBodyKey && firstBodyData) {
      result.bodyMode = DESIGN_CONTENT_TYPES?.[firstBodyKey] as RequestBodyContentType || 'none';
      // form-data/urlencoded
      if ([OPENAPI_REQUEST_BODY_MODE_ENUM.FORM_DATA, OPENAPI_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(firstBodyKey as OPENAPI_REQUEST_BODY_MODE_ENUM)) {
        if (firstBodyData?.schema?.type === 'object' && isPlainObject(firstBodyData?.schema?.properties)) {
          if (!isArray(result?.bodyParameter)) {
            result.bodyParameter = [];
          }
          // Extract properties data to echoapi's body parameter
          forEach(firstBodyData.schema.properties, (val, key) => {
            let bodyParameterItem:ApisBaseDataItem = {
              param_id: snowflakeId(),
              field_type: capitalizeFirstLetter(val?.type) as TypeFiledType || 'String',
              key: key || '',
              value: val?.mock?.mock ? tryMock(val?.mock?.mock) : val?.example || val?.default || '',
              description: val?.description || '',
              is_checked: 1,
              not_null:isArray(firstBodyData?.schema?.required) ? (firstBodyData.schema.required.includes(key) ? 1 : -1) : -1,
            }
            result.bodyParameter?.push(bodyParameterItem);
            if(bodyParameterItem.field_type === 'Object' && isPlainObject(val?.properties) && !isEmpty(val?.properties)){
              bodyParameterItem.value = JSON.stringify(createEmptyObject(val));
            }
          });
        }

        // binary data
      } else if (OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY === firstBodyKey) {
        if (firstBodyData?.schema?.format === 'binary' && isPlainObject(firstBodyData?.schema?.example)) {
          if (!isPlainObject(result?.bodyBinary)) {
            result.bodyBinary = {
              file_name: firstBodyData?.schema?.example?.fileName || '',
              data_url: firstBodyData?.schema?.example?.file || ''
            };
          }
        }

        // raw data
      } else {
        if (['object', 'array'].includes(firstBodyData?.schema?.type || '') && isPlainObject(firstBodyData?.schema?.properties)) {
          if (isString(firstBodyData?.example) && firstBodyData?.example.length > 0) {
            result.bodyRaw = firstBodyData?.example;
          } else {
            result.bodyRaw = await handleAutoGeneration(firstBodyData);
          }
          result.bodyRawSchema = firstBodyData.schema;
        } else if (firstBodyData?.schema?.type === 'string') {
          result.bodyRaw = firstBodyData?.schema?.example || firstBodyData?.schema?.default || ''
        }
      }
    }

    // Convert requestBody for specified mode
  } else if (bodyModeType) {
    // (Convert when both sides have data)
    if (bodyModeInfo) {
      result.bodyMode = bodyMode;
      // form-data/urlencoded
      if ([OPENAPI_REQUEST_BODY_MODE_ENUM.FORM_DATA, OPENAPI_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(bodyModeType as OPENAPI_REQUEST_BODY_MODE_ENUM)) {
        if (bodyModeInfo?.schema?.type === 'object' && isPlainObject(bodyModeInfo?.schema?.properties)) {
          if (!isArray(result?.bodyParameter)) {
            result.bodyParameter = [];
          }
          // Extract properties data to echoapi's body parameter
          forEach(bodyModeInfo.schema.properties, (val, key) => {
            let bodyParameterItem: ApisBaseDataItem = {
              param_id: snowflakeId(),
              field_type: capitalizeFirstLetter(val?.type) as TypeFiledType || 'String',
              key: key || '',
              value: val?.mock?.mock ? tryMock(val?.mock?.mock) : val?.example || val?.default || '',
              description: val?.description || '',
              is_checked: 1,
              not_null:isArray(bodyModeInfo?.schema?.required) ? (bodyModeInfo.schema.required.includes(key) ? 1 : -1) : -1,
            };
            if(bodyParameterItem.field_type === 'Object' && isPlainObject(val?.properties) && !isEmpty(val?.properties)){
              bodyParameterItem.value = JSON.stringify(createEmptyObject(val));
            }
            result.bodyParameter?.push(bodyParameterItem);
          });
        }

        // binary data
      } else if (OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY === bodyModeType) {
        if (bodyModeInfo?.schema?.format === 'binary' && isPlainObject(bodyModeInfo?.schema?.example)) {
          if (!isPlainObject(result?.bodyBinary)) {
            result.bodyBinary = {
              file_name: bodyModeInfo?.schema?.example?.fileName || '',
              data_url: bodyModeInfo?.schema?.example?.file || ''
            };
          }
        }else{
          result.bodyBinary = {
            file_name: '',
            data_url: ''
          };
        }

        // raw data
      } else {
        if (['object', 'array'].includes(bodyModeInfo?.schema?.type || '')) {
          if (isString(bodyModeInfo?.example) && bodyModeInfo?.example.length > 0) {
            result.bodyRaw = bodyModeInfo?.example;
          } else {
            result.bodyRaw = await handleAutoGeneration(bodyModeInfo);
          }
          result.bodyRawSchema = bodyModeInfo.schema;
        } else if (bodyModeInfo?.schema?.type === 'string') {
          result.bodyRaw = bodyModeInfo?.schema?.example || bodyModeInfo?.schema?.default || ''
        }
      }
    } else {
      // When design has no data, override current debug body to empty
      if ([DEBUG_REQUEST_BODY_MODE_ENUM.FORM_DATA, DEBUG_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(bodyMode as DEBUG_REQUEST_BODY_MODE_ENUM)) {
        result.bodyMode = bodyMode;
        result.bodyParameter = [];
      } else {
        result.bodyMode = bodyMode;
        result.bodyRaw = '';
      }
    }


  }

  // Compare differences
  if (result.url !== apisData.url) {
    result.diffArr.push('URL');
  }

  if (result?.method !== apisData.method) {
    result.diffArr.push('Request Method');
  }

  if (!areKeysOneToOne(result.header, apisData?.request?.header?.parameter || [])) {
    result.diffArr.push('Header');
  }

  if (!areKeysOneToOne(result.query, apisData?.request?.query?.parameter || [])) {
    result.diffArr.push('Params');
  }

  if (!areKeysOneToOne(result.path, apisData?.request?.restful?.parameter || [])) {
    result.diffArr.push('Path');
  }

  if (!areKeysOneToOne(result.cookie, apisData?.request?.cookie?.parameter || [])) {
    result.diffArr.push('Cookies');
  }

  if (result?.bodyMode && bodyMode !== result?.bodyMode) {
    result.diffArr.push('Body');
  } else {
    if ([DEBUG_REQUEST_BODY_MODE_ENUM.FORM_DATA, DEBUG_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(result?.bodyMode as DEBUG_REQUEST_BODY_MODE_ENUM) &&
      !areKeysOneToOne(result?.bodyParameter || [], apisData?.request?.body?.parameter || [])) {
      result.diffArr.push('Body');
    } else if (DEBUG_REQUEST_BODY_MODE_ENUM.BINARY === result?.bodyMode && 
      result.bodyBinary?.file_name !== apisData?.request?.body?.binary?.file_name
    ) {
      result.diffArr.push('Body');
    } else if (isString(result?.bodyRaw) && result?.bodyRaw !== apisData?.request?.body?.raw) {
      result.diffArr.push('Body');
    }
  }

  return result;
};
const MEDIA_TYPE: any = {
  'form-data': 'multipart/form-data',
  urlencoded: 'application/x-www-form-urlencoded',
  json: 'application/json',
  xml: 'application/xml',
  javascript: 'application/javascript',
  plain: 'text/plain',
  html: 'text/html',
};
export const handleEchoApiToOpenApi = (apisData: ApiDetailsData): openapiResult => {
  let result: openapiResult = {
    parameters: [],
    requestBodyContent: {},
    responses:{},
    method: 'get',
    url: ''
  };
  if (isString(apisData?.url)) {
    result.url = apisData.url;
  }
  if (isString(apisData?.method)) {
    result.method = toLower(apisData.method);
  }

  if (isArray(apisData?.request?.header?.parameter)) {
    forEach(apisData.request.header.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'header',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.query?.parameter)) {
    forEach(apisData.request.query.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'query',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.restful?.parameter)) {
    forEach(apisData.request.restful.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'path',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.cookie?.parameter)) {
    forEach(apisData.request.cookie.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'cookie',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }
  let bodyMode = apisData?.request?.body?.mode as RequestBodyContentType;
  const bodyModeType = CONTENT_TYPES?.[bodyMode];
  if (bodyModeType && bodyModeType !== 'none') {
    // form-data/urlencoded
    if ([OPENAPI_REQUEST_BODY_MODE_ENUM.FORM_DATA, OPENAPI_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(bodyModeType as OPENAPI_REQUEST_BODY_MODE_ENUM)) {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'object',
          properties: (apisData?.request?.body?.parameter || []).reduce((pre: any, cur) => {
            if (isString(cur?.key) && cur.key.length > 0 && cur?.is_checked === 1) {
              pre[cur.key] = {
                type: toLower(cur?.field_type || 'string'),
                description: cur?.description || '',
                mock: {
                  mock: cur?.value || ''
                },
                example: cur?.value || '',
              };
            }
            return pre;
          }, {})
        }
      }
      // binary data
    } else if (OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY === bodyModeType) {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'string',
          properties: {},
          format: 'binary',
          example: {
            fileName: apisData?.request?.body?.binary?.file_name || '',
            file: apisData?.request?.body?.binary?.data_url || ''
          }
        }
      }
      // raw data
    } else {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'object'
        },
        example: apisData?.request?.body?.raw || '',
      }
      try {
        if (isJSON(apisData?.request?.body?.raw || '')) {
          let rawObj = JSON.parse(apisData?.request?.body?.raw || '');
          let schema = transformObject(rawObj);
          result.requestBodyContent[bodyModeType].schema = schema;
        }
      } catch (error) {
      }
    }
  }
  
  if(isArray(apisData?.response?.example)){
    forEach(apisData?.response?.example,(i)=>{
      if(i?.expect?.code){
        result.responses[i?.expect?.code] ={
          description:i?.expect?.name || "",
          content:{
            [MEDIA_TYPE?.[i?.expect?.content_type] || '']:{
              example:i?.raw || '',
              schema:i?.expect?.schema || {}
            }
          }
        };
      }
    });
  }

  return result;
}

export const transformObject = (obj: AnyObject) => {
  const result: any = { type: Type.string(obj).toLowerCase(), properties: {} };

  if (result.type === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.properties[key] = transformObject(obj[key]);
      }
    }
  } else if (result.type === 'array' && obj.length > 0) {
    result.items = transformObject(obj[0]);
  } else if (result.type === 'integer' || result.type === 'string' || result.type === 'boolean' || result.type === 'number') {
    result.example = obj;
    result.mock = { mock: String(obj) };
  }

  return result;
}