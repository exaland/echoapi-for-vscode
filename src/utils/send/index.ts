// Get current API and all parent directory information of the current API

import { APIS_TARGET_TYPE_ENUM } from "@/constants/apis";
import { useApis } from "@/store";
import { ApiDetailsData } from "@/types/apis/api";
import { cloneDeep, concat, find, indexOf, isArray, isEqual, reduce, size } from "lodash";
import { getUpwardFolderId } from "../common";

export const getAboutCollections = async (
  _project_id: string,
  apisData: ApiDetailsData & {
    type?: APIS_TARGET_TYPE_ENUM.API_SAMPLE | APIS_TARGET_TYPE_ENUM.API_SAMPLE_GROUP;
    sample_id?: string;
    server_id?: string;
    search_id?: string;
  },
  temporaryServerId?: string
) => {
  const { apiOriginDetailsList, apiDetailsData } = useApis.getState();

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

  const folderIds = getUpwardFolderId(apiOriginDetailsList, parentId);

  let arr: ApiDetailsData[] = [originApisData];

  if (isArray(folderIds) && size(folderIds) > 0) {
    const result: ApiDetailsData[] = reduce(
      folderIds,
      (acc: ApiDetailsData[], cur) => {
        const curApi = find(apiDetailsData, { target_id: cur });

        if (curApi) {
          acc.push(curApi);
        }

        return acc;
      },
      []
    );
    // NOTE whether data needs to be fetched from the detail API later
    arr = concat(
      [],
      arr,
      result?.sort((a, b) => indexOf(folderIds, a.target_id) - indexOf(folderIds, b.target_id))
    );
  }

  return arr;
};
