import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import Testing from '@/pages/Testing';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { useGlobal, useProjectConfig, useSystemConfig } from '../store';
import useTesting from '@/store/useTesting';
import produce from 'immer';
import { saveReport } from '@/pages/Testing/utils';
import { isString } from 'lodash';


function FolderTestPanel() {
  const customTheme = useGlobalTheme();
  const updateTestingReportList = useTesting(store => store?.updateTestingReportList);
  const updateTestingConfig = useTesting(store => store?.updateTestingConfig);
  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const updateEventList = useTesting(store => store?.updateEventList);
  const testingSendingData = useTesting(store => store?.testingSendingData);
  const updateTestingSendingData = useTesting(store => store?.updateTestingSendingData);
  const updateTestingName = useTesting(store => store?.updateTestingName);
  const updateShowReportList = useTesting(store => store?.updateShowReportList);
  const testingName = useTesting(store => store?.testingName);
  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);

  useEffect(() => {
    // First time get test data
    window?.vscode.postMessage({
      action: 'getTestData',
    });

    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setTestData':
          const { reportList, eventList, config, testingName, isInit, showReportList } = message.data;
          
          // Set API event list
          eventList && updateEventList(eventList);
          // Set test configuration information
          config && updateTestingConfig(config);
          // Set report list
          reportList && updateTestingReportList(reportList);
          // Set test name
          testingName && updateTestingName(testingName || 'Test Folder');

          // Initialize page
          if (isInit) {
            const newTestingSendingData = produce(testingSendingData, (draft: any) => {
              draft.requestList = [];
              draft.sendStatus = 'initial';
              draft.complete = {};
            });
            updateTestingSendingData(newTestingSendingData);
          }

          updateShowReportList(Boolean(showReportList));
          break;
        case 'sendEventList':
          const result = message.data;
          if (result.action === 'request') {
            const newTestingSendingData = produce(testingSendingData, (draft: any) => {
              draft.requestList.push(result.data);
            });
            updateTestingSendingData(newTestingSendingData);
          }
          if (result.action === 'complete') {
            const newTestingSendingData = produce(testingSendingData, (draft) => {
              draft.sendStatus = 'sendOver';
              draft.complete = result.data;
            });
            updateTestingSendingData(newTestingSendingData);

            // Save test report
            saveReport(result.data);
          }
          break;
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
          case 'setVscodeTheme':
            updateVscodeTheme(message.data);
            break;
      }
    }
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [testingSendingData]);

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
          <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={!isString(testingName) || !testingName}>
            <Testing />
          </Skeleton>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<FolderTestPanel />);
