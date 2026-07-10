import React, { useCallback } from 'react';
import { HistoryReportListWrapper, HistoryReportListItem } from './style';
import { TestingReportList } from '@/types/testing/res';
import { isArray, last } from 'lodash';
import { Dropdown, Flex, MenuProps, Tooltip, Typography } from 'antd';
import cn from 'classnames';
import { IconFont } from '@/components/ui';
import { formatTimeToDateTimeLong } from '@/utils/time';
import SvgTestSuccess from '@/assets/icon/test_success.svg?react';
import SvgTestError from '@/assets/icon/test_error.svg?react';
import { useApis } from '@/store';
import { ApiDetailsData } from '@/types/apis/api';
import { useTranslation } from 'react-i18next';

type HistoryReportListProps = {
  reportList :TestingReportList[]
}

const HistoryReportList=({reportList}:HistoryReportListProps)=> {
  const { t } = useTranslation();

  const testsActiveKey = useApis((state) => state.testsActiveKey);
  const updateTestsActiveKey = useApis((state) => state.updateTestsActiveKey);

  const reportItemClick=(reportData: TestingReportList)=>{
    updateTestsActiveKey(reportData?.report_id);
    window?.vscode.postMessage({
      action: 'openReportData',
      data:reportData
    });
  };

  const dropdownContextMenu: MenuProps['items'] = [
    {
      label: <Flex gap={8} align='center'>
        <IconFont type="icon-delete" />
        {t('common.folder_operate.delete')}
      </Flex>,
      key: 'delete',
    },
  ];

  const handleMoreOperateClick =async (nodeItem: TestingReportList, keyPath: string[]) => {
    const actionType = last(keyPath) || '';
    switch (actionType) {
      case 'delete':
        window?.vscode.postMessage({
          action: 'deleteReport',
          data: { report_id: nodeItem.report_id }
        });
        break;
      default:
        break;
    }
  };

  const nodeItemDropdownContextMenu = useCallback((nodeItem: TestingReportList): MenuProps => {
    return {
      items: dropdownContextMenu,
      onClick: ({ keyPath }) => handleMoreOperateClick(nodeItem, keyPath),
    };
  }, []);
  
  return (
    <HistoryReportListWrapper>
      {isArray(reportList) && reportList.length > 0 && reportList.map(item=>
      <Dropdown trigger={['contextMenu']} menu={nodeItemDropdownContextMenu(item)}>
      <HistoryReportListItem className={cn({
        'select-item':testsActiveKey === item.report_id
      })} onClick={()=>reportItemClick(item)}>
        <Flex gap={4} align='center'>
        {item?.complete?.http?.success === item?.complete?.http?.total ? <SvgTestSuccess className='icon-ok' /> : <SvgTestError className='icon-small-close' />}
        <Tooltip placement="topLeft" title={item?.report_name}>
        <Typography.Text style={{maxWidth:'120px',fontSize:'14px'}} ellipsis>
          {item?.report_name || 'Test Report'}
        </Typography.Text>
        </Tooltip>
        </Flex>
    
        <Flex align='center'>
        <Typography.Text style={{fontSize:'10px'}}>
          {formatTimeToDateTimeLong(item.complete.start_at)}
        </Typography.Text>
        </Flex>
      </HistoryReportListItem>
    </Dropdown>


      )}
    </HistoryReportListWrapper>
  );
};

export default HistoryReportList;