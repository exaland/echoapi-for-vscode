import { has, isArray, isEmpty, isNumber, isPlainObject, isString } from 'lodash';

export const MODE_TYPE: any = {
  'form-data': 'multipart/form-data',
  urlencoded: 'application/x-www-form-urlencoded',
  json: 'application/json',
  xml: 'application/xml',
  javascript: 'application/javascript',
  plain: 'text/plain',
  html: 'text/html',
};

const splicedPath = (name: any, version: string) => {
  if (version === '2.0') {
    return `#/definitions/${name}`;
  }
  return `#/components/schemas/${name}`;
};

export const deepHandleModelRef = (modelObj: any, modelsObj: any, version: string) => {
  const result = modelObj;
  // Iterate over all properties
  for (const key in modelObj) {
    if (has(modelObj, key)) {
      const value = modelObj[key];
      // If property name is "ECHOAPI_REFS"
      if (key === 'ECHOAPI_REFS') {
        const lonely = !has(modelObj, 'properties') || isEmpty(modelObj.properties);

        if (isPlainObject(value) && !isEmpty(value)) {
          const refArr: any = Object.keys(value);
          let modelPath = '';
          if (refArr.length > 1) {
            if (!has(modelObj, 'properties')) {
              modelObj.properties = {};
            }
            refArr.forEach((item: any) => {
              const modelObjItem = modelsObj?.[value?.[item]?.ref];

              modelPath = splicedPath(modelObjItem?.modelPath, version);
              modelObj.properties['$ref'] = modelPath;
            });
          } else {
            const oldRef = value?.[refArr[0]]?.ref;
            const hasInvPath = modelsObj?.[oldRef]?.modelPath;
            let modelPath = splicedPath(modelsObj?.[oldRef]?.modelPath, version);
            if (lonely && hasInvPath) {
              modelObj.$ref = modelPath;
            } else {
              refArr.forEach((item: any) => {
                const modelObjItem = modelsObj?.[value?.[item]?.ref];
                modelPath = splicedPath(modelObjItem?.modelPath, version);
                modelObj.properties['$ref'] = modelPath;
              });
            }
          }
        }
      }
      // If the property is an object, recursively search
      else if (Object.prototype.toString.call(value) === '[object Object]' && value !== null) {
        modelObj[key] = deepHandleModelRef(value, modelsObj, version);
      }
    }
  }
  return result;
};

export const removeQuery = (url: string) => {
  let path = url;
  try {
    const parts = url.split('?');
    path = parts[0];
  } catch (error) {}

  return path || '/';
};

export const recursiveFolderPath = (
  path: string,
  sourceObj: any,
  pid: string,
  pidName = 'pid'
): any => {
  if (pid && sourceObj[pid]) {
    if (path) {
      path = `${sourceObj[pid].name}/${path}`;
    } else {
      path = sourceObj[pid].name;
    }

    if (sourceObj[pid][pidName] && sourceObj[pid][pidName] != '0')
      return recursiveFolderPath(path, sourceObj, sourceObj[pid][pidName], pidName);
    return path;
  }
  return path;
};

export const generateProperties = (objStr: string) => {
  const ret: any = {};
  try {
    const obj = JSON.parse(objStr);
    for (const key in obj) {
      if (isPlainObject(obj[key])) {
        ret[key] = {
          type: 'object',
          properties: generateProperties(JSON.stringify(obj[key])),
        };
      } else if (obj[key]) {
        ret[key] = {
          type: typeof obj[key] === 'number' ? 'integer' : typeof obj[key],
          example: obj[key],
        };
      }
    }
  } catch (e) {}
  return ret;
};

export const formatTags = (tag = '') => {
  return tag.split('/') || [];
};

export const handlePathItemParameters = (type: string, arr: any, pathItem: any) => {
  if (isArray(arr) && arr.length > 0) {
    if (!has(pathItem, 'parameters')) {
      pathItem.parameters = [];
    }
    for (const item of arr) {
      if (
        isString(item?.key) &&
        item.key.length > 0 &&
        (!has(item, 'is_checked') || item?.is_checked > 0)
      ) {
        pathItem.parameters.push({
          name: item.key,
          in: type,
          description: item?.description || '',
          required: item?.not_null === 1,
          example: String(item?.value || ''),
          schema: {
            type: item?.field_type?.toLowerCase(),
          },
        });
      }
    }
  }
};

export const handlePathItemBodyParameters = (body: any, pathItem: any, modelsObj: any) => {
  if (isPlainObject(body) && !isEmpty(body) && body?.mode != 'none') {
    if (!has(pathItem, 'parameters')) {
      pathItem.parameters = [];
    }
    const mode = MODE_TYPE?.[body?.mode];

    if (isString(mode) && mode.length > 0) {
      if (
        [
          'application/json',
          'application/xml',
          'application/javascript',
          'text/plain',
          'text/html',
        ].includes(mode)
      ) {
        let obj = {
          in: 'body',
          name: 'body',
          description: '',
          schema: body?.raw_schema || {},
          type: 'string',
          example: body?.raw || '',
        };
        obj = deepHandleModelRef(obj, modelsObj, '2.0');
        pathItem.parameters.push(obj);
      } else if (['multipart/form-data', 'application/x-www-form-urlencoded'].includes(mode)) {
        const parameter = body?.parameter || [];
        if (isArray(parameter) && parameter.length > 0) {
          parameter.forEach((item) => {
            if (
              isString(item?.key) &&
              item.key.length > 0 &&
              (!has(item, 'is_checked') || item?.is_checked > 0)
            ) {
              pathItem.parameters.push({
                in: 'formData',
                name: 'body',
                type: 'string',
                description: item?.description || '',
                default: item?.value || '',
              });
            }
          });
        }
      }
    }
  }
};

export const handlePathItemrequestBody = (body: any, pathItem: any) => {
  if (isPlainObject(body) && !isEmpty(body) && body?.mode != 'none') {
    if (!has(pathItem, 'requestBody')) {
      pathItem.requestBody = {
        content: {},
      };
    }
    const mode = MODE_TYPE[body?.mode];
    if (isString(mode) && mode.length > 0) {
      if (
        [
          'application/json',
          'application/xml',
          'application/javascript',
          'text/plain',
          'text/html',
        ].includes(mode)
      ) {
        pathItem.requestBody.content[mode] = {
          schema: body?.raw_schema || {
            type: 'string',
          },
          example: body?.raw || '',
        };
      } else if (['multipart/form-data', 'application/x-www-form-urlencoded'].includes(mode)) {
        const parameter = body?.parameter || [];
        if (isArray(parameter) && parameter.length > 0) {
          pathItem.requestBody.content[mode] = {
            schema: {
              type: 'object',
            },
            properties: parameter.reduce((lastData, item) => {
              if (
                isString(item?.key) &&
                item.key.length > 0 &&
                (!has(item, 'is_checked') || item?.is_checked > 0)
              ) {
                lastData[item.key] = {
                  type: 'string',
                  description: item?.description || '',
                  example: item?.value || '',
                };
              }
              return lastData;
            }, {}),
          };
        }
      }
    }
  } else {
    pathItem?.requestBody && delete pathItem.requestBody;
  }
};

export const handelPathItemResponse = (response: any) => {
  const temp_responses: any = {};
  const example = response?.example || [];
  if (isPlainObject(response)) {
    example.forEach(({ expect }: any) => {
      const code = expect?.code;
      if (isNumber(code) || isString(code)) {
        temp_responses[code] = {
          description: expect?.name || '',
          content: {
            [MODE_TYPE?.[expect?.contentType] || '*/*']: {
              schema: expect?.schema || {},
            },
          },
        };
      }
    });
  }
  return temp_responses;
};
