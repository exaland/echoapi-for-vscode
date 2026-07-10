import { snowflakeId } from 'apipost-tools';
import { isPlainObject, isString, trim, toString } from 'lodash';

// Handle websocket data
export const handleSocketResponse = (
  response: any[],
  filterValue?: string,
  filterType?: string
) => {
  const resArr: any[] = [];
  
  for (const res of response || []) {
    if (isString(filterType) && filterType !== 'all' && res?.action !== filterType) {
      continue;
    }
    switch (res?.action) {
      case 'connect':
        {
          if (
            isString(filterValue) &&
            trim(filterValue).length > 0 &&
            isString(res?.message?.message) &&
            res?.message?.message?.indexOf(trim(filterValue)) === -1
          )
            continue;
          resArr.push({
            ...res,
            id: res?.id || snowflakeId(),
          });
        }
        break;
      case 'disconnect':
        if (
          isString(filterValue) &&
          trim(filterValue).length > 0 &&
          isString(res?.data?.message) &&
          res?.data?.message?.indexOf(trim(filterValue)) === -1
        ) {
          continue;
        }
        resArr.push({
          ...res,
          id: res?.id || snowflakeId(),
        });
        break;
      case 'error':
        if (
          isString(filterValue) &&
          trim(filterValue).length > 0 &&
          isString(res?.message?.message) &&
          res?.message?.message?.indexOf(trim(filterValue)) === -1
        ) {
          continue;
        }
        resArr.push({
          ...res,
          id: res?.id || snowflakeId(),
        });
        break;
      case 'message':
        if (
          isString(filterValue) &&
          trim(filterValue).length > 0 &&
          isString(res?.message?.data) &&
          res?.message?.data?.indexOf(trim(filterValue)) === -1
        )
          continue;

        resArr.push({
          ...res,
          id: res?.id || snowflakeId(),
        });
        break;
      case 'send':
        if (
          isString(filterValue) &&
          trim(filterValue).length > 0 &&
          getSendStr(res?.message?.data).indexOf(trim(filterValue)) === -1
        )
          continue;

        resArr.push({
          ...res,
          id: res?.id || snowflakeId(),
        });
        break;
      default:
        break;
    }
  }
  return resArr;
};

export const getSendStr = (data: any) => {
  if (isString(data)) {
    return data;
  }
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return toString(data);
};