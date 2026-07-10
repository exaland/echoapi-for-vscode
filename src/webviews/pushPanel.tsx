import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import Push from '@/pages/Push';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { isArray, isPlainObject } from 'lodash';
import { useApis, useProjectConfig, useSystemConfig, useUserConfig } from '../store';

function PushPanel() {
  const customTheme = useGlobalTheme();

  const updateUserConfig = useUserConfig((store) => store.updateUserConfig);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);

  const updateLocalProjectApisVersion = useApis((store) => store.updateLocalProjectApisVersion);
  const updateProjectConfig = useProjectConfig((store) => store.updateProjectConfig)

  const [lodaing, setLodaing] = useState(true);

  useEffect(() => {
    window?.vscode.postMessage({
      action: 'getPushPanelData',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    // Get project information
    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });
  }, [])

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setPushPanelData':
          if (isPlainObject((message?.data))) {
            if (isPlainObject(message?.data?.user_config)) {
              updateUserConfig(message?.data?.user_config);
            }
            if (isArray(message?.data?.local_api_list)) {
              updateApiOriginDetailsList(message?.data?.local_api_list);
            }
            if (isPlainObject(message?.data?.project_apis_version)) {
              updateLocalProjectApisVersion(message?.data?.project_apis_version);
            }
          }
          setLodaing(false);
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          break;
      }
    };
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
            <Push />
          </Skeleton>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<PushPanel />);
