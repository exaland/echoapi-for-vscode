import useFolders from '@/hooks/useFolders';
import { Button, Flex, message, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { TestsWrapper } from './style';
import HistoryReportList from './HistoryReportList';
import useTesting from '@/store/useTesting';
import { useApis, useUserConfig } from '@/store';
import { isPlainObject, isString } from 'lodash';

const Tests = () => {
  const { t } = useTranslation();
  const { apisFolders } = useFolders({addRootFolder: false});
  const projectTestingReportList = useTesting((state) => state.projectTestingReportList);
  const apiOriginDetailsList = useApis((state) => state.apiOriginDetailsList);
  const currentProject = useUserConfig((state) => state.currentProject);
  const [ selectFolderId, setSelectFolderId ]=useState<string | undefined>(undefined);

  useEffect(()=>{
    setSelectFolderId(undefined);
  },[currentProject.project_id]);

  const onRunClick = ()=>{
    if(selectFolderId === undefined){
      message.error('Please select a directory');
      return;
    }
    let folderData = apiOriginDetailsList.find(i=>i?.target_id === selectFolderId);
    if(isPlainObject(folderData)){
      window?.vscode.postMessage({
        action: 'runFolder',
        data: folderData
      });
    }
    
  };

  useEffect(()=>{
    if(isString(selectFolderId) && apiOriginDetailsList.find(i=>i?.target_id === selectFolderId) === undefined){
      setSelectFolderId(undefined);
    }
  },[apiOriginDetailsList,selectFolderId]);

  return (
    <TestsWrapper>
    <Flex gap={4}>
      <TreeSelect
        popupClassName="import-project-full-select"
        // getPopupContainer={(triggerNode: HTMLElement) =>
        //   triggerNode.parentNode as HTMLElement
        // }
        popupMatchSelectWidth={false}
        showSearch
        filterTreeNode={(input, treeNode) => {
          return treeNode?.name?.includes(input);
        }}
        treeDefaultExpandAll
        placeholder={t('supplement.select_folder_tip')}
        style={{ flex: 1,overflow:'auto' }}
        fieldNames={{
          label: 'name',
          value: 'target_id',
          children: 'children',
        }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto',maxWidth:200 }}
        treeData={apisFolders}
        value={selectFolderId}
        onChange={(value) => setSelectFolderId(value)}
      />
      <Button onClick={onRunClick} type='primary'>
          {t('common.folder_operate.run_all')}
      </Button>
    </Flex>
    <HistoryReportList reportList={projectTestingReportList}/>
    </TestsWrapper>
  )
}

export default Tests;
