import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from 'antd';
import useGlobalTheme from '@/theme';
import ErrorBoundary from '@/components/business/ErrorBoundary';
import enUS from 'antd/locale/en_US';

import '@/assets/css/reset.css';

import '@/locale';
import Content from '@/pages/Content'
import { ThemeProvider } from 'styled-components';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';

import { useApis, useGlobal, useProjectConfig, useSystemConfig } from '@/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HotkeysProvider } from 'react-hotkeys-hook';
import useApisHotkeys from '@/hooks/useHotKeys/useApisHotkeys';
import { forEach, isBoolean, keys } from 'lodash';
import produce from 'immer';
import { ApiSendingDataSSE, ApiStreamResponseSSEItem } from '@/types/apis/send';
import useShare from '@/store/useShare';
import useInitApp from '@/hooks/useInit';
import { ApiDetailsData } from '@/types/apis/api';
import useWebsocket2 from '@/pages/Content/websocket2/useWebsocket2';
import useSocketIo from '@/pages/Content/socketio/useWebsocket2';
import useGraphQLQuery from '@/components/business/GraphQLQuery/hooks';

function TagPanel() {
  const customTheme = useGlobalTheme();

  useInitApp();

  const updateCurrentSendingData = useApis(store => store.updateCurrentSendingData);
  const updateCurrentSseSendingData = useApis(store => store.updateCurrentSseSendingData);
  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const updateApisActiveData = useApis(store => store.updateApisActiveData);
  const updateApiCodeHar = useApis(store => store.updateApiCodeHar);
  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);
  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);
  const updateDocBaseUrl = useShare((state) => state.updateDocBaseUrl);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const updateAllApiDetailsData = useApis((store) => store.updateAllApiDetailsData);
  const updateApisActiveKey = useApis((state) => state.updateApisActiveKey);
  
  const [lodaing, setLodaing] = useState(true);

  useApisHotkeys();

  const { handelWsResult } = useWebsocket2();

  const { handelSocketIoResult, handleProxyFetchResult } = useSocketIo();

  const { handelGraphQLSchemaFetchResult } = useGraphQLQuery();

  useEffect(() => {
    // Initialize and pass current API data
    window?.vscode.postMessage({
      action: 'getApiData',
    });

    // Get doc base URL
    window?.vscode.postMessage({
      action: 'getDocBaseUrl',
    });

    // Get global configuration
    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });

    // First time get directory list
    window?.vscode.postMessage({
      action: 'getApiList',
    });

    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });
    
  }, []);

  useEffect(() => {

    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setApiList':
          updateApiOriginDetailsList(message?.data || []);
          updateAllApiDetailsData((message?.data || []).reduce((pre:{[x: string]: ApiDetailsData},cur:ApiDetailsData)=>{
            if(cur?.target_id){
              pre[cur.target_id] = cur;
            }
            return pre;
          },{}));
          break;
        case 'apiSendResult':
          updateCurrentSendingData(JSON.parse(message.data));
          break;
        case 'sseSendResult':
          const { streamResponse, ...reset } = message.data;
          const { currentSseSendingData } = useApis.getState();

          if (!currentSseSendingData) return;

          const newCurApiSendingDataSSE = produce(currentSseSendingData, (draft) => {
            forEach(keys(reset) as (keyof Omit<ApiSendingDataSSE, 'streamResponse'>)[], (item) => {
              if (item) {
                draft[item] = reset[item] as any;
              }
            });

            if (draft.streamResponse) {
              draft.streamResponse = draft.streamResponse.concat(
                streamResponse as ApiStreamResponseSSEItem[]
              );
            } else {
              draft.streamResponse = streamResponse as ApiStreamResponseSSEItem[];
            }
          });

          updateCurrentSseSendingData(newCurApiSendingDataSSE);
          break;
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          break;
        case 'setApiData':
          updateApisActiveData({ ...message.data });
          if(message?.data?.target_id){
            updateApisActiveKey(message?.data?.target_id);
          }
          
          setLodaing(false);
          break;
        case 'setDesignApiData':
          const { apisActiveData } = useApis.getState();
          updateApisActiveData({ ...apisActiveData, open_api: message?.data?.open_api || {},name:message?.data?.name || '' });
          break;
        case 'setVscodeTheme':
          updateVscodeTheme(message.data);
          break;
        case 'setSystemConfig':
          let raw_parameter_pilot_bubble_switch = false;
          if (!isBoolean(message?.data?.raw_parameter_pilot_bubble_switch)) {
            raw_parameter_pilot_bubble_switch = true;
          }

          updateSystemConfig({ ...systemConfig, ...message.data, raw_parameter_pilot_bubble_switch });
          break;
        case 'setDocBaseUrl':
          updateDocBaseUrl(message.data);
          break;
        case 'setCodeHar':
          updateApiCodeHar(message.data);
          break;
        case 'setWsResult':
          handelWsResult(message.data);
          break;
        case 'setSocketIoResult':
          handelSocketIoResult(message.data);
          break;
        case 'proxyFetchResult':
          handleProxyFetchResult(message.data);
          break;
        case 'graphQLSchemaFetchResult':
          handelGraphQLSchemaFetchResult(message.data);
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
        <HotkeysProvider
          initiallyActiveScopes={['global','apis']}
        >
          <ThemeProvider theme={customTheme}>
            <GlobalThemeStyle />
            <GlobalStyle />
            <ErrorBoundary>
              <DndProvider backend={HTML5Backend}>
                <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={lodaing}>
                  <Content />
                </Skeleton>
              </DndProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </HotkeysProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<TagPanel />);
