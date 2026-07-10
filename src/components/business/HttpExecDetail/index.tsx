import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Flex } from 'antd';

import { isEmpty, map, size } from 'lodash';

import ResponseSize from '@/components/business/ResponseSize';
import GhostCollapse from '@/components/ui/GhostCollapse';
import IconFont from '@/components/ui/IconFont';
import PrefixIcon from '@/components/ui/PrefixIcon';
import useTheme from '@/hooks/useTheme';
import { hexToRGBA } from '@/utils/common';

import { InvalidUrl } from './InvalidUrl';
import Request from './Request';
import Response from './Response';

import { HttpExecDetailWrapper } from './style';
import { RuntimeResponse } from '@/types/testing';

export type HttpExecDetailProps = {
  httpExecDetail: RuntimeResponse;
};

const HttpExecDetail = ({ httpExecDetail }: HttpExecDetailProps) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { assertions, request, response } = httpExecDetail || {};

  const renderAssert = () => {
    return (
      <>
        {map(assertions, (item) => {
          const errorMessage = item?.error?.message;

          return (
            <Alert
              className="assert-item"
              style={{
                color: item.passed ? themeToken.colorSuccess : themeToken.colorError,
                backgroundColor: item.passed
                  ? hexToRGBA('#26CEA4', 0.1)
                  : hexToRGBA('#FF583E', 0.1),
              }}
              icon={item.passed ? <IconFont type="icon-checked" /> : <IconFont type="icon-error" />}
              key={item.name}
              type={item.passed ? 'success' : 'error'}
              message={errorMessage ? `${item.name}: ${errorMessage}` : item.name}
              banner
            />
          );
        })}
      </>
    );
  };

  const items = useMemo(() => {
    const result = [
      {
        key: '2',
        label: t('supplement.req_detail'),
        children: <Request httpExecDetail={httpExecDetail} />,
      },
      {
        key: '3',
        label: t('supplement.res_detail'),
        children: <Response httpExecDetail={httpExecDetail} />,
      },
    ];

    if (size(assertions) > 0) {
      result.unshift({
        key: '1',
        label: t('supplement.assert'),
        children: renderAssert(),
      });
    }

    return result;
  }, []);

  return (
    <HttpExecDetailWrapper $token={themeToken}>
      <Flex vertical gap={12} style={{ marginBottom: 16 }} flex={1}>
        {request?.url && (
          <Flex align="flex-start" className="url-container">
            <PrefixIcon
              type="api"
              method={request?.method}
              style={{ width: 'auto', marginTop: 4 }}
            />
            <div className="url">{request?.url}</div>
          </Flex>
        )}
        {!isEmpty(response) && <ResponseSize response={response} showLine={false} showIcon={false} showProxy={true}/>}
      </Flex>
      <GhostCollapse defaultActiveKey={['1', '2', '3']} items={items} />
    </HttpExecDetailWrapper>
  );
};

export default HttpExecDetail;
