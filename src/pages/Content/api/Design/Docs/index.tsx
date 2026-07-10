import React from 'react'
import { TabsWrap } from './style';
import { Flex, message, Tabs, theme, Tooltip } from 'antd';
import { DOCS_TAB_LIST } from './constants';
import { RedocStandalone } from 'redoc';
import { Modal } from '@/components/ui/Modal';
import { ApiDetailsData } from '@/types/apis/api';
import { Button } from '@/components/ui';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;
export default function index(props: { apisData: ApiDetailsData,swaggerJson:any }) {
  try {
  const { t } = useTranslation();
    const { token } = useToken();
    const { apisData, swaggerJson } = props;
    const [modal, contextHolder] = Modal.useModal();
    const tabExtraContent = (
      <Flex>
        <Tooltip title={t('common.try_it_tip')}>
        <Button
          style={{ marginRight: '16px' }}
          className='beautify-text-btn-highlight'
          onClick={() => {
            if (apisData.is_create === 1) {
              modal?.confirm({
                title: t('common.save_request_open_debug_title'),
                content: t('common.save_request_open_debug_content'),
                okText: 'Save and Open',
                cancelText: 'Cancel',
                async onOk() {
                  window?.vscode.postMessage({
                    action: 'saveAndopenTagPanelById',
                    data: apisData
                  });
                },
              });

              return;
            }
            window?.vscode.postMessage({
              action: 'openTagPanelById',
              data: apisData.target_id
            });
          }}
          type="text"
          mode="light"
        >
          {t('common.try_it')}
        </Button>
        </Tooltip>
        
      </Flex>
    );
  
    return (
      <TabsWrap $token={token}>
        <Tabs
          tabBarGutter={6}
          destroyInactiveTabPane
          tabBarExtraContent={tabExtraContent}
          items={
            DOCS_TAB_LIST.map((item) => ({
              label: item.label,
              key: item.key,
              children: (
                <RedocStandalone options={{
                  theme:{
                    sidebar:{
                      width: '0px',
                      backgroundColor:'transparent',
                      textColor:'transparent'
                    },
                    logo:{
                      maxWidth:'0px',
                      maxHeight:'0px'
                    }
                  },
                  hideDownloadButton:true,
                  hideHostname:true,
                }} spec={swaggerJson}/>
              ),
            })) as any
          }
        />
         {contextHolder}
      </TabsWrap>
    )
  } catch (error) {
  }
}
