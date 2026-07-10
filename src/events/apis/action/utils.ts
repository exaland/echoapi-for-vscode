import {
  forEach,
  isEqual,
  isString,
  values,
} from 'lodash';

import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { useApis } from '@/store';
import { ApiDetailsData } from '@/types/apis/api';

export const getAllChild = (apisData: ApiDetailsData) => {
  try {
    const { apiDetailsData } = useApis.getState();
    const resultData: ApiDetailsData[] = [];

    const deepFind = (curApisData: ApiDetailsData) => {
      forEach(values(apiDetailsData), (forItem) => {
        if (forItem.parent_id === curApisData.target_id) {
          resultData.push(forItem);

          if (isEqual(forItem.target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
            deepFind(forItem);
          }
        }
      });
    };

    // Push current data to result set first
    resultData.push(apisData);
    deepFind(apisData);

    // Restore order
    const nodeSort = (pre: any, after: any) => {
      if (pre.sort !== after.sort) {
        return pre.sort - after.sort;
      }
      if (isString(pre?.name) && isString(after?.name)) {
        return `${pre.name}`.localeCompare(`${after.name}`);
      }
      return 0;
    };

    const resultList = resultData.sort(nodeSort);

    return resultList;
  } catch (err) {}
};
