import { HookAPI } from 'antd/es/modal/useModal';

import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';

import { ApiDetailsData } from './api';

export type ApisItemActionType = {
  apisData: ApiDetailsData;
  projectId: string;
  childTargetType?: APIS_TARGET_TYPE_ENUM;
  modal?: HookAPI;
  tabsValue?: string;
};

export type CurlDataType = Pick<ApiDetailsData, 'description' | 'method' | 'url'> & {
  request: Pick<ApiDetailsData['request'], 'header' | 'body' | 'query' | 'auth'>;
};
