import { TabPaneProps } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import produce from 'immer';
import General from './General';
import Request from './Request';
import Response from './Response';
import { ChangeFuncType } from '@/types/common';
import { useMemoizedFn } from 'ahooks';
import { RequestContainer } from './style';
import { concat, map } from 'lodash';
import { LineTabs, SuspenseContent } from '@/components/business';
import { useTranslation } from 'react-i18next';
import { OpenApiMainObj } from '@/types/apis/api';
import RequestBody from '../DesignRequestPanel/Body';

interface Props {
  openApiMainObj: OpenApiMainObj;
  onOpenApiMainChange: (data: OpenApiMainObj) => void
  tabBarExtraContent?: ReactNode;
}

const DesignRequest: FC<Props> = ({ openApiMainObj , onOpenApiMainChange ,tabBarExtraContent }) => {
  const { t } = useTranslation();
  
  const handleChange: ChangeFuncType<OpenApiMainObj> = useMemoizedFn((field, value) => {
    const newData = produce(openApiMainObj, (draft) => {
      draft[field] = value;
    });

    onOpenApiMainChange(newData);
  });

  

  const handleRequestBodyChange = useMemoizedFn((newVal) => {
    
    const newData = produce(openApiMainObj.requestBody, (draft) => {
      draft.content = newVal;
    });

    handleChange?.('requestBody',newData);
  });

  const originItems: Array<
    TabPaneProps & { countParams?: any; key: string; label: React.ReactNode }
  > = [
      {
        key: 'general',
        label: t('system_settings.shortcuts.general'),
        children: (
          <General 
          value={openApiMainObj?.description || ''} 
          onChange={handleChange}
          />
        ),
      },
      {
        key: 'request',
        label: 'Parameters',
        children: (
          <Request openApiMainObj={openApiMainObj} onOpenApiMainChange={onOpenApiMainChange}  />
        ),
      },
      {
        key: 'request_body',
        label: 'Request Body',
        children: (
          <RequestBody
            tabType={'body'}
            value={openApiMainObj?.requestBody?.content || {}}
            onChange={handleRequestBodyChange}
          />
        ),
      },
      {
        key: 'response',
        label: t('supplement.res_exp'),
        children: (
          <Response value={openApiMainObj.responses} onChange={(val:any)=>handleChange('responses', val)} />
        ),
      },
    ];
  const tabsItems = useMemo(() => {
    const _originItems = map(originItems, (item) => ({
      ...item,
      children: (<SuspenseContent>{item.children}</SuspenseContent>) as React.ReactNode,
    }));

    const mergeItems = concat([], _originItems);

    return mergeItems;
  }, [originItems]);
  return (
    <RequestContainer $direction={'vertical'}>
      <LineTabs
        tabBarExtraContent={tabBarExtraContent}
        defaultActiveKey="Headers"
        items={tabsItems}
      />
    </RequestContainer>
  );
};

export default DesignRequest;
