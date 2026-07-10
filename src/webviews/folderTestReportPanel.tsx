import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Spin } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import ReportDetails from '@/pages/Testing/ReportDetails';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { useProjectConfig, useSystemConfig } from '../store';
import useTesting from '@/store/useTesting';
import { TestingReportList } from '@/types/testing/res';
import { useTranslation } from 'react-i18next';


function FolderTestPanel() {
  const customTheme = useGlobalTheme();
  const { t } = useTranslation();

  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const testingSendingData = useTesting(store => store?.testingSendingData);

  const [reportDetails, setReportDetails] = useState<TestingReportList>();

  useEffect(() => {
    // First time get test data
    window?.vscode.postMessage({
      action: 'getReportDetails',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          break;
        case 'setReportDetails':
          setReportDetails(message.data);
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
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
          <Spin tip={t('common.loading')} spinning={!Boolean(reportDetails)}>
            {reportDetails && <ReportDetails reportDetails={reportDetails} />}
          </Spin>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<FolderTestPanel />);
