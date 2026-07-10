import React from 'react';
import { Flex} from 'antd';
import { useApis } from '@/store';
import TreeCheckbox from '@/components/business/TreeCheckbox';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import Conflict from '../../Conflict';
import { PushApiData } from '../../type';
import { isArray } from 'lodash';

type ApiCheckBoxProps = {
  halfCheckedKeys: Array<React.Key>;
  setHalfCheckedKeys: any;
  pushApiData:Partial<PushApiData>;
  updatePushApiData:(key:string,val:any)=>void;
  searchValue:string;
}

const customFieldNames = {
  title: 'name',
  key: 'target_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
};

const ApiCheckBox = (props: ApiCheckBoxProps) => {
  const { searchValue, 
    halfCheckedKeys,setHalfCheckedKeys,
    pushApiData, updatePushApiData } = props;
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);

  return (<>
    {!isArray(pushApiData?.conflictItems) || pushApiData.conflictItems.length <= 0 ? 
      <Flex vertical gap={8} flex={1}>
        <Flex style={{ flex: 1 }}>
          <TreeCheckbox
            hasMarkFilter={false}
            hideSearchInput={true}
            searchValue={searchValue}
            originTreeProps={{
              fieldNames: customFieldNames,
            }}
            typeIncludes={['api', 'sse', 'folder', 'websocket2','socketio','graphql']}
            folderIncludes={['folder']}
            notCalcCheckedTypes={['folder']}
            notCalcChildrenCountTypes={['folder']}
            dataSource={apiOriginDetailsList.reduce((pre: any, cur) => {
              if (cur?.target_id) {
                pre[cur.target_id] = cur;
              }
              return pre;
            }, {})}
            checkedKeys={pushApiData?.checkedKeys || []}
            setCheckedKeys={(keys)=>updatePushApiData('checkedKeys',keys)}
            halfCheckedKeys={halfCheckedKeys}
            setHalfCheckedKeys={setHalfCheckedKeys}
          />
        </Flex>
      </Flex> : <Conflict setConflictCheckedKeys={(val:any)=>updatePushApiData('conflictCheckedKeys',val)} conflictCheckedKeys={pushApiData?.conflictCheckedKeys || []} searchValue={searchValue} conflictItems={pushApiData?.conflictItems || []} />}
  </>
  );
};
export default ApiCheckBox;