import { ApiRequest } from '@/types/apis/request';
import { ChangeFuncType } from '@/types/common';

import { RequestTabsItemProps } from '../types';
import { ApiDetailsData } from '@/types/apis/api';

export type RequestBodyProps = RequestTabsItemProps & {
  apiData?:ApiDetailsData;
  value: ApiRequest['body'];
  onChange: ChangeFuncType<ApiRequest>;
};
