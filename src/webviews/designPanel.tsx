import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import Design from '@/pages/Content/api/Design';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { useApis, useGlobal, useProjectConfig, useSystemConfig, useUserConfig } from '../store';
import useShare from '@/store/useShare';
import { isEmpty } from 'lodash';
import useApisHotkeys from '@/hooks/useHotKeys/useApisHotkeys';
import { ApiDesignContainer } from '@/pages/Content/style';
import { HotkeysProvider } from 'react-hotkeys-hook';

function DocPanel() {
  const customTheme = useGlobalTheme();

  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);
  const updateDocPageData = useShare(store => store.updateDocPageData);
  const updateApisActiveData = useApis(store => store.updateApisActiveData);
  const updateUserConfig = useUserConfig(store => store.updateUserConfig);
  const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);
  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const updateDocBaseUrl = useShare((state) => state.updateDocBaseUrl);
  const apisActiveData = useApis(store => store.apisActiveData);
  const systemConfig = useSystemConfig((state) => state.systemConfig);

  useApisHotkeys();

  useEffect(() => {
    // Initialize and pass current API data
    window?.vscode.postMessage({
      action: 'getApiData',
    });

    // First time get color theme
    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    // Get project information
    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });

    // Get doc base URL
    window?.vscode.postMessage({
      action: 'getDocBaseUrl',
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
        case 'setVscodeTheme':
          updateVscodeTheme(message.data);
          break;
        case 'setDocData':
          updateDocPageData({ ...message.data });
          break;
        case 'setApiData':
          updateApisActiveData({ ...apisActiveData,...message.data });
          break;
        case 'setDebugApiData':
            delete message?.data?.open_api;
            updateApisActiveData({ ...apisActiveData,...message.data });
          break;
        case 'setSystemConfig':
          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          break;
        case 'setDocBaseUrl':
          updateDocBaseUrl(message.data);
          break;
        case 'setUserConfig':
          updateUserConfig({ ...message.data });
          break;
      }
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [apisActiveData]);
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
        <HotkeysProvider
          initiallyActiveScopes={['global','apis']}
        >
          <ThemeProvider theme={customTheme}>
            <GlobalThemeStyle />
            <GlobalStyle />
            <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={apisActiveData === undefined || isEmpty(apisActiveData)}>
              {apisActiveData !== undefined && !isEmpty(apisActiveData) &&
                <ApiDesignContainer vertical>
                  <Design apisData={apisActiveData} onApisDataChange={updateApisActiveData} />
                </ApiDesignContainer>
              }
            </Skeleton>
          </ThemeProvider>
        </HotkeysProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<DocPanel />);
