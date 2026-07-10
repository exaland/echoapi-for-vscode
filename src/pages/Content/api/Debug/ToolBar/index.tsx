import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, MenuProps, message, Segmented, Tooltip, Typography } from 'antd';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import TitleEdit from '@/components/ui/TitleEdit';
import EnvDropdown from '@/components/business/EnvDropdown';
import ShareModal from '@/components/business/ShareModal';
import { Modal } from '@/components/ui/Modal';
import { useApis, useProjectConfig } from '@/store';
import { ApiDetailsData, echoapiResult } from '@/types/apis/api';
import { ChangeFuncType } from '@/types/common';
import { ShareInfo } from '@/types/share';

import { ToolBarContainer } from './style';
import { openEnvPage } from '@/events/apis/env';
import { IconFont } from '@/components/ui';
import useShare from '@/store/useShare';
import { handleOpenApiToEchoapi } from '@/utils/openApi';
import { ApisBaseRequestBody } from '@/types/apis/request';
import { cloneDeep, isArray, isEmpty, isPlainObject, isString } from 'lodash';
import { ApisBaseDataItem, ApiTypeMethod } from '@/types/apis/base';
import { fillInOpenApi } from '@/utils/apis';
import { snowflakeId } from 'apipost-tools';

interface Props {
  apisData: ApiDetailsData;
  onApisDataChange: (data: ApiDetailsData) => void
}

const ToolBar: FC<Props> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const updateEnvDetailKeys = useProjectConfig((state) => state.updateEnvDetailKeys);
  const docBaseUrl = useShare((state) => state.docBaseUrl);
  const [modal, contextHolder] = Modal.useModal();
  const [openShowModal, setOpenShowModal] = useState<boolean>(false);
  const [shareInfo] = useState<ShareInfo>({
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

  const envClick: MenuProps['onClick'] = ({ key }) => {
    // Switch environment
    updateEnvDetailKeys(key);
    saveProjectConfig('envDetailKeys', key);
  };

  const handleShare = () => {
    // Check if API is saved, show popup if unsaved
    if (apisData.is_create === 1) {
      modal?.confirm({
        title: t('common.save_request_title'),
        content: t('common.save_request_content'),
        okText: t('common.save_and_open'),
        cancelText: t('base.cancel'),
        async onOk() {
          window?.vscode.postMessage({
            action: 'saveAndOpenDesignPanel',
            data: apisData
          });
        },
      });

      return;
    }

    // Open design page
    window?.vscode.postMessage({
      action: 'openDesignPanelById',
      data: apisData.target_id
    });

  };

  const submitDesign2debug = (result: echoapiResult) => {
    if (isEmpty(result)) {
      return;
    }
    const newData = produce(apisData, (draft) => {
      if (isString(result?.url)) {
        draft.url = result.url;
      }
      if (isString(result?.method)) {
        draft.method = result.method.toLocaleUpperCase() as ApiTypeMethod;
      }
      draft.request.header = {
        parameter: (result?.header || []).map((i:ApisBaseDataItem)=>{
          i.param_id = snowflakeId();
          return i;
        })
      };

      draft.request.restful = {
        parameter: (result?.path || []).map((i:ApisBaseDataItem)=>{
          i.param_id = snowflakeId();
          return i;
        })
      };

      draft.request.query = {
        parameter: (result?.query || []).map((i:ApisBaseDataItem)=>{
          i.param_id = snowflakeId();
          return i;
        })
      };

      draft.request.cookie = {
        parameter: (result?.cookie || []).map((i:ApisBaseDataItem)=>{
          i.param_id = snowflakeId();
          return i;
        })
      };

      const newBody = produce(draft?.request?.body as ApisBaseRequestBody, (bodyDraft) => {
        if (isString(result?.bodyMode)) {
          bodyDraft.mode = result?.bodyMode;
        }
        
        if (isArray(result?.bodyParameter)) {
          bodyDraft.parameter = (result?.bodyParameter || []).map((i:ApisBaseDataItem)=>{
            i.param_id = snowflakeId();
            return i;
          });
        }

        if (isString(result?.bodyRaw)) {
          bodyDraft.raw = result?.bodyRaw;
        }

        if (isPlainObject(result?.bodyBinary)) {
          bodyDraft.binary = {
            file_name: result.bodyBinary?.file_name || '',
            data_url: result.bodyBinary?.data_url || '',
          }
        }

        if (isPlainObject(result?.bodyRawSchema)) {
          bodyDraft.raw_schema = result?.bodyRawSchema || {};
        }
      });
      draft.request.body = newBody;
    });

    onApisDataChange(newData);
    message.success('Generate Success');
  }

  const diffObj: any = {
    "request.query.parameter": 'Params',
    "request.cookie.parameter": 'Cookie',
    "request.body.parameter": 'Body',
    "request.header.parameter": 'Headers',
    "request.restful.parameter": 'Path',
  }

  const renderDiffStr = (arr: Array<string>) => {
    const result = arr.map(key => diffObj?.[key] || key).join(",");
    return `[${result}]`
  }

  const handleDesignGenerate = async () => {
    let deepApiData = cloneDeep(apisData);
    fillInOpenApi(deepApiData);
    if (deepApiData.is_create === 1) {
      return;
    }
    try {
      const result = await handleOpenApiToEchoapi({...deepApiData?.open_api},deepApiData);

      if (isEmpty(result)) {
        return;
      }
      // Keys are inconsistent
      if (isArray(result?.diffArr) && result.diffArr.length > 0) {
        modal?.confirm({
          title: `${t('common.generate_dubug_tip')}?`,
          content: <Flex vertical gap={20}>
            <span> {t('common.debug_design_diff_tip')}
              <Typography.Text style={{ color: 'var(--font-content-color)' }}>
                {renderDiffStr(result.diffArr)}
              </Typography.Text></span>
            <span>
            {t('common.go_ahead_design_data_tip')}
              <Typography.Text onClick={() => {
                handleShare();
              }} style={{ color: '#067CED', cursor: 'pointer' }}>
                [{t('common.open_design')}]
              </Typography.Text>
            </span>
          </Flex>,
          okText: 'Ok',
          cancelText: 'Cancel',
          async onOk() {
            submitDesign2debug(result);
          },
        });
        return;
      }
      submitDesign2debug(result);
    } catch (error: any) {
      message.error(error);
      return;
    }

  };

  return (
    <ToolBarContainer>
      <Flex gap={4} className="tab-bar-extra-content-wrap" align="center" justify="space-between">
        {apisData.target_type === 'api' && <Segmented<string>
          value={'Debug'}
          options={[{value:'Design',label:t('common.api_tab.design')}, {value:'Debug',label:t('common.api_tab.run')}]}
          onChange={(value) => {
            if(value === 'Design'){
              handleShare();
            }
            return;
          }}
        />}
        
        <Flex gap={8} align="center" className="edit-wrap" flex={1}>
          <TitleEdit
            maxLength={255}
            className="apis-title-edit"
            value={apisData?.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </Flex>
        {apisData.target_type === 'api' &&
          <Flex className='generate-design-data-btn-group' style={{ height: 26, cursor: 'pointer' }}>
            <Tooltip title={apisData.is_create === 1 ? t('common.not_create_design_tip') : t('common.generate_dubug_tip')}>
              <Flex style={{ cursor: apisData.is_create === 1 ? 'not-allowed' : 'pointer' }} className='generate-design-data-btn' gap={4} align='center' justify='center' onClick={handleDesignGenerate}>
                <Flex className='icon-Generate'><IconFont style={{color:'var(--icon-color)'}} type="icon-Frame" /></Flex>
                {t('supplement.generate_data')}
              </Flex>
            </Tooltip>
          </Flex>
        }
         <Flex style={{ height: 26 }}>
          <EnvDropdown isApis value={envDetailKeys} onEnvClick={envClick} />
        </Flex>
      </Flex>
      {contextHolder}
      {openShowModal && <ShareModal onCancel={() => setOpenShowModal(false)} shareInfo={shareInfo} />}
    </ToolBarContainer>
  );
};

export default ToolBar;
