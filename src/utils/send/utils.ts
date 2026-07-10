import i18next from 'i18next';
import {
  cloneDeep,
  concat,
  find,
  head,
  includes,
  indexOf,
  isArray,
  isEqual,
  keys,
  map,
  omit,
  reduce,
  size,
} from 'lodash';

import JSON5 from 'json5';
import { useProjectConfig, useProjectSetting } from '@/store';
import { ApiDetailsData } from '@/types/apis/api';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { getUpwardFolderId } from '../common';
import { ServerItem } from '@/types/envManage';
import { SysConfig } from '@/types/settings';
import { GraphQLDetailsData } from '@/types/apis/graphql';



// Get global variables
export const getGlobals = async () => {
  const { globalVars } = useProjectConfig.getState();

  return reduce(
    keys(globalVars),
    (prev: any, curr) => {
      prev[curr] = globalVars[curr]?.current_value || '';

      return prev;
    },
    {}
  );
};

export const getGlobalFunctionMap = async () => {
  const { functionList } = useProjectSetting.getState();
  return reduce(
    functionList,
    (prev: any, item) => {
      if (item.func_name) {
        prev[item.func_name] = item.func_body as string;
      }
      return prev;
    },
    {}
  );
};

// Get current API and all parent directory information of the current API
export const getAboutCollections = async (
  apisData: ApiDetailsData & {
    type?: APIS_TARGET_TYPE_ENUM.API_SAMPLE | APIS_TARGET_TYPE_ENUM.API_SAMPLE_GROUP;
    sample_id?: string;
    server_id?: string;
    search_id?: string;
  },
  apiDetailsDatas: Array<ApiDetailsData>,
  systemConfig:SysConfig,
  omitResponse?: boolean,
  temporaryServerId?: string,
) => {

  let parentId = apisData?.parent_id || '';

  // Special handling for API sample parentId
  if (
    apisData?.sample_id &&
    apisData?.type === APIS_TARGET_TYPE_ENUM.API_SAMPLE &&
    apisData?.sample_id != apisData?.target_id
  ) {
    parentId = apisData?.target_id;
  }

  const originApisData = cloneDeep(apisData);
  if (temporaryServerId) {
    originApisData.server_id = temporaryServerId;
  }

  if (isEqual(APIS_TARGET_TYPE_ENUM.GRAPHQL, originApisData.target_type)) {
    const graphqlBody = (originApisData as unknown as GraphQLDetailsData).request.body;
    const body =
      graphqlBody?.query_list.find((item) => isEqual(item.param_id, originApisData.search_id)) ||
      head(graphqlBody?.query_list);
    let raw;
    try {
      raw = {
        query: body?.query || '',
        variables: JSON5.parse(body?.variables || '') || {},
      };
    } catch (err) {
      raw = {
        query: body?.query || '',
        variables: {},
      };
    }
    originApisData.request.body = {
      mode: 'json',
      parameter: [],
      raw: JSON.stringify(raw, null),
      raw_parameter: [],
      raw_schema: { type: 'object' },
      binary: null,
    };
  }

  const folderIds = getUpwardFolderId(apiDetailsDatas, parentId);

  let arr: ApiDetailsData[] = [originApisData];

  if (isArray(folderIds) && size(folderIds) > 0) {
    const result: ApiDetailsData[] = reduce(
      folderIds,
      (acc: ApiDetailsData[], cur) => {
        let curApi = find(apiDetailsDatas, { target_id: cur });
        if (curApi) {
          // Request data preprocessing
          acc.push(curApi);
        }

        return acc;
      },
      []
    );
    arr = concat(
      [],
      arr,
      result?.sort((a, b) => indexOf(folderIds, a.target_id) - indexOf(folderIds, b.target_id))
    );
  }

  if (omitResponse) {
    return map(arr, (item) => omit(item, ['response']));
  }

  return arr;
};



// Optimize auth data
export const optimizeAuth = (auth: { [x: string]: any; type: string }) => {
  if (auth && auth.type && auth[auth.type]) {
    return {
      type: auth.type,
      [auth.type]: auth[auth.type],
    };
  }
  // If auth.type is inherit, return inherit; otherwise return noauth
  return { type: auth.type == 'inherit' ? 'inherit' : 'noauth' };
};

// Create targetIdMap from collection, optimize redundant fields
export const createTargetIdMap = (
  collection: Omit<ApiDetailsData, 'response'>[] | ApiDetailsData[],
  serverList: ServerItem[] = []
) => {
  const targetIdMap = new Map();
  let default_pre_url = '';
  let defaultServer = serverList.find(
    (item) => item.is_default === 1
  );
  // Fallback. If serverList is empty, use the first server by default
  if (!defaultServer && serverList.length > 0) {
    defaultServer = serverList[0];
  }
  if (defaultServer) {
    default_pre_url = defaultServer.uri;
  }

  collection.forEach((item) => {
    const newItem = {
      target_id: item?.target_id,
      target_type: item?.target_type,
      parent_id: item?.parent_id,
      name: item?.name,
      request: {
        ...item?.request,
        ...(item?.request?.auth && { auth: optimizeAuth(item?.request?.auth) }),
      },
      parents: [],
      server_id: item?.server_id,
      ...(item?.target_type === APIS_TARGET_TYPE_ENUM.FOLDER && {
        server_id: item?.server_id,
      }),
      ...((item?.target_type === APIS_TARGET_TYPE_ENUM.API ||
        item?.target_type === APIS_TARGET_TYPE_ENUM.API_SAMPLE ||
        item?.target_type === APIS_TARGET_TYPE_ENUM.SSE) && {
        method: item?.method,
        protocol: item?.protocol,
        url: item?.url,
      }),
      ...([APIS_TARGET_TYPE_ENUM.GRAPHQL].includes(item?.target_type) && {
        url: item?.url,
        target_type: APIS_TARGET_TYPE_ENUM.API,
        method: 'POST',
        protocol: 'http/1.1',
      }),
    };
    targetIdMap.set(item.target_id, newItem);
  });

  targetIdMap.forEach((item) => {
    let server_id = item?.server_id;
    item.pre_url = default_pre_url;
    if (item.parent_id && item.parent_id !== '0') {
      const parents: any = [];
      let currentParentId = item.parent_id;

      // Get all parent elements
      while (currentParentId && currentParentId !== '0' && targetIdMap.has(currentParentId)) {
        const parentItem = targetIdMap.get(currentParentId);
        if (!parentItem) {
          break;
        }
        if (parentItem.server_id && parentItem.server_id != '0' && !server_id) {
          server_id = parentItem.server_id;
        }
        if (!parents.some((parent: any) => parent.target_id === parentItem.target_id)) {
          parents.push({
            target_id: parentItem.target_id,
            target_type: parentItem.target_type,
            ...(parentItem.server_id &&
              parentItem.server_id !== '0' && { server_id: parentItem.server_id }),
          });
        }
        currentParentId = parentItem.parent_id; // Update to next parent element's parent_id
      }

      // Add parents property to item
      item.parents = parents;
    }
    if (server_id) {
      item.server_id = server_id;
      const serverItem = serverList.find((item2) => item2.server_id === server_id);
      if (serverItem) {
        item.pre_url = serverItem.uri;
      }
    }
  });

  return targetIdMap;
};

// Request parameter preprocessing
export const prepareRequest = (tempRequest: ApiDetailsData['request'], runTimeHeaders?: any[]) => {
  const resultRequest = cloneDeep(tempRequest);
  // Prepend http protocol prefix
  if (isArray(tempRequest?.header?.parameter) && isArray(runTimeHeaders)) {
    resultRequest.header = {
      parameter: runTimeHeaders.concat(tempRequest?.header?.parameter),
    };
  }

  return resultRequest;
};