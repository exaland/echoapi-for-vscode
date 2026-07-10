import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedProps, Typography } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';

import SegmentedTabs from '@/components/business/SegmentedTabs';

import CommonTable from './CommonTable';

import { RealRequestContainer, RequestItem } from './style';

const { Text } = Typography;

interface Props {
  sendingData?: any;
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
      label: 'query',
      children: <CommonTable value={sendingData?.request?.query || []} />,
    },
  ];

  return (
    <RealRequestContainer>
      <RequestItem>
        <Text className="title">{t('supplement.req_url')}</Text>
        <div className="content-warp base-info-wrap">
          <Flex align="flex-start">
            <div className="url">{sendingData?.url}</div>
          </Flex>
        </div>
      </RequestItem>
      <RequestItem>
        <Text className="title">{t('supplement.req_param')}</Text>
        <div className="content-warp content-request">
          <SegmentedTabs
            options={segmentedOptions}
            value={tabsValue}
            onChange={handleOptionsChange}
          />
        </div>
      </RequestItem>
    </RealRequestContainer>
  );
};

export default RealRequest;
