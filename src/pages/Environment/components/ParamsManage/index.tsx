import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, message } from 'antd';

import RequestGlobal from '@/components/business/RequestGlobal';
import Button from '@/components/ui/Button';
import { RequestGlobalParams } from '@/types/project';

import { ParamsManageContainer } from './style';
import useProjectConfig from '@/store/useProjectConfig';
import { saveProjectConfig } from '@/events/apis/env';
import { FC } from 'react';

const Index:FC<{defaultTabKey?:string}> = ({defaultTabKey='Headers'}) => {
  const { t } = useTranslation();
  const { projectId } = useParams();

  const globalParams = useProjectConfig((state) => state.globalParams);
  const updateGlobalParams = useProjectConfig((state) => state.updateGlobalParams);

  const onOk = () => {
    try {
      saveProjectConfig('globalParams', globalParams);
      message.success('Success');
    } catch (err) {
      /* empty */
    }
  };

  return (
    <ParamsManageContainer>
      <Flex className="params-flex" vertical gap={15}>
        <Flex vertical gap={15}>
          <span className="title">{t('global_setting.key_detail.title')}</span>
          <span className="tip">{t('global_setting.key_detail.tips')}</span>
        </Flex>
        <div className="params-content">
          <RequestGlobal
            defaultTabKey={defaultTabKey}
            isSystem={true}
            requestData={globalParams}
            onRequestDataChange={(e) => {
              updateGlobalParams(e);

            // Auto-save logic
            // onOk(e);
            }}
          />
        </div>
        <Flex justify="flex-end">
          <Button onClick={onOk} type="primary">
            {t('global_setting.key_detail.save')}
          </Button>
        </Flex>
      </Flex>
    </ParamsManageContainer>
  );
};

export default Index;
