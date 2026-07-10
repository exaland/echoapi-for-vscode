import { FC, Key, ReactNode, useEffect } from 'react';

import { ConfigProvider, TreeProps } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';

import Tree from '@/components/business/Tree';
import { useTreeData } from '@/components/business/Tree/hooks';
import { TreeDataFilterParams } from '@/components/business/Tree/types';
import { APIS_TARGET_TYPE_ENUM, DEFAULT_API_MARK_ENUM } from '@/constants/apis';
import useTheme from '@/hooks/useTheme';

import Search from './components/Search';
import AllCheck from './components/AllCheck';

import { TreeCheckboxContainer } from './style';
import { isEqual } from 'lodash';

export const API_TYPE_INCLUDES: string[] = [
  APIS_TARGET_TYPE_ENUM.FOLDER,
  APIS_TARGET_TYPE_ENUM.API,
  APIS_TARGET_TYPE_ENUM.DOC,
  APIS_TARGET_TYPE_ENUM.WEBSOCKET,
  APIS_TARGET_TYPE_ENUM.GRPC,
  APIS_TARGET_TYPE_ENUM.SOCKET,
  APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
  'model',
  'group',
];
const FOLDER_TYPE_INCLUDES: string[] = [APIS_TARGET_TYPE_ENUM.FOLDER, APIS_TARGET_TYPE_ENUM.SOCKET];

const NOT_CALC_CHECKED_TYPES: string[] = [
  APIS_TARGET_TYPE_ENUM.FOLDER,
  APIS_TARGET_TYPE_ENUM.SOCKET,
];

interface Props {
  dataSource: { [key: string]: any };
  checkedKeys: Key[];
  setCheckedKeys: (args: Key[]) => void;
  halfCheckedKeys?: Key[];
  setHalfCheckedKeys?: (args: Key[]) => void;
  originTreeProps?: TreeProps;
  typeIncludes?: string[];
  folderIncludes?: string[];
  searchIncludesField?: string[];
  hasMarkFilter?: boolean;
  notCalcCheckedTypes?: string[];
  searchInputPlaceholder?: string;
  notCalcChildrenCountTypes?: string[];
  allCheckDesc?: string;
  hideSearchInput?: boolean;
  searchValue?: string;
}

const TreeCheckbox: FC<Props> = ({
  dataSource,
  checkedKeys,
  setCheckedKeys,
  halfCheckedKeys,
  setHalfCheckedKeys,
  originTreeProps,
  hasMarkFilter,
  typeIncludes = [...API_TYPE_INCLUDES],
  folderIncludes = [...FOLDER_TYPE_INCLUDES],
  searchIncludesField = ['name', 'url'],
  notCalcCheckedTypes = [...NOT_CALC_CHECKED_TYPES],
  searchInputPlaceholder,
  notCalcChildrenCountTypes,
  allCheckDesc,
  hideSearchInput = false,
  searchValue,
}) => {
  const { themeToken } = useTheme();
  const [treeDataFilterParams, setTreeDataFilterParams] = useSafeState<TreeDataFilterParams>({
    value: '',
    mark_id: DEFAULT_API_MARK_ENUM.ALL,
  });
  const [treeExpandedKeys, setTreeExpandedKeys] = useSafeState<string[]>([]);
  
  useEffect(() => {
    setTreeDataFilterParams({
      value: searchValue || '',
      mark_id: DEFAULT_API_MARK_ENUM.ALL,
    });
  }, [searchValue]);

  const { treeData, filteredTreeList } = useTreeData({
    searchIncludesField,
    treeDataFilterParams,
    customFieldNames: originTreeProps?.fieldNames,
    dataSource,
    typeIncludes,
    folderIncludes,
    expandedKeys:treeExpandedKeys,
    setExpandedKeys:setTreeExpandedKeys,
  });

  const handleCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    if (setHalfCheckedKeys) {
      setHalfCheckedKeys(info.halfCheckedKeys as Key[]);
    }
    setCheckedKeys(checkedKeys as Key[]);
  };

  const onExpand: TreeProps['onExpand'] = useMemoizedFn((keys, { nativeEvent }) => {
    // NOTE: Auto-expand is disabled when dragging in
    if (isEqual(nativeEvent.type, 'dragenter')) { return; }
    setTreeExpandedKeys(keys as string[]);
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Tree: {
            colorBgContainer: themeToken.colorBgTreePage,
          },
        },
      }}
    >
      <TreeCheckboxContainer>
        {!hideSearchInput && <Search
          searchInputPlaceholder={searchInputPlaceholder}
          hasMarkFilter={hasMarkFilter}
          treeDataFilterParams={treeDataFilterParams}
          setTreeDataFilterParams={setTreeDataFilterParams}
        />}

        <AllCheck
          treeData={treeData}
          dataSource={dataSource}
          filteredTreeList={filteredTreeList}
          checkedKeys={checkedKeys}
          checkKey={originTreeProps?.fieldNames?.key}
          setCheckedKeys={setCheckedKeys}
          notCalcCheckedTypes={notCalcCheckedTypes}
          allCheckDesc={allCheckDesc}
        />
        <div className="tree-wrap">
          <Tree
            treeData={treeData}
            checkable
            defaultExpandAll
            forceSelectable
            checkedKeys={checkedKeys}
            onCheck={handleCheck}
            expandAction={false}
            notCalcChildrenCountTypes={notCalcChildrenCountTypes}
            onExpand={onExpand}
            expandedKeys={treeExpandedKeys}
            {...originTreeProps}
          />
        </div>
      </TreeCheckboxContainer>
    </ConfigProvider>
  );
};

export default TreeCheckbox;
