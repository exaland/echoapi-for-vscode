import { TabPaneProps } from 'antd';
import React, { FC, lazy, useMemo } from 'react';
import { RequestProps } from './types';
import produce from 'immer';
import RequestRestful from './Restful';

import { DirectionType } from '@/types/common';
import { useMemoizedFn } from 'ahooks';
import { calcTabLineBodyHeaderNum } from '@/utils/common';
import { RequestContainer } from './style';
import { compact, concat, map, size } from 'lodash';
import { LineTabs, SuspenseContent } from '@/components/business';
import { useTranslation } from 'react-i18next';


const RequestHeader = lazy(() => import('./components/Header'));
const RequestQuery = lazy(() => import('./components/Query'));
const RequestCookie = lazy(() => import('./components/Cookie'));

const Request: FC<RequestProps & { direction?: DirectionType }> = ({
  direction,
  requestData,
  onRequestDataChange,
  includesTabs,
  extra = [],
  requestBody,
  onRequestBodyChange   }) => {

  const originItems: Array<
    TabPaneProps & { countParams?: any; key: string; label: React.ReactNode }
  > = [
      {
        key: 'Headers',
        label: 'Headers',
        children: (
          <RequestHeader
            tabType={'header'}
            dataSource={requestData.filter(i=>i?.in == 'header')}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                const newHeader = val;
                return draft.filter(i=>i?.in !== 'header').concat(newHeader);
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData.filter(i=>i?.in == 'header'),
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Params',
        label: 'Params',
        children: (
          <RequestQuery
            tabType={'query'}
            dataSource={(requestData.filter(i=>i?.in == 'query'))}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                return draft.filter(i=>i?.in !== 'query').concat(val);
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData.filter(i=>i?.in == 'query'),
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Path',
        label: 'Path',
        children: (
          <RequestRestful
            tabType={'restful'}
            value={requestData.filter(i=>i?.in == 'path')}
            onChange={(val)=>{
              onRequestDataChange(produce(requestData, (draft) => {
                return draft.filter(i=>i?.in !== 'path').concat(val);
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData.filter(i=>i?.in == 'path'),
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Cookie',
        label: 'Cookie',
        children: (
          <RequestCookie
            tabType={'cookie'}
            dataSource={(requestData.filter(i=>i?.in == 'cookie'))}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                return draft.filter(i=>i?.in !== 'cookie').concat(val);
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData.filter(i=>i?.in == 'cookie'),
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
    ];
  const tabsItems = useMemo(() => {
    const _originItems = map(originItems, (item) => ({
      ...item,
      children: (<SuspenseContent>{item.children}</SuspenseContent>) as React.ReactNode,
    }));

    const mergeItems = concat([], _originItems, extra);
    const finalItems =
      size(includesTabs) > 0
        ? compact(
          map(includesTabs, (key: string) => mergeItems?.find((item) => item.key === key))
        )
        : _originItems;

    return finalItems;
  }, [originItems, extra, includesTabs]);
  return (
    <RequestContainer $direction={direction || 'vertical'}>
      <LineTabs
        defaultActiveKey="Headers"
        items={tabsItems}
      />
    </RequestContainer>
  );
};

export default Request;
