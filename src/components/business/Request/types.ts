import { TabsProps } from 'antd';

import { ApisBaseDataItem } from '@/types/apis/base';
import { ApiRequest } from '@/types/apis/request';
import { ApiDetailsData } from '@/types/apis/api';
import { GlobalParamsHeaderItem } from '@/types/project';

export interface RequestProps {
  target_id?: string;
  paramsType?: 'global' | 'folder' | 'request' | '';
  onlyAssert?: boolean;
  tabsDefaultActiveKey?: string;
  showAiDescription?: boolean;
  extra?: TabsProps['items'];
  includesTabs?: string[];
  requestData: Partial<ApiRequest>;
  apiData?:ApiDetailsData;
  isSystem?: boolean;
  onRequestDataChange: (requestData: Partial<ApiRequest>) => void;
}

export type RequestTabsItemProps = Pick<RequestProps, 'paramsType'> & {
  tabType?: 'header' | 'query' | 'restful' | 'body' | 'cookie' | 'event';
  folderParams?: ApisBaseDataItem[];
  globalParams?: GlobalParamsHeaderItem[];
};
