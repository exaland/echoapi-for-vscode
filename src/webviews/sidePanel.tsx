import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import Tree from '@/pages/Tree';
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { trim } from 'lodash';
import { createOpensItem } from '../events/apis/opens';
import { APIS_TARGET_TYPE_ENUM } from '../constants/apis';
import { useApis, useGlobal, useProjectConfig, useSystemConfig, useUserConfig } from '../store';
import { DEFAULT_TEAM } from '@/constants/team';
import { DEFAULT_PROJECT } from '@/constants/project';
import { setProjectReportList } from '@/pages/Testing/utils';
import useShare from '@/store/useShare';
import useCopyAsCurl from '@/hooks/useCopyAsCurl';

function SidePanel() {
  const customTheme = useGlobalTheme();

  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const updateUserConfig = useUserConfig((store) => store.updateUserConfig);
  const updateApisActiveKey = useApis((state) => state.updateApisActiveKey);
  const updateTestsActiveKey = useApis((state) => state.updateTestsActiveKey);
  const updateDocsActiveKey = useApis((state) => state.updateDocsActiveKey);
  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const updateSwitchingProject = useGlobal((state) => state.updateSwitchingProject);

  const updateShareData = useShare((state) => state.updateShareData);
  const updateDocBaseUrl = useShare((state) => state.updateDocBaseUrl);

  const { copyAsCurl } = useCopyAsCurl();

  const [lodaing, setLodaing] = useState(true);


  useEffect(() => {
    
    // First time get directory list
    window?.vscode.postMessage({
      action: 'getApiList',
    });
    // First time get user information
    window?.vscode.postMessage({
      action: 'getUserConfig',
    });

    // First time get share information
    window?.vscode.postMessage({
      action: 'getProjectShareData',
    });

    // Get doc base URL
    window?.vscode.postMessage({
      action: 'getDocBaseUrl',
    });

     // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    // Get global configuration
     window?.vscode.postMessage({
      action: 'getProjectConfig',
    });

    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'inputResult':
          if (trim(message.inputValue).length > 0) {
            switch (message?.data?.type) {
              case 'folder':
                let newFolder = null;
                if (message?.data?.sourceData) {
                  newFolder = message.data.sourceData;
                  newFolder.name = message.inputValue;
                } else {
                  newFolder = await createOpensItem({
                    target_type: APIS_TARGET_TYPE_ENUM.FOLDER,
                    project_id: '',
                    parent_id: '0',
                    resetDefaultData: {
                      name: message.inputValue
                    }
                  });
                }
                window?.vscode.postMessage({
                  action: 'saveFolder',
                  data: newFolder
                });
                break;
              case 'api':
                let newApi = message?.data?.sourceData;
                newApi.name = message.inputValue;
                window?.vscode.postMessage({
                  action: 'saveFolder',
                  data: newApi
                });
                break;
              default:
                break;
            }
          }
          break;
        case 'setApiList':
          updateApiOriginDetailsList(message?.data || []);
          setLodaing(false);
          break;
        case 'setUserConfig':
          updateUserConfig({
            currentTeam: DEFAULT_TEAM,
            currentProject: DEFAULT_PROJECT,
            ...message.data
          });
          break;
        case 'setApisActiveKey':
          updateApisActiveKey(message.data);
          break;
        case 'setTestsActiveKey':
          updateTestsActiveKey(message.data);
          break;
        case 'setDocsActiveKey':
          updateDocsActiveKey(message.data);
          break;
        case 'setProjectReportList':
          setProjectReportList(message.data);
          break;
        case 'setProjectShareData':
          updateShareData({ ...message.data });
          // Switch project status
          updateSwitchingProject(false);
          break;
        case 'setDocBaseUrl':
          updateDocBaseUrl(message.data);
          break;
        case 'copyAsCurl':
          copyAsCurl(message.data);
          break;
        case 'setSystemConfig':
          const { systemConfig, updateSystemConfig } = useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
        break;
        case 'setVscodeTheme':
          updateVscodeTheme(message.data);
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
            <Tree value={apiOriginDetailsList || []} />
          </Skeleton>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<SidePanel />);
