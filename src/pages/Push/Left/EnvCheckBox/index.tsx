import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex } from 'antd';
import { useApis, useProjectConfig } from '@/store';
import TreeCheckbox from '@/components/business/TreeCheckbox';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { PushEnvData } from '../../type';
import { cloneDeep, isArray } from 'lodash';
import { IconFont } from '@/components/ui';
import { openEnvPage } from '@/events/apis/env';
import { VersionComparison } from '@/components/business';
import { EnvListItem } from '@/types/envManage';

type PushLeftProps = {
  pushEnvData: Partial<PushEnvData>;
  updatePushEnvData: (key: string, val: any) => void;
  searchValue: string;
}

const envFieldNames = {
  title: 'name',
  key: 'env_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
};

const EnvCheckBox = (props: PushLeftProps) => {
  const { searchValue, pushEnvData, updatePushEnvData } = props;
  const { t } = useTranslation();

  const envList = useProjectConfig((store) => store?.envList) || [];

  const [comparisonModalObj,setComparisonModalObj] = useState({
    open:false,
    curItem:{},
  });
  const dataSource = useMemo(() => {
    if (isArray(pushEnvData?.conflictItems)) {
      let copyConflictItems = cloneDeep(pushEnvData?.conflictItems);
      return copyConflictItems.reduce((pre: any, cur: any) => {
        cur.localEnv.parent_id = '0';
        cur.localEnv.target_type = 'env';
        if (cur?.localEnv?.env_id) {
          pre[cur.localEnv.env_id] = cur.localEnv;
        }
        return pre;
      }, {});
    }
    return {};
  }, [pushEnvData?.conflictItems]);

  const titleRender = (nodeData: any) => {

    return (
      <Flex align='center' justify='space-between'>
        {/* Node title */}
        <div className='beautify-tree-title' style={{ flex: 1, width: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {nodeData?.title}
        </div>

        {/* Custom button */}
        <IconFont onClick={(e) => {
          e.stopPropagation();
          // Open environment page
          openEnvPage({
            env_id: nodeData?.key
          });
        }} type='icon-show'></IconFont>
      </Flex>
    );
  };

  const conflictTitleRender = (nodeData: any) => {

    return (
      <Flex align='center' justify='space-between'>
        {/* Node title */}
        <div className='beautify-tree-title' style={{ flex: 1, width: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {nodeData?.title}
        </div>

        {/* Custom button */}
        <IconFont onClick={(e) => {
          e.stopPropagation();
          // Find local and cloud data
          const curItem = pushEnvData?.conflictItems?.find(i=>i?.localEnv?.env_id === nodeData?.key);
          
          // Open comparison modal
          if(curItem !== undefined){
            setComparisonModalObj({
              open: true,
              curItem: curItem
            });
          }
        }} type='icon-contrast'></IconFont>
      </Flex>
    );
  };

  return (<>
    {!isArray(pushEnvData?.conflictItems) || pushEnvData.conflictItems.length <= 0 ? <>
      <Flex style={{ flex: 1 }}>
        <TreeCheckbox
          hasMarkFilter={false}
          hideSearchInput={true}
          searchValue={searchValue}
          originTreeProps={{
            fieldNames: envFieldNames,
            titleRender
          }}
          typeIncludes={['env']}
          dataSource={cloneDeep(envList).reduce((pre: any, cur: any) => {
            cur.parent_id = '0';
            cur.target_type = 'env';
            if (cur?.env_id) {
              pre[cur.env_id] = cur;
            }
            return pre;
          }, {})}
          checkedKeys={pushEnvData?.checkedKeys || []}
          setCheckedKeys={(keys) => updatePushEnvData('checkedKeys', keys)}
        />
      </Flex>
    </> :
      <Flex style={{ flex: 1 }}>
        <TreeCheckbox
          hasMarkFilter={false}
          hideSearchInput={true}
          searchValue={searchValue}
          originTreeProps={{
            fieldNames: envFieldNames,
            titleRender:conflictTitleRender
          }}
          typeIncludes={['env']}
          dataSource={dataSource}
          checkedKeys={pushEnvData?.conflictCheckedKeys || []}
          setCheckedKeys={(keys) => updatePushEnvData('conflictCheckedKeys', keys)}
        />
      </Flex>
    }
    <VersionComparison
      open={comparisonModalObj.open}
      onCancel={() => setComparisonModalObj({
        open: false,
        curItem: {}
      })}
      curItem={comparisonModalObj.curItem as {
        localEnv: EnvListItem;
        cloudEnv: EnvListItem;
    }}   
    />
  </>
  );
};
export default EnvCheckBox;