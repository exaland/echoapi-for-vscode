import { Flex } from 'antd';
import TreeCheckbox from '@/components/business/TreeCheckbox';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { cloneDeep, reduce } from 'lodash';

const customFieldNames = {
  title: 'name',
  key: 'target_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
};

const Conflict = (props: { searchValue: string, conflictItems: any;conflictCheckedKeys:Array<React.Key>;setConflictCheckedKeys:any }) => {
  const { conflictItems, searchValue,conflictCheckedKeys,setConflictCheckedKeys } = props;
  const { t } = useTranslation();

  const dataSource = useMemo(() => {
    const cloneConflictItems = cloneDeep(conflictItems);

    return reduce(cloneConflictItems,(pre: any, cur: any, index:number ) => {
      if (cur?.target_id) {
        cur.sort = index;
        pre[cur.target_id] = cur;
      }
      return pre;
    },{});
  }, [conflictItems]);

  return (
    <>
      <Flex flex={1} vertical gap={8}>
        <Flex flex={1}>
          <TreeCheckbox
            hasMarkFilter={false}
            hideSearchInput={true}
            searchValue={searchValue}
            originTreeProps={{
              fieldNames: customFieldNames,
            }}
            typeIncludes={['api', 'sse', 'folder','websocket2', 'socketio','graphql']}
            folderIncludes={['folder']}
            notCalcCheckedTypes={['folder']}
            notCalcChildrenCountTypes={['folder']}
            dataSource={dataSource}
            checkedKeys={conflictCheckedKeys}
            setCheckedKeys={setConflictCheckedKeys}
          />
        </Flex>
      </Flex>

    </>
  )
}

export default Conflict;