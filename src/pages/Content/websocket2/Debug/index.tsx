import { FC, lazy, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Flex, Tree } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import { cloneDeep, find, head, isArray } from 'lodash';

import { SuspenseContent } from '@/components/business';
import ResizablePanels from '@/components/business/ResizablePanels';
import UrlGroup from '@/components/business/UrlGroup';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import ToolBar from '../../api/Debug/ToolBar';
import { useApis, useProjectConfig, useUserConfig } from '@/store';
import useApisWebsocket2 from '@/store/useApis/websocket2';
import { Websocket2ComponentType, Websocket2DetailsData } from '@/types/apis/websocket2';
import { convertToSaveFolderTree, importDelay } from '@/utils/common';

import useWebsocket2 from '../useWebsocket2';

import { SaveDropDownContainer, WsDebugContainer } from './style';
import { ApiDetailsData } from '@/types/apis/api';
import produce from 'immer';
import { AnyObject } from '@/types/common';
import { genQueryByUrl } from '@/utils/apis';

const Request = lazy(() => importDelay(import('./Request')));
const Response = lazy(() => importDelay(import('./Response')));
const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};
const WsDebug: FC<Websocket2ComponentType> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const { connectWebSocket } = useWebsocket2();
  const websocket2ConnectionPool = useApisWebsocket2((state) => state.websocket2ConnectionPool);

  const apiDetailsData = useApis((state) => state.apiDetailsData);
  const isReadonly = useUserConfig((state) => state.isReadonly);

  const [saveLoading, setSaveLoading] = useSafeState(false);
  const [open, setOpen] = useSafeState(false);
  const [curServerId, SetCurServerId] = useSafeState('');
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);

  useEffect(()=>{
    const currentEnv = find(envList, (it) => it?.env_id === envDetailKeys); 
    if (isArray(currentEnv?.server_list) && curServerId === '') {
      const defaultServerId = currentEnv.server_list.find((i:any) => i?.is_default === 1)?.server_id || '';
      SetCurServerId(defaultServerId);
    }
  },[envList,envDetailKeys,curServerId]);

  const onSave = async () => {
    setSaveLoading(true);
    try {
      window?.vscode.postMessage({
        action: 'saveApiData',
        data: apisData
      });
    } catch (err) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUrlPanel = useMemoizedFn((key: string, value: string) => {
    onApisDataChange(produce(apisData, (draft: AnyObject) => {
      draft[key] = value;
      if (key === 'url') {
        if (value) {
          if (isArray(draft?.request?.query?.parameter)) {
            draft.request.query.parameter = genQueryByUrl(
              `${value}`,
              draft?.request?.query?.parameter || []
            );
          }
        } else {
          if (draft.request.query?.parameter) {
            draft.request.query.parameter = [];
          }
        }
      }
    }));
  });

  const handleRequest = useMemoizedFn((data: Websocket2DetailsData) => {
    onApisDataChange(data);
  });

  const status = useMemo(() => {
    return websocket2ConnectionPool?.[apisData?.target_id]?.status;
  }, [websocket2ConnectionPool, apisData]);

  const dropdownRender = () => (
    <SaveDropDownContainer>
      <Tree
        height={250}
        blockNode
        autoExpandParent
        defaultExpandAll
        onSelect={(keys: React.Key[]) => {
          const parent_id = head(keys);
          const result = cloneDeep(apisData);

          window?.vscode.postMessage({
            action: 'saveApiData',
            data: { ...result, parent_id: parent_id as string }
          });
          setOpen(false);
        }}
        fieldNames={{ title: 'label' }}
        treeData={convertToSaveFolderTree(apiDetailsData)}
        titleRender={(nodeData: any) => {
          return <div className="dropdown-tree-title">{nodeData.label}</div>;
        }}
      />
    </SaveDropDownContainer>
  );

  return (
    <>
      <ToolBar apisData={apisData as unknown as ApiDetailsData} onApisDataChange={(val) => {
        onApisDataChange(val as unknown as Websocket2DetailsData);
      }} />
      <WsDebugContainer>
        <div className="url-panel" style={{ padding: '0 16px' }}>
          <Flex flex={1} justify="space-between" align="center">
            <div className="url-group">
              <UrlGroup
                maxLength={10240}
                placeholder={t('supplement.socket_url_placeholder')}
                readOnly={status === 'connect'}
                data={{
                  url: apisData?.url,
                }}
                type={APIS_TARGET_TYPE_ENUM.WEBSOCKET2}
                onChange={handleUrlPanel}
                curServerId={curServerId}
                SetCurServerId={SetCurServerId}
                style={{padding:'3px',paddingRight: "0"}}
                urlGroupExtraContent={ <Button
                  type="primary"
                  size="large"
                  style={{ marginLeft: 4, width: 'max-content', borderRadius: "0 4px 4px 0" }}
                  onClick={() => {
                    connectWebSocket(apisData, status, curServerId);
                  }}
                >
                  {status === 'connect'
                    ? t('supplement.disconnect')
                    : status === 'connecting'
                      ? t('supplement.connecting')
                      : t('supplement.connect')}
                </Button>}
              />
            </div>
            <Flex style={{marginLeft:'4px'}} gap={12}>
              <Dropdown.Button
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                placement="bottomRight"
                open={open}
                onOpenChange={(open) => setOpen(open)}
                type="default"
                size="small"
                trigger={['click']}
                icon={<IconFont type="icon-drop-down" />}
                loading={saveLoading}
                onClick={onSave}
                overlayStyle={{ fontSize: 14 }}
                disabled={isReadonly}
                destroyPopupOnHide
                dropdownRender={dropdownRender}
              >
                {t('supplement.save')}
              </Dropdown.Button>
            </Flex>
          </Flex>
        </div>
        <ResizablePanels
          panelGroupProps={{
            direction: 'vertical',
          }}
          leftPanelProps={{ ...panelProps, collapseTitle: t('supplement.request_panel') }}
          rightPanelProps={{ ...panelProps, collapseTitle: t('supplement.response_panel') }}
          leftPanel={
            <SuspenseContent>
              <div style={{ padding: '0 16px 12px 16px', height: '100%' }}>
                <Request readOnly={status === 'connect'} value={apisData} onChange={handleRequest} />
              </div>
            </SuspenseContent>
          }
          rightPanel={
            <SuspenseContent>
              <div style={{ padding: '0 16px', height: '100%' }}>
                <Response value={apisData} onChange={handleRequest} />
              </div>
            </SuspenseContent>
          }
        />
      </WsDebugContainer>
    </>

  );
};

export default WsDebug;
