import { FC, lazy, useMemo } from 'react';

import { Flex, message, Select, Tooltip, Typography } from 'antd';
import type { RadioChangeEvent, SelectProps } from 'antd';

import produce from 'immer';
import { cloneDeep, includes, isArray, isEmpty, isEqual, isPlainObject, isString, map, toUpper, values } from 'lodash';

import SuspenseContent from '@/components/business/SuspenseContent';
import Radio from '@/components/ui/Radio';
import {
  REQUEST_BODY_MODE_ENUM,
  REQUEST_BODY_RAW_MODE_ENUM,
  REQUEST_RAW_MODE_LIST,
} from '@/constants/apis';
import { RequestBodyContentType } from '@/types/apis/request';
import { Modal } from '@/components/ui/Modal';

import { RequestBodyProps } from './types';
import { RequestBodyContainer } from './style';
import { Button, IconFont } from '@/components/ui';
import { handleOpenApiToEchoapi } from '@/utils/openApi';
import { fillInOpenApi } from '@/utils/apis';
import autoJsonFaker from 'auto-json-faker'
import { ApisBaseDataItem } from '@/types/apis/base';
import { snowflakeId } from 'apipost-tools';
import { ApiDetailsData, echoapiResult } from '@/types/apis/api';
import { useSystemConfig } from '@/store';
import { useTranslation } from 'react-i18next';

const RequestBodyBinary = lazy(() => import('./components/Binary'));
const RequestBodyFormData = lazy(() => import('./components/FormData'));
const RequestBodyNone = lazy(() => import('./components/None'));
const RequestBodyRaw = lazy(() => import('./components/Raw'));
const RequestBodyUrlencoded = lazy(() => import('./components/Urlencoded'));

const RequestBody: FC<RequestBodyProps> = (props) => {
  const { t } = useTranslation();

    const { apiData, value, onChange } = props;
    const [modal, contextHolder] = Modal.useModal();
    const rowOptions = useMemo(
      () => map(REQUEST_RAW_MODE_LIST, (item) => ({ label: toUpper(item), value: item })),
      [REQUEST_RAW_MODE_LIST]
    );
    const systemConfigTabDirection = useSystemConfig((state) => state.systemConfig?.tab_direction);
    const bodyModeOptions = useMemo(
      () => map(values(REQUEST_BODY_MODE_ENUM), (item) => ({ label: item, value: item })),
      []
    );

    const isRowMode = useMemo(() => includes(REQUEST_RAW_MODE_LIST, value?.mode), [value?.mode]);

    const calcBodyModeValue = useMemo(
      () =>
        includes(REQUEST_RAW_MODE_LIST, value?.mode) ? REQUEST_BODY_MODE_ENUM.RAW : value?.mode,
      [value?.mode]
    );

    const calcRadioValue = useMemo(
      () =>
        includes(REQUEST_RAW_MODE_LIST, value?.mode) ? REQUEST_BODY_MODE_ENUM.RAW : value?.mode,
      [value?.mode]
    );

    const bodyContent = useMemo(() => {
      
      const bodyMap = {
        [REQUEST_BODY_MODE_ENUM.NONE]: <RequestBodyNone />,
        [REQUEST_BODY_MODE_ENUM.FORM_DATA]: <RequestBodyFormData {...props} />,
        [REQUEST_BODY_MODE_ENUM.URLENCODED]: <RequestBodyUrlencoded {...props} />,
        [REQUEST_BODY_MODE_ENUM.BINARY]: <RequestBodyBinary value={value} onChange={onChange} />,
        [REQUEST_BODY_MODE_ENUM.RAW]: (
          <RequestBodyRaw
            value={value}
            onChange={onChange}
            mode={value?.mode}
            isParameter={[
              REQUEST_BODY_RAW_MODE_ENUM.JAVASCRIPT,
              REQUEST_BODY_RAW_MODE_ENUM.PLAIN,
              REQUEST_BODY_RAW_MODE_ENUM.HTML,
            ].includes(value?.mode as REQUEST_BODY_RAW_MODE_ENUM)}
          />
        ),
      };

      return bodyMap[calcRadioValue as REQUEST_BODY_MODE_ENUM];
    }, [calcRadioValue, value,value?.parameter,value?.parameter?.length]);
    
    const handleModeChange = (newValue: RequestBodyContentType) => {
      if (!value) return;

      const newRequestData = produce(value, (draft: { mode: string; }) => {
        draft.mode = newValue;
      });

      onChange?.('body', newRequestData);
    };

    const handleBodyModeChange = (value: any) => {
       // Special handling in raw mode
       if (isEqual(value, REQUEST_BODY_MODE_ENUM.RAW)) {
        handleModeChange(REQUEST_BODY_RAW_MODE_ENUM.JSON);
        return;
      }

      handleModeChange(value);
    };

    const handleShare = () => {
      // Check if the API is saved; sharing is not allowed if unsaved
      if (apiData?.is_create === 1) {
        message.error(t('common.save_before_share_tip'));
        return;
      }
  
      // Open the design page
      window?.vscode.postMessage({
        action: 'openDesignPanelById',
        data: apiData?.target_id
      });
    };

    const submitDesign2debug = (result:echoapiResult)=>{
      if (isEmpty(result)) {
        return;
      }
      if (!value) return;

      const newRequestData = produce(value, (draft) => {
        if (isString(result?.bodyMode)) {
          draft.mode = result?.bodyMode;
        }

        if (isArray(result?.bodyParameter)) {
          draft.parameter = result.bodyParameter.map((i:ApisBaseDataItem)=>{
            i.param_id = snowflakeId();
            return i;
          });
        }

        if (isString(result?.bodyRaw)) {
          draft.raw = result?.bodyRaw;
        }
       
        if (isPlainObject(result?.bodyBinary)) {
          draft.binary = {
            file_name: result.bodyBinary?.file_name || '',
            data_url: result.bodyBinary?.data_url || '',
          }
        }

        if (isPlainObject(result?.bodyRawSchema)) {
          draft.raw_schema = result?.bodyRawSchema || {};
        }
      });

      onChange?.('body', newRequestData);
      message.success('Generate Success');
    }

    const handleGenerateDesignBody = async () => {

      try {
        let deepApiData = cloneDeep(apiData);
        fillInOpenApi(deepApiData);

        const result = await handleOpenApiToEchoapi({...deepApiData?.open_api},deepApiData as ApiDetailsData);

        if (isEmpty(result)) {
          return;
        }

         // There are key inconsistencies
      if (isArray(result?.diffArr) && result.diffArr.length > 0 && result.diffArr.findIndex((i:any)=>i === 'Body') > -1) {
        modal?.confirm({
          title: t('common.generate_debug_body_tip'),
          content: <Flex vertical gap={20}>
            <span> {t('common.debug_design_diff_tip')}
              <Typography.Text style={{ color: 'var(--font-content-color)' }}>
              [Body]
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
          okText: 'OK',
          cancelText: 'Cancel',
          async onOk() {
              submitDesign2debug(result);
          },
        });
        return;
      }
      submitDesign2debug(result);

      } catch (error:any) {
        message.error(error);
        return;
      }
    }

    const handleGenerateParameterByAi = () => {
      autoJsonFaker(value?.raw).then((mockData: any) => {
        if (!value) return;
        const newRequestData = produce(value, (draft) => {
          if (isString(mockData) && mockData?.length > 0) {
            draft.raw = mockData;
          }
        });

        onChange?.('body', newRequestData);
      }).catch((error: string) => {
        message.error(error);
      });
    };

    const handleBodyModeSelectChange: SelectProps['onChange'] = (value) => {
      handleBodyModeChange(value);
    };
    const handleBodyModeRadioChange = (event: RadioChangeEvent) => {
      const value = event.target.value;
      handleBodyModeChange(value);
    };

    return (
      <RequestBodyContainer className="request-body-container">
        <Flex vertical>
          <Flex className="request-body-header" align="center" justify='space-between'>
            <Flex align="center">

            {isEqual(systemConfigTabDirection, -1) ? (
              <Select
                size='small'
                style={{marginInlineEnd: 12 }}
                popupMatchSelectWidth={false}
                options={bodyModeOptions}
                value={calcBodyModeValue}
                onChange={handleBodyModeSelectChange}
              />
            ) : (
              <Radio.Group
                style={{ paddingLeft: 8 }}
                options={bodyModeOptions}
                value={calcBodyModeValue}
                onChange={handleBodyModeRadioChange}
              />
            )}
              {isRowMode && (
                <Select
                  size='small'
                  popupMatchSelectWidth={false}
                  options={rowOptions}
                  value={value?.mode}
                  onChange={(value) => handleModeChange(value)}
                />
              )}
            </Flex>
            {apiData?.target_type === 'api' && <Flex className='other-btn' align='center'>
              {value?.mode === 'json' && <Tooltip title='Auto Generate'>
                <Flex>
                  <Button
                    onClick={handleGenerateParameterByAi}
                    type="text"
                    mode="light"
                    size="small"
                    icon={<IconFont style={{ color: 'var(--icon-color)',fontSize:'16px' }} type="icon-ai-generate-01" />}
                  >
                  </Button>
                </Flex>
              </Tooltip>}
              <Tooltip title={apiData?.is_create === 1 ?  t('common.not_create_design_tip') : t('common.generate_dubug_body_tip')}>
                <Flex>
                  <Button
                    disabled={apiData?.is_create === 1}
                    onClick={handleGenerateDesignBody}
                    type="text"
                    mode="light"
                    size="small"
                    icon={<IconFont style={{ color: 'var(--icon-color)' }} type="icon-Frame" />}
                  >
                  </Button>
                </Flex>
              </Tooltip>
            </Flex>}
          </Flex>
          <SuspenseContent>
            <div className="request-body-content-wrap">{bodyContent}</div>
          </SuspenseContent>
        </Flex>
        {contextHolder}
      </RequestBodyContainer>
    );
  };

export default RequestBody;
