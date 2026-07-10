import { ApiComponentType } from '@/types/apis/api';
import { AnyObject } from '@/types/common';
import { Button, Flex } from 'antd';
import produce from 'immer';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isArray, isEqual } from 'lodash';
import { genQueryByUrl, genRestfulByUrl, getNewApisDataByCurlChange } from '@/utils/apis';
import UrlGroup from '@/components/business/UrlGroup';
import { useApis } from '@/store';
import useTheme from '@/hooks/useTheme';
import { HeaderContainer } from './style';
import { CurlDataType } from '@/types/apis/other';

const Header: FC<ApiComponentType> = ({ apisData, onApisDataChange, type }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const currentSendingData = useApis(store => store.currentSendingData);
  const updateCurrentSendingData = useApis(store => store.updateCurrentSendingData);

  const [curServerId,SetCurServerId] = useState('');

  const handleChange = (key: string, value: string) => {
    onApisDataChange(produce(apisData, (draft: AnyObject) => {
      draft[key] = value;
      if (key === 'url') {
        if (isArray(draft?.request?.query?.parameter)) {
          draft.request.query.parameter = genQueryByUrl(
            `${value}`,
            draft?.request?.query?.parameter || []
          );
        }

        if (isArray(draft?.request?.restful?.parameter)) {
          draft.request.restful.parameter = genRestfulByUrl(
            `${value}`,
            draft?.request?.restful?.parameter || []
          );
        }
      }
    }));
  };
  const isSending = isEqual(currentSendingData?.sendStatus, 'sending');

  const handleSend = (option?: {server_id : string}) => {
    updateCurrentSendingData({ sendStatus: 'sending' });
    window?.vscode.postMessage({
      action: 'sendApi',
      data: apisData,
      option:{
        server_id: curServerId,
        ...option
      }
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

    // Disable Enter key send when using modifier shortcuts
    const ctrlDown = event.metaKey || event.ctrlKey;
    if (event?.keyCode === 13 && !ctrlDown) {
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const urlGroupData = useMemo(
    () => ({
      url: apisData.url,
      method: apisData.method,
      protocol: apisData.protocol,
    }),
    [apisData]
  );

  const curlChange = (d: CurlDataType) => {
    
    const newData = getNewApisDataByCurlChange(apisData, d);
    onApisDataChange(newData);
  };

  return (
    <HeaderContainer>
      <UrlGroup
        className="url-group-wrap"
        type={type || 'api'}
        maxLength={10240}
        data={urlGroupData}
        placeholder={t('api.common.curl_placeholder')}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        curServerId={curServerId}
        SetCurServerId={SetCurServerId}
        curlChange={curlChange}
        supportCurlImport
        style={{
          paddingRight:'0'
        }}
        urlGroupExtraContent={<Button
          type="primary"
          size='middle'
          onClick={() => {
            handleSend();
          }}
          style={{padding:0,fontSize:'13px',borderRadius: "0 4px 4px 0"}}
          disabled={isSending}
        >
          {isSending ? `${t('api.run.sending')}...` : t('api.run.send')}
        </Button>}
      />
      <Flex gap={4} align='center'>
        <Button
          type="default"
          size="middle"
          onClick={() => {
            window?.vscode.postMessage({
              action: 'saveApiData',
              data: apisData
            });
          }}
          style={{padding:0,fontSize:'13px'}}
        >
          {t('api.run.save')}
        </Button>
      </Flex>
    </HeaderContainer>
  )
};

export default Header;
