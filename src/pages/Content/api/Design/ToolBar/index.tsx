import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, MenuItemProps, MenuProps, message, Segmented, Tooltip, Typography } from 'antd';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import TitleEdit from '@/components/ui/TitleEdit';
import ShareModal from '@/components/business/ShareModal';
import { ApiDetailsData, OpenApiData } from '@/types/apis/api';
import { ChangeFuncType } from '@/types/common';
import { ShareInfo } from '@/types/share';

import { ToolBarContainer } from './style';
import { Button, IconFont } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import useShare from '@/store/useShare';
import { isEmpty, map } from 'lodash';
import { handleEchoApiToOpenApi } from '@/utils/openApi';
import { fillInOpenApi } from '@/utils/apis';

interface Props {
  apisData: ApiDetailsData;
  onApisDataChange: (data: ApiDetailsData) => void
}

const ToolBar: FC<Props> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const docBaseUrl = useShare((state) => state.docBaseUrl);
  const [modal, contextHolder] = Modal.useModal();
  const [openShowModal, setOpenShowModal] = useState<boolean>(false);
  const [shareInfo, setShareInfo] = useState<ShareInfo>({
    netUrl: '',
    apiName: '',
    apiData: null,
  });

  const handleChange: ChangeFuncType<ApiDetailsData> = useMemoizedFn((field, value) => {
    const newData = produce(apisData, (draft) => {
      draft[field] = value;
    });

    onApisDataChange(newData);
  });

  const handleShare = () => {
    // Check if API is saved, cannot share if unsaved
    if (apisData.is_create === 1) {
      message.error(t('common.save_before_share_tip'));
      return;
    }

    // Set modal parameters
    setShareInfo({
      netUrl: `${docBaseUrl}?share_id=${apisData.target_id}`,
      apiName: apisData.name || 'HTTP Request',
      apiData: apisData
    });

    // Open share modal
    setOpenShowModal(true);
    // Create share
    window?.vscode.postMessage({
      action: 'createShare',
      data: {
        target_id: apisData.target_id,
        share_time: Date.now()
      }
    });
  };

  const handleToCode = () => {

  };

  const handleCreateItemClick: MenuItemProps['onClick'] = async ({ key }) => {

    if (key === 'Push to Debug') {
      modal?.confirm({
        title: t('common.confirm_data_push'),
        content: t('common.push_design_to_debug_tip'),
        okText: apisData.is_create === 1 ? t('common.save_and_push') : t('supplement.push'),
        cancelText: t('base.cancel'),
        async onOk() {
      window?.vscode.postMessage({
        action: 'pushToDebug',
            data: apisData
          });
        },
      });
      return;
    }
  };

  const handlePullDebugData = () => {
    
    let result = handleEchoApiToOpenApi(apisData);
    const newData = produce(apisData as (ApiDetailsData & { open_api: OpenApiData }), (draft) => {
      if (!draft?.open_api) {
        fillInOpenApi(draft);
      }
      const oldUrl = Object.keys(draft.open_api)[0];
      // Save old property value
      const oldUrlObj = draft?.open_api?.[oldUrl];
      // Delete old property
      delete draft?.open_api?.[oldUrl];
      // Add new property and assign value
      draft.open_api[result.url] = oldUrlObj;

      const oldMethod = Object.keys(oldUrlObj)[0];
      const oldMethodObj = oldUrlObj[oldMethod];
      // Delete old property
      delete oldUrlObj[oldMethod];
      // Add new property and assign value
      oldUrlObj[result.method] = oldMethodObj;

      // Replace request parameters
      oldMethodObj.parameters = result.parameters;

      // Add request body parameters
      oldMethodObj.requestBody.content = {
        ...oldMethodObj.requestBody.content,
        ...result.requestBodyContent
      }

      if(!isEmpty(result?.responses)){
        oldMethodObj.responses = result.responses;
      }

    });
    onApisDataChange(newData);
  }

  const onPullDebugDataClick = () => {
    modal?.confirm({
      title: t('common.pull_debug_to_design_tip'),
      content: <span>
        {t('common.will_overwrite_tip')}
        <Typography.Text onClick={() => {
          window?.vscode.postMessage({
            action: 'openTagPanelById',
            data: apisData.target_id
          });
        }} style={{ color: '#067CED', cursor: 'pointer' }}>
          [{t('common.open_debug')}]
        </Typography.Text>
      </span>,
      okText: t('common.schema.ok'),
      cancelText: t('base.cancel'),
      async onOk() {
        // Pull debug data to overwrite design data
        handlePullDebugData();
      },
    });
  }

  const TREE_CREATE_LIST = map([t('common.push_to_debug'), t('common.folder_operate.pull_debug')], (item, index) => ({
    label: item,
    className: 'beautify-tree-create-title',
  }));

  const createMenus: MenuProps['items'] = map(TREE_CREATE_LIST, (item) => ({
    key: item.label,
    label: item.label,
    onClick: handleCreateItemClick,
  }));

  return (
    <ToolBarContainer>
      <Flex gap={4} className="tab-bar-extra-content-wrap" align="center" justify="space-between">

        <Segmented<any>
          value={'Design'}
          options={[{value:'Design',label:t('common.api_tab.design')}, {value:'Debug',label:t('common.api_tab.run')}]}
          onChange={(value) => {
            if (value === 'Debug') {
              if (apisData.is_create === 1) {
                modal?.confirm({
                  title: t('common.save_request_open_debug_title'),
                  content: t('common.save_request_open_debug_content'),
                  okText: t('common.save_and_open'),
                  cancelText: t('base.cancel'),
                  async onOk() {
                    window?.vscode.postMessage({
                      action: 'saveAndopenTagPanelById',
                      data: apisData
                    });
                  },
                });

                return;
              }


              window?.vscode.postMessage({
                action: 'openTagPanelById',
                data: apisData.target_id
              });
            }
            return;
          }}
        />

        <Flex gap={8} align="center" className="edit-wrap" flex={1}>
          <TitleEdit
            maxLength={255}
            className="apis-title-edit"
            value={apisData?.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </Flex>

        {apisData.target_type === 'api' &&
          <Flex gap={0} align='center'>
            <Tooltip title={apisData.is_create === 1 ? t('common.not_create_debug_tip') : ''}>
              <Button
                onClick={onPullDebugDataClick}
                type="default"
                size="small"
                disabled={apisData.is_create === 1}
                style={{border:'none'}}
              >
                {t('common.folder_operate.pull_debug')}
              </Button>
            </Tooltip>

            <Button
              onClick={handleShare}
              type="default"
              size="small"
              icon={<IconFont type="icon-share" />}
              style={{border:'none',background:'var(--search-big-bg-color)'}}
            >
              {t('api.apis_list.share')}
            </Button>
          </Flex>
        }
      </Flex>
      {contextHolder}
      {openShowModal && <ShareModal onCancel={() => setOpenShowModal(false)} shareInfo={shareInfo} />}
    </ToolBarContainer>
  );
};

export default ToolBar;
