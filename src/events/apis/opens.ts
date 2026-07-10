import { ApiDetailsData, ApisData } from '@/types/apis/api';
import { snowflakeId } from 'apipost-tools';
import { useApis, useSystemConfig } from '@/store';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { APIS_BASE_DEFAULT_DATA, APIS_VIEW_DEFAULT_STATUS } from '@/constants/apis/common';
import { assign, cloneDeep, concat, includes, isEqual, omit } from 'lodash';
import { ApiTypeMethod } from '@/types/apis/base';
import { RequestBodyContentType } from '@/types/apis/request';
import { VSCODE_VERSION } from '@/constants/vscode';

const RESET_DEFAULT_DATA_OMIT_ARR = [
  'created_user',
  'created_at',
  'updated_user',
  'updated_at',
  'version',
];

/**
 * Update opened items
 */
export const updateOpensItem = (data: Partial<ApisData>) => {
  try {
    const { updateOpensApiDetailsDataByTargetId } = useApis.getState();

    updateOpensApiDetailsDataByTargetId(data as ApiDetailsData);
  } catch (err) {
    // err
  }
};

/**
 * Update opened items
 */
export const updateApisActiveItem= (data: Partial<ApisData>) => {
  try {
    const { updateApisActiveData } = useApis.getState();

    updateApisActiveData(data as ApiDetailsData);
  } catch (err) {
    // err
  }
};


/**
 * Create new opened item
 */
export const createOpensItem = async (params: {
  project_id: string;
  target_type: APIS_TARGET_TYPE_ENUM;
  parent_id: string;
  mark_id?: string;
  resetDefaultData?: Partial<ApisData>;
}) => {
  try {
    const { project_id, target_type, parent_id, mark_id, resetDefaultData = {} } = params;

    const defaultData = APIS_BASE_DEFAULT_DATA[target_type];

    const {
      updateOpensApiList,
      opensApiList,
      updateOpensApiDetailsDataByTargetId,
      updateApisActiveKey,
    } = useApis.getState();
    const { systemConfig } = useSystemConfig.getState();

    const target_id = snowflakeId();

    const result = cloneDeep({
      ...defaultData,
      ...assign({}, omit(resetDefaultData, RESET_DEFAULT_DATA_OMIT_ARR), APIS_VIEW_DEFAULT_STATUS),
      project_id,
      target_type,
      target_id,
      parent_id,
      is_changed: 1,
      mark_id: '',
    }) as Partial<ApiDetailsData>;

    // Manually set API status
    mark_id && (result.mark_id = mark_id);

    const includesCurKey = includes(opensApiList, target_id);

    // System settings
    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.API)) {
      // Whether to auto-add equals sign for API query
      if (systemConfig?.request_query_add_equal && result?.request?.query) {
        result.request.query.query_add_equal = systemConfig?.request_query_add_equal;
      }
      // Default request method for API
      if (systemConfig?.request_method && result.method) {
        result.method = systemConfig?.request_method as ApiTypeMethod;
      }
      // Default request mode for API
      if (systemConfig?.request_mode && result?.request?.body) {
        result.request.body.mode = systemConfig?.request_mode as RequestBodyContentType;
      }
    }

    // When new API is GET, default request tab to query
    if (includes([APIS_TARGET_TYPE_ENUM.API, APIS_TARGET_TYPE_ENUM.SSE], target_type)) {
      if (systemConfig?.request_method === 'GET' && result.request) {
        result.request.tabs_default_active_key = 'query';
      }
    }

    if (!includesCurKey) {
      updateOpensApiList(concat(opensApiList, [target_id]));
      updateOpensApiDetailsDataByTargetId(result as ApiDetailsData);
      updateApisActiveKey(target_id);
    }

    // Add vscode version number
    result.vscode_version = VSCODE_VERSION;

    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};