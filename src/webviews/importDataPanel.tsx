import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import ImportData from '@/pages/importData';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { useApis, useGlobal, useSystemConfig, useUserConfig } from '@/store';

import { isArray } from 'lodash';
import useImportData from '@/store/useImportData';

function ImportDataPanel() {
  const customTheme = useGlobalTheme();
  const updateUserConfig = useUserConfig((store) => store.updateUserConfig);
  const updateApiDetailsData = useApis((store) => store.updateApiDetailsData);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);
  const {
    updatePreview: setPreview,
    updatePreviewLoading: setPreviewLoading,
    updatePreviewData: setPreviewData,
    updatePreviewSelectData:setPreviewSelectData
  } = useImportData((store) => store);
  const [lodaing, setLodaing] = useState(true);
  useEffect(() => {
    window?.vscode.postMessage({
      action: 'getApiList',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });

     // Get user information
    window?.vscode.postMessage({
      action: 'getUserConfig',
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
         case 'setUserConfig':
          updateUserConfig({ ...message.data });
          setLodaing(false);
          break;
        case 'setApiList':
          if (isArray(message.data)) {
            updateApiDetailsData(message.data.reduce((pre: any, cur: any) => {
              if (cur?.target_id) {
                pre[cur.target_id] = cur;
              }
              return pre;
            }, {}));
            updateApiOriginDetailsList(message.data);
          }
          setLodaing(false);
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case 'setVscodeTheme':
          updateVscodeTheme(message.data);
          break;
        case 'setImportData':
          
          setPreviewData(message.data);

          if(message.type === 'select_envs'){
            setPreviewSelectData({
              apis: [],
              models: [],
              envs: (message.data?.envs || []).map((i: any) => i?.env_id),
            });
          }else{
            setPreviewSelectData({
              apis: (message.data?.apis || []).map((i: any) => i?.target_id),
              models: (message.data?.models || []).map((i: any) => i?.model_id),
              envs: [],
            });
          }

        
          setPreview(true);
    
          setPreviewLoading(false);
        break;
      }
    }
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    <ConfigProvider
      prefixCls={'beautify'}
      // theme={{ ...customTheme, cssVar: true }}
      theme={{
        token: customTheme.token,
        components: customTheme.components,
      }}
      locale={enUS}
    >
      <AntdApp>
        <ThemeProvider theme={customTheme}>
          <GlobalThemeStyle />
          <GlobalStyle />
          <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={lodaing}>
            <ImportData />
          </Skeleton>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<ImportDataPanel />);
