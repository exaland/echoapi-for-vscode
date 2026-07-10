import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import ErrorBoundary from '@/components/business/ErrorBoundary';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import ShareList from '@/pages/ShareList';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HotkeysProvider } from 'react-hotkeys-hook';
import useShare from '@/store/useShare';
import { useApis, useSystemConfig } from '@/store';

function ShareListPanel() {
  const customTheme = useGlobalTheme();

  const updateShareData = useShare((state) => state.updateShareData);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const updateDocBaseUrl = useShare((state) => state.updateDocBaseUrl);

  const [lodaing, setLodaing] = useState(true);

  useEffect(() => {
    // Initialize and pass API list
    window?.vscode.postMessage({
      action: 'getApiList',
    });

    // Get share information
    window?.vscode.postMessage({
      action: 'getShareData',
    });

    // Get doc base URL
    window?.vscode.postMessage({
      action: 'getDocBaseUrl',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });
  }, []);

  useEffect(() => {

    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setApiList':
          updateApiOriginDetailsList(message?.data || []);
          setLodaing(false);
          break;
        case 'setShareData':
          updateShareData({ ...message.data });
          break;
        case 'setDocBaseUrl':
          updateDocBaseUrl(message.data);
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
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
      theme={{
        token: customTheme.token,
        components: customTheme.components,
      }}
      locale={enUS}
    >
      <AntdApp>
        <HotkeysProvider
          initiallyActiveScopes={['global']}
        >
          <ThemeProvider theme={customTheme}>
            <GlobalThemeStyle />
            <GlobalStyle />
            <ErrorBoundary>
              <DndProvider backend={HTML5Backend}>
                <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={lodaing}>
                  <ShareList />
                </Skeleton>
              </DndProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </HotkeysProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<ShareListPanel />);
