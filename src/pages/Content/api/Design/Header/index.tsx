import { OpenApiComponentType, ParametersItem } from '@/types/apis/api';
import { AnyObject } from '@/types/common';
import { Flex } from 'antd';
import produce from 'immer';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';
import { designGenRestfulByUrl } from '@/utils/apis';
import UrlGroup from '@/components/business/UrlGroup';
import useTheme from '@/hooks/useTheme';
import { HeaderContainer } from './style';

const Header: FC<OpenApiComponentType> = ({ apisData, openApiData, onOpenApiDataChange, setPreView }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const [curServerId, SetCurServerId] = useState('');

  const handleChange = (key: string, value: string) => {
    onOpenApiDataChange(produce(openApiData, (draft: AnyObject) => {
      // draft[key] = value;
      if (key === 'url') {
        const oldUrl = Object.keys(draft)[0];
        // Save old property value
        const oldValue = draft[oldUrl];
        // Delete old property
        delete draft[oldUrl];
        // Add new property and assign value
        draft[value] = oldValue;


        const method = Object.keys(draft[value])[0];
        const openApiObj = oldValue[method];
        if (isArray(openApiObj?.parameters)) {
          openApiObj.parameters = openApiObj.parameters.filter((i:ParametersItem)=>i?.in !== 'path').concat(designGenRestfulByUrl(
            `${value}`,
            openApiObj.parameters || []
          ));
        }
      }
      if (key === 'method') {
        const oldUrl = Object.keys(draft)[0];
        const methodObj = draft[oldUrl];
        const method = Object.keys(draft[oldUrl])[0];
        const openApiObj = methodObj[method];
        // Save old property value
        const oldValue = openApiObj;
        // Delete old property
        delete methodObj[method];
        // Add new property and assign value
        methodObj[value.toLocaleLowerCase()] = oldValue;
      }
    }));
  };

  const handlePreview = () => {
    setPreView && setPreView((pre: boolean) => {
      return !pre;
    });
    // updateCurrentSendingData({ sendStatus: 'sending' });
    // window?.vscode.postMessage({
    //   action: 'sendApi',
    //   data: apisData,
    //   option:{
    //     server_id: curServerId,
    //     ...option
    //   }
    // });
  };
 
  

  const urlGroupData = useMemo(
    () => {
      const url = Object.keys(openApiData)[0];
      const methodObj = openApiData[url];
      const method = Object.keys(methodObj)[0];
      return {
        url: url,
        method: method.toLocaleUpperCase(),
        protocol: '',
      }
    },
    [openApiData]
  );
  
  return (
    <HeaderContainer>
      <UrlGroup
        className="url-group-wrap"
        type={'api'}
        maxLength={10240}
        data={urlGroupData}
        onChange={handleChange}
        curServerId={curServerId}
        SetCurServerId={SetCurServerId}
        hideProtocol={true}
        hideServer={true}
        style={{
          paddingRight:'0'
        }}
        urlGroupExtraContent={<Button
          type="primary"
          size="middle"
          onClick={() => {
            window?.vscode.postMessage({
              action: 'saveApiData',
              data: apisData
            });
          }}
          style={{ padding: 0, fontSize: '13px',borderRadius: "0 4px 4px 0" }}
        >
          {t('api.run.save')}
        </Button>}
      />
      <Flex gap={4} align='center'>
        <Button
          type="default"
          size='middle'
          onClick={() => {
            handlePreview();
          }}
          style={{ padding: 0, fontSize: '13px' }}
        >
          {t('supplement.preview')}
        </Button>
      </Flex>
    </HeaderContainer>
  )
};

export default Header;
