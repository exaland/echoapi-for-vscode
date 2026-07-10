import { useMemo, useState } from 'react';

import { cloneDeep, filter, includes, isEqual, isUndefined, some, uniq, values } from 'lodash';

import { TreeDataItem } from '@/types/apis/api';

import { TreeDataFilterParams } from '../types';

interface Props {
  dataSource: { [key: string]: TreeDataItem };
  treeDataFilterParams: TreeDataFilterParams;
  customFieldNames?: {
    title?: string;
    key?: string;
    type?: string;
    parentKey?: string;
    children?: string;
    parentNodeType?: string;
  };
  typeIncludes: string[];
  folderIncludes: string[];
  searchIncludesField?: string[];
  expandedKeys?: string[];
  setExpandedKeys?: any;
}

const useTreeData = (props: Props) => {
  const {
    treeDataFilterParams,
    dataSource,
    customFieldNames,
    typeIncludes,
    folderIncludes,
    searchIncludesField,
    expandedKeys,
    setExpandedKeys,
  } = props;
  const {
    key = 'target_id',
    parentKey = 'parent_id',
    children = 'children',
    type = 'target_type',
    parentNodeType = 'folder',
  } = customFieldNames || {};

  const [originalExpandedKeys, setOriginalExpandedKeys] = useState<React.Key[]>([]);

  // filtered one-dimensional array
  const filteredTreeList: Array<TreeDataItem> = useMemo(() => {
    if (dataSource === undefined) {
      return [];
    }

    const { value, mark_id = 'all' } = treeDataFilterParams;
    const sourceData = cloneDeep(dataSource);
    const newList: { [key: string]: TreeDataItem } = {};
    const folderIdList: string[] = [];
    Object.entries(sourceData).forEach(([target_id, data]: [string, TreeDataItem]) => {
      //if current tag doesn't exist, replace with default tag

      const searchIncludes = some(searchIncludesField, (field) =>
        includes(`${data?.[field]}`.toLowerCase(), value.toLowerCase())
      );

      if (searchIncludes && (data.mark_id === mark_id || mark_id === 'all')) {
        newList[target_id] = data;

        // if it is a folder node (target_type === 'folder'), add all child nodes
        if (data[type] === parentNodeType) {
          folderIdList.push(target_id);
          const collectChildren = (nodeId: string) => {
            // find all child nodes with current node as parent
            const children = Object.values(sourceData).filter((item) => item[parentKey] === nodeId);

            children.forEach((child) => {
              // avoid duplicate additions
              if (!newList[child[key]]) {
                if (child[type] === parentNodeType) {
                  folderIdList.push(child[key]);
                }
                newList[child[key]] = child;
                // recursively collect grandchild nodes
                collectChildren(child[key]);
              }
            });
          };

          // start collecting child nodes
          collectChildren(target_id);
        }

        let parent = sourceData[data[parentKey]];
        while (parent !== undefined && newList[parent[key]] !== parent) {
          if (!folderIdList.includes(parent[key])) {
            folderIdList.push(parent[key]);
          }
          newList[parent[key]] = parent;
          parent = sourceData[parent[parentKey]];
        }
      }
    });

    if (expandedKeys && setExpandedKeys) {
      if (value) {
        // when searching with value, save current expand state and expand all directories
        if (expandedKeys.length > 0 && originalExpandedKeys.length === 0) {
          setOriginalExpandedKeys(expandedKeys);
        }
        setExpandedKeys(uniq(folderIdList));
      } else {
        // search box cleared, restore original expand state
        if (originalExpandedKeys.length > 0) {
          setExpandedKeys(uniq(originalExpandedKeys));
        }else{
          setExpandedKeys(uniq(folderIdList));
        }

        setOriginalExpandedKeys([]);
      }
    }

    const dataList: Array<TreeDataItem> = [];

    Object.entries(newList).forEach(([target_id, data]: [string, TreeDataItem]) => {
      if (includes(typeIncludes, data[type])) {
        dataList.push({
          ...data,
          [key]: target_id,
        });
      }
    });

    return dataList?.sort((a, b) => a?.sort - b?.sort);
  }, [dataSource, treeDataFilterParams]);

  // tree structure data
  const treeData = useMemo(() => {
    const newTreeData: { [key: string]: any } = {};
    const dataList = cloneDeep(filteredTreeList);

    dataList.forEach((item) => {
      if (item[key]) {
        newTreeData[item[key]] = {
          ...item,
          isLeaf: !includes(folderIncludes, item[type]),
        };
      }
    });

    for (const item of dataList) {
      const parent = newTreeData[item[parentKey]];

      if (parent) {
        if (isUndefined(parent?.[children])) {
          parent[children] = [];
        }

        if (includes(typeIncludes, item?.[type])) {
          parent[children].push(newTreeData[item[key] || '']);
        }
      }
    }

    // filter out root node data
    const result = filter(values(newTreeData), (filterItem) => isEqual(filterItem[parentKey], '0'));

    return result?.sort((a, b) => a?.sort - b?.sort);
  }, [filteredTreeList]);

  return { treeData, filteredTreeList };
};

export default useTreeData;
