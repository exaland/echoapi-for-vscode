import { ApiRequest } from '@/types/apis/request';
import { AnyObject, ChangeFuncType } from '@/types/common';

import { RequestTabsItemProps } from '../types';

export type RequestBodyProps = RequestTabsItemProps & {
  value: AnyObject;
  onChange: (x:AnyObject)=>void;
};
