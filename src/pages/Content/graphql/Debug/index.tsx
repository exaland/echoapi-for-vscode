import { FC, lazy, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ResizablePanels, SuspenseContent } from '@/components/business';
import ResponseRealtimeContext from '@/components/business/Response/components/Realtime/context';
import { GraphQLResponseContext } from '@/contexts';
import { DirectionContext } from '@/contexts';
import { ApiComponentType, GraphQLDetailsData } from '@/types/apis/graphql';
import { DirectionType } from '@/types/common';
import { importDelay } from '@/utils/common';

import UrlPanel from './UrlPanel';

import { GraphqlDebugContainer } from './style';
import ToolBar from '../../api/Debug/ToolBar';
import { ApiDetailsData } from '@/types/apis/api';
import {  Flex } from 'antd';
import { Button } from '@/components/ui';
import { useApis } from '@/store';
import GenerateCodeDrawer from '@/components/business/GenerateCodeDrawer';
const Request = lazy(() => importDelay(import('./Request')));
const Response = lazy(() => importDelay(import('./Response')));

const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};

const Index: FC<ApiComponentType> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const [apiScreenDirection, setApiScreenDirection] = useState<DirectionType>('vertical');
  const updateApiCodeHar = useApis(store => store.updateApiCodeHar);
  const [openGenerateCode, setOpenGenerateCode] = useState<boolean>(false);
  const handleDirectionChange = (direction: DirectionType) => {
    setApiScreenDirection(direction);
  };

  const handleToCode = () => {
    updateApiCodeHar({});
    setOpenGenerateCode(true);
  };

  const tabBarExtraContent = useMemo(() => {
    return <Flex align='center'>
      <Button
        onClick={handleToCode}
        type="text"
        mode="light"
        size="small"
        style={{ padding: '4px 6px' }}
         className='beautify-text-btn-highlight'
      >
        {t('system_settings.shortcuts.apis_detail.code')}
      </Button>
    </Flex>
  }, []);

  return (
    <>
      <ToolBar apisData={apisData as unknown as ApiDetailsData} onApisDataChange={(val) => {
        onApisDataChange(val as unknown as GraphQLDetailsData);
      }} />
      <GraphqlDebugContainer vertical>
        <header>
          <UrlPanel apisData={apisData} onApisDataChange={onApisDataChange} />
        </header>
        <main>
          <DirectionContext.Provider value={{ direction: apiScreenDirection }}>
              <ResponseRealtimeContext.Provider value={{ direction: apiScreenDirection }}>
                <ResizablePanels
                  showDirectionBtn
                  panelGroupProps={{
                    autoSaveId: 'api_debug_container_resize_save_id',
                    direction: apiScreenDirection,
                  }}
                  leftPanelProps={{ ...panelProps, collapseTitle: t('supplement.request_panel') }}
                  rightPanelProps={{ ...panelProps, collapseTitle: t('supplement.response_panel') }}
                  leftPanel={
                    <SuspenseContent>
                      <Request
                        direction={apiScreenDirection}
                        apisData={apisData}
                        onApisDataChange={onApisDataChange}
                        tabBarExtraContent={tabBarExtraContent}
                      />
                    </SuspenseContent>
                  }
                  rightPanel={
                    <SuspenseContent>
                      <GraphQLResponseContext.Provider
                        value={{
                          target_type: apisData.target_type,
                          apiData: apisData,
                          onApisDataChange,
                        }}
                      >
                        <Response apisData={apisData} onApisDataChange={onApisDataChange} />
                      </GraphQLResponseContext.Provider>
                    </SuspenseContent>
                  }
                  onDirectionChange={handleDirectionChange}
                />
              </ResponseRealtimeContext.Provider>
          </DirectionContext.Provider>
        </main>
        {openGenerateCode && <GenerateCodeDrawer value={apisData} onClose={() => setOpenGenerateCode(false)} />}
      </GraphqlDebugContainer>
    </>

  );
};

export default Index;
