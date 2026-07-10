import React, { lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useMemoizedFn } from 'ahooks';
import { isEmpty, isEqual, map, size } from 'lodash';

import { LineTabs, SuspenseContent } from '@/components/business';
import { Button, IconFont } from '@/components/ui';
import useApisWebsocket2 from '@/store/useApis/websocket2';

import Empty from './Empty';

import { LineBarContainer } from '../style';

const Realtime = lazy(() => import('./Realtime'));

const ResponseHeader = lazy(
  () => import('@/components/business/Response/components/ResponseHeader')
);
const Cookie = lazy(() => import('@/components/business/Response/components/Cookie'));
const RealRequest = lazy(() => import('./RealRequest'));

const Response: React.FC = (props: any) => {
  const websocket2ConnectionPool = useApisWebsocket2((state) => state.websocket2ConnectionPool);
  const { value, onChange } = props || {};
  const { t } = useTranslation();

  const originItems = [
    {
      key: 'realtime',
      label: t('api.run.response_tab'),
      children: <Realtime value={value} onChange={onChange} />,
    },
    {
      key: 'responseHeader',
      label: t('api.run.response_header'),
      children: (
        <div style={{ marginTop: 12 }}>
          <ResponseHeader
            value={
              websocket2ConnectionPool[value?.target_id]?.responseData?.response?.headers || {}
            }
          />
        </div>
      ),
      countParams: {
        dataSource:
          websocket2ConnectionPool[value?.target_id]?.responseData?.response?.headers || [],
      },
    },
    {
      key: 'cookie',
      label: 'Cookie',
      children: (
        <div style={{ marginTop: 12 }}>
          <Cookie
            value={
              websocket2ConnectionPool[value?.target_id]?.responseData?.response?.cookies || []
            }
          />
        </div>
      ),
      countParams: {
        dataSource:
          websocket2ConnectionPool[value?.target_id]?.responseData?.response?.cookies || [],
      },
    },
    {
      key: 'realRequest',
      label: t('api.run.real_request'),
      children: (
        <div style={{ marginTop: 12 }}>
          <RealRequest sendingData={websocket2ConnectionPool[value?.target_id]?.responseData} />
        </div>
      ),
      countParams: {
        showDot: !isEmpty(websocket2ConnectionPool[value?.target_id]?.responseData),
      },
    },
  ];
  const tabsItems = useMemoizedFn(() => {
    const _originItems = map(originItems, (item) => ({
      ...item,
      children: (
        <SuspenseContent key={item.key}>{item.children}</SuspenseContent>
      ) as React.ReactNode,
    }));

    return _originItems;
  });
  const isNotEmpty = useMemo(() => {
    return (
      size(websocket2ConnectionPool[value?.target_id]?.socketRes) > 0 ||
      !isEmpty(websocket2ConnectionPool[value?.target_id]?.responseData)
    );
  }, [value?.target_id, websocket2ConnectionPool]);
  return (
    <LineBarContainer>
      {!isNotEmpty && <Empty maskMode />}
      <LineTabs
        items={tabsItems()}
        tabBarExtraContent={
          <Flex align="center" gap={12}>
            {isEqual(websocket2ConnectionPool[value?.target_id]?.status, 'connect') && (
              <Button
                icon={<IconFont type="icon-link" />}
                style={{ color: '#26cea4', cursor: 'default' }}
                type="text"
                mode="success"
                size="small"
              >
                {t('ws.response.connect_success')}
              </Button>
            )}
          </Flex>
        }
      />
    </LineBarContainer>
  );
};

export default Response;
