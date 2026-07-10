import { TabsProps } from 'antd';

import { ApisBaseDataItem } from '@/types/apis/base';
import { ApiRequest } from '@/types/apis/request';
import { ApiDetailsData, ParametersItem } from '@/types/apis/api';
import { AnyObject } from '@/types/common';

export interface RequestProps {
  target_id?: string;
  paramsType?: 'global' | 'folder' | 'request' | '';
  onlyAssert?: boolean;
  tabsDefaultActiveKey?: string;
  showAiDescription?: boolean;
  extra?: TabsProps['items'];
  includesTabs?: string[];
  requestData: ParametersItem[];
  apiData?:ApiDetailsData;
  isSystem?: boolean;
  onRequestDataChange: (requestData: ParametersItem[]) => void;
  requestBody:{
    content:AnyObject;
  };
  onRequestBodyChange: (requestBody: {
    content:AnyObject;
  }) => void;
}

export type RequestTabsItemProps = Pick<RequestProps, 'paramsType'> & {
  tabType?: 'header' | 'query' | 'restful' | 'body' | 'cookie' | 'event';
  folderParams?: ParametersItem[];
};
