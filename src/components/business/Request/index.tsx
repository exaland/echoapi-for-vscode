import { TabPaneProps } from 'antd';
import React, { FC, lazy, ReactNode, useEffect, useMemo } from 'react';
import { RequestProps } from './types';
import produce from 'immer';
import RequestRestful from './Restful';
import RequestBody from './Body';
import RequestPreTask from './PreTask';
import RequestAuth from './Auth';

import RequestPostTask from './PostTask';
import { ApiRequest } from '@/types/apis/request';
import { ChangeFuncType, DirectionType } from '@/types/common';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { calcTabLineBodyHeaderNum, getAllParentDirectories } from '@/utils/common';
import { RequestContainer } from './style';
import { compact, concat, forEach, head, includes, keys, map, reverse, size } from 'lodash';
import { LineTabs, SuspenseContent } from '@/components/business';
import { useTranslation } from 'react-i18next';
import { useApis, useProjectConfig } from '@/store';
import { ApisBaseDataItem } from '@/types/apis/base';
import { ApisData } from '@/types/apis/api';
import { APIS_TASK_TYPES_ENUM } from '@/constants/apis';

const RequestHeader = lazy(() => import('./components/Header'));
const RequestQuery = lazy(() => import('./components/Query'));
const RequestCookie = lazy(() => import('./components/Cookie'));

const Request: FC<RequestProps & { direction?: DirectionType;tabBarExtraContent?: ReactNode;tabOptions?:any; }> = ({ target_id,isSystem ,direction, tabOptions={},requestData, apiData , onRequestDataChange, includesTabs, extra = [], tabBarExtraContent }) => {
  const { t } = useTranslation();
  const apiDetailsData = useApis((state) => state.apiDetailsData);

  const globalParams = useProjectConfig((state) => state.globalParams);
  const handleRequestChange: ChangeFuncType<ApiRequest> = useMemoizedFn((key, newVal) => {

    const newData = produce(requestData, (draft) => {
      draft[key] = newVal;
    });

    onRequestDataChange?.(newData);
  });

  const [allParentDirectories, setAllParentDirectories] = useSafeState<{
    [k: string]: ApisBaseDataItem[];
  }>({});

  useEffect(() => {
    const allParentFolder = getAllParentDirectories(apiDetailsData, target_id || '');
    const reverseFolder = reverse(allParentFolder);

    const folderParams: { [k: string]: ApisBaseDataItem[] } = {
      header: [],
      query: [],
      body: [],
      restful: [],
      cookie: [],
    };

    forEach(reverseFolder, (item: ApisData) => {
      const { request } = item || {};

      if (!request) return;

      forEach(keys(folderParams), (key) => {
        if (request[key]) {
          folderParams[key] = concat(
            [],
            folderParams[key],
            request[key]?.parameter?.map((e: any) => ({ ...e, target_id: item?.target_id })) // Associate target_id for public parameter navigation
          );
        }
      });
    });

    setAllParentDirectories(folderParams);
  }, [target_id, apiDetailsData]);

  const originItems: Array<
    TabPaneProps & { countParams?: any; key: string; label: React.ReactNode }
  > = [
      {
        key: 'Headers',
        label: 'Headers',
        children: (
          <RequestHeader
            tabType={'header'}
            dataSource={requestData?.header?.parameter || []}
            globalParams={globalParams?.header?.parameter}
            folderParams={allParentDirectories?.header}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                draft!.header = {
                  parameter: val
                };
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData?.header?.parameter,
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Params',
        label: 'Params',
        children: (
          <RequestQuery
            tabType={'query'}
            dataSource={requestData?.query?.parameter || []}
            globalParams={globalParams?.query?.parameter}
            folderParams={allParentDirectories?.query}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                if (!draft?.query) {
                  draft.query = {
                    parameter: [],
                    query_add_equal: 1
                  };
                }
                draft!.query!.parameter = val;
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData?.query?.parameter,
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Path',
        label: 'Path',
        children: (
          <RequestRestful
            tabType={'restful'}
            value={requestData?.restful}
            onChange={handleRequestChange}
          />
        ),
        countParams: {
          dataSource: requestData?.restful?.parameter,
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Body',
        label: 'Body',
        children: (
          <RequestBody
            tabType={'body'}
            value={requestData?.body}
            apiData={apiData}
            onChange={handleRequestChange}
            globalParams={globalParams?.body?.parameter}
            folderParams={allParentDirectories?.body}
          />
        ),
        countParams: {
          dataSource: requestData?.body,
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'Auth',
        label: t('api.run.auth'),
        children: (
          <RequestAuth
            isSystem={isSystem}
            value={requestData?.auth}
            onChange={handleRequestChange}
          />
        ),
        countParams: {
          showDot: !includes(['noauth', 'inherit'], requestData?.auth?.type) || !requestData?.auth?.type,
        },
      },
      {
        key: 'Cookie',
        label: 'Cookie',
        children: (
          <RequestCookie
            tabType={'cookie'}
            dataSource={requestData?.cookie?.parameter || []}
            globalParams={globalParams?.cookie?.parameter}
            folderParams={allParentDirectories?.cookie}
            onChange={(val) => {
              onRequestDataChange(produce(requestData, (draft) => {
                draft.cookie = {
                  parameter: val
                };
              }));
            }}
          />
        ),
        countParams: {
          dataSource: requestData?.cookie?.parameter,
          customCalcFun: calcTabLineBodyHeaderNum,
        },
      },
      {
        key: 'preRequest',
        label: t('common.pre_task'),
        children: <RequestPreTask value={requestData?.pre_tasks || []} onChange={handleRequestChange} />,
        countParams: {
          showDot: size((requestData?.pre_tasks || []).filter(i=>i?.type !== APIS_TASK_TYPES_ENUM.DATABASE)) > 0,
        },
      },
      {
        key: 'postResponse',
        label: t('common.post_task'),
        children: (
          <RequestPostTask
            value={requestData?.post_tasks || []}
            onChange={handleRequestChange}
            apiData={apiData}
          />
        ),
        countParams: {
          showDot:  size((requestData?.post_tasks || []).filter(i=>i?.type !== APIS_TASK_TYPES_ENUM.DATABASE)) > 0,
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
  }, [originItems, extra, includesTabs,requestData?.body?.parameter?.length, allParentDirectories?.header]);
  
  return (
    <RequestContainer $direction={direction || 'vertical'}>
      <LineTabs
        items={tabsItems}
        tabBarExtraContent={tabBarExtraContent}
        defaultActiveKey={tabOptions?.defaultActiveKey || head(tabsItems)?.key}
        {...tabOptions}
      />
    </RequestContainer>
  );
};

export default Request;
