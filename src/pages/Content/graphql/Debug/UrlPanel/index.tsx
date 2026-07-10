import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Flex, MenuProps, Tree } from 'antd';
import Button from '@/components/ui/Button';
import i18next from 'i18next';
import produce from 'immer';
import { cloneDeep, head, isEqual } from 'lodash';

import UrlGroup from '@/components/business/UrlGroup';
import { IconFont } from '@/components/ui';
import { SaveDropDownContainer } from '@/pages/Content/style';
import { useApis, useProjectConfig, useUserConfig } from '@/store';
import { ApiComponentType } from '@/types/apis/graphql';
import { getCollectionServerId } from '@/utils/apis';
import { convertToSaveFolderTree } from '@/utils/common';

import { UrlPanelContainer } from './style';
import { useSafeState } from 'ahooks';
import { AnyObject } from '@/types/common';

const items: MenuProps['items'] = [
  {
    label: i18next.t('api.run.send_save'),
    key: 'send_and_save',
  },
];

const menuProps = {
  items,
};

const Index = memo((props: ApiComponentType) => {
  const { t } = useTranslation();
  const { apisData, onApisDataChange } = props;
  const updateCurrentSendingData = useApis(store => store.updateCurrentSendingData);
  const curApiSendingData = useApis((state) => state.currentSendingData);
  const apisActiveData = useApis(store => store.apisActiveData);
  const apiDetailsData = useApis((state) => state.apiDetailsData);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);

  const updateCurrentServerId = useApis((store) => store.updateCurrentServerId);
  const currentServerId = useApis((store) => store.currentServerId);

  const isReadonly = useUserConfig((state) => state.isReadonly);
  const [saveLoading, setSaveLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tempServerId = getCollectionServerId(apisActiveData?.target_id, apiOriginDetailsList.reduce((pre: any, cur) => {
      if (cur?.target_id) {
        pre[cur.target_id] = cur;
      }
      return pre;
    }, {}));
    updateCurrentServerId(tempServerId);
  }, [apiOriginDetailsList]);

  const isSending = isEqual(curApiSendingData?.sendStatus, 'sending');

  const urlGroupData = useMemo(
    () => ({
      url: apisData.url,
    }),
    [apisData]
  );
  const handleChange = (key: string, value: string) => {
    const result = produce(apisData, (draft: AnyObject) => {
      draft[key] = value || '';
    });
    onApisDataChange(result);
  };

  const handleSend = () => {
    updateCurrentSendingData({ sendStatus: 'sending' });
    window?.vscode.postMessage({
      action: 'sendApi',
      data: apisData,
      option:{
        server_id: currentServerId,
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, isEnvVisible?: boolean) => {
    if (isEnvVisible) {
      return;
    }

    // Disable Enter key send when using modifier shortcuts
    const ctrlDown = event.metaKey || event.ctrlKey;
    if (event?.keyCode === 13 && !ctrlDown) {
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const result = cloneDeep(apisData);
      window?.vscode.postMessage({
        action: 'saveApiData',
        data: result
      });
    } catch (err) {
    } finally {
      setSaveLoading(false);
    }
  };

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
        titleRender={(nodeData) => {
          return <div className="dropdown-tree-title">{nodeData.label}</div>;
        }}
      />
    </SaveDropDownContainer>
  );
  return (
    <UrlPanelContainer>
      <UrlGroup
        className="url-group-wrap"
        type="graphql"
        maxLength={10240}
        data={urlGroupData}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        curServerId={currentServerId}
        SetCurServerId={updateCurrentServerId}
        style={{
          paddingRight: "0",
        }}
        urlGroupExtraContent={<Button
          type="primary"
          size="large"
          style={{ width: 'max-content',borderRadius: "0 4px 4px 0",marginLeft:'4px' }}
          onClick={() => {
            handleSend();
          }}
          disabled={isSending}
        >
          {isSending ? `${t('api.run.sending')}...` : t('api.run.send')}
        </Button>}
      />
      <Flex style={{marginLeft:'4px'}} gap={12}>
        <Dropdown.Button
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          placement="bottomRight"
          type="default"
          size="small"
          trigger={['click']}
          icon={<IconFont type="icon-drop-down" />}
          loading={saveLoading}
          open={open}
          onOpenChange={(open) => setOpen(open)}
          onClick={handleSave}
          overlayStyle={{ fontSize: 14 }}
          disabled={isReadonly}
          destroyPopupOnHide
          dropdownRender={dropdownRender}
        >
          {t('api.run.save')}
        </Dropdown.Button>
      </Flex>
    </UrlPanelContainer>
  );
});

export default Index;
