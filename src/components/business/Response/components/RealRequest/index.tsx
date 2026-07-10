import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedProps, Typography } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import { includes, isEqual } from 'lodash';

import MonacoEditor from '@/components/business/MonacoEditor';
import SegmentedTabs from '@/components/business/SegmentedTabs';
import ApisTypeTag from '@/components/ui/ApisTypeTag';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { ApiTypeMethod } from '@/types/apis/base';
import { ApiSendingData } from '@/types/apis/send';

import CommonTable from '../CommonTable';

import { RealRequestContainer, RequestItem, TabBarExtraContentWrap } from './style';

const { Text } = Typography;

interface Props {
  sendingData?: Partial<ApiSendingData>;
}

const RealRequest: React.FC<Props> = ({ sendingData }) => {
  const { t } = useTranslation();
  const [tabsValue, setTabsValue] = useSafeState<string | number>('header');

  const handleOptionsChange: SegmentedProps['onChange'] = useMemoizedFn((value) => {
    setTabsValue(value);
  });

  const segmentedOptions = [
    {
      value: 'header',
      label: 'header',
      children: <CommonTable value={sendingData?.request?.headers || []} />,
    },
    {
      value: 'query',
      label: 'params',
      children: <CommonTable value={sendingData?.request?.querys || []} />,
    },
    {
      value: 'path',
      label: 'path',
      children: <CommonTable value={sendingData?.request?.paths || []} />,
    },
    {
      value: 'body',
      label: 'body',
      children: <BodyParameter request={sendingData?.request} />,
    },
  ];

  const tabBarExtraContent = isEqual(tabsValue, 'body') ? (
    <TabBarExtraContentWrap>
      <div className="title">{t('supplement.type')}:</div>
      <div className="content">{sendingData?.request?.mode}</div>
    </TabBarExtraContentWrap>
  ) : null;

  return (
    <RealRequestContainer>
      <RequestItem>
        <Text className="title">{t('supplement.req_url')}</Text>
        <div className="content-warp base-info-wrap">
          <Flex align="flex-start">
            <ApisTypeTag
              targetType={APIS_TARGET_TYPE_ENUM.API}
              method={(sendingData?.request?.method as ApiTypeMethod) || 'GET'}
            />
            <div className="url">{sendingData?.request?.url}</div>
          </Flex>
        </div>
      </RequestItem>
      <RequestItem>
        <Text className="title">{t('supplement.req_param')}</Text>
        <div className="content-warp content-request">
          <SegmentedTabs
            options={segmentedOptions}
            tabBarExtraContent={tabBarExtraContent}
            value={tabsValue}
            onChange={handleOptionsChange}
          />
        </div>
      </RequestItem>
    </RealRequestContainer>
  );
};

const BodyParameter = ({ request }: { request?: ApiSendingData['request'] }) => {
  const { t } = useTranslation();
  const { mode } = request || {};

  if (mode === 'none') {
    return <Text>{t('supplement.no_req_param')}</Text>;
  }

  if (mode === 'binary') {
    return <Text>{t('supplement.binary_param')}</Text>;
  }

  if (includes(['json', 'xml', 'javascript', 'plain', 'html', 'msgpack'], mode)) {
    return (
      <div style={{ height: 300 }}>
        <MonacoEditor
          language={mode === 'msgpack' ? 'json' : mode}
          height="100%"
          value={request?.body as string}
          readOnly
        />
      </div>
    );
  }

  if (includes(['form-data', 'urlencoded'], mode)) {
    return <CommonTable value={(request?.body as { [x: string]: string | string[] }) || []} />;
  }
};

export default RealRequest;
