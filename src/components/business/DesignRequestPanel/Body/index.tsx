import { FC, lazy, memo, useEffect, useMemo, useState } from 'react';

import { Dropdown, Flex } from 'antd';
import type { MenuItemProps, MenuProps, RadioChangeEvent } from 'antd';
import cn from 'classnames';

import produce from 'immer';
import { includes, isEmpty, isEqual, values } from 'lodash';

import SuspenseContent from '@/components/business/SuspenseContent';
import {
  OPENAPI_REQUEST_BODY_MODE_ARRAY,
  OPENAPI_REQUEST_BODY_MODE_ENUM,
  OPENAPI_REQUEST_BODY_RAW_MODE_ENUM,
} from '@/constants/apis';

import { RequestBodyProps } from './types';

import { RequestBodyContainer } from './style';
import { Empty, IconFont } from '@/components/ui';
import { AnyObject } from '@/types/common';
import { useTranslation } from 'react-i18next';

const RequestBodyBinary = lazy(() => import('./components/Binary'));
const RequestBodyFormData = lazy(() => import('./components/FormData'));
const RequestBodyNone = lazy(() => import('./components/None'));
const RequestBodyRaw = lazy(() => import('./components/Raw'));
const RequestBodyUrlencoded = lazy(() => import('./components/Urlencoded'));

const RequestBody: FC<RequestBodyProps> = memo(
  (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation();

    const [selectType, setSelectType] = useState('');

    useEffect(() => {
      
      if (Object.keys(value).length > 0) {
        setSelectType(Object.keys(value)[0]);
      }
    }, []);

    const modeInfo = useMemo(() => {
      if(!isEmpty(value) && !Object.keys(value).includes(selectType)){
        setSelectType(Object.keys(value)[0]);
      }
      return value?.[selectType] || {};
    }, [value, selectType]);



    const onRequestSchemaChange = (val: any) => {
      const newRequestData = produce(value, (draft) => {
        draft[selectType].schema = val;
      });

      onChange?.(newRequestData);
    };

    const onModeInfoChange = (val: any) => {
      const newRequestData = produce(value, (draft) => {
        draft[selectType] = val;
      });

      onChange?.(newRequestData);
    };

    const bodyContent = useMemo(() => {
      if (selectType == OPENAPI_REQUEST_BODY_MODE_ENUM.FORM_DATA) {
        return <RequestBodyFormData {...props} value={modeInfo?.schema || {}} onChange={onRequestSchemaChange} />
      }
      if (selectType == OPENAPI_REQUEST_BODY_MODE_ENUM.URLENCODED) {
        return <RequestBodyUrlencoded {...props} value={modeInfo?.schema || {}} onChange={onRequestSchemaChange} />
      }

      if (selectType == OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY) {
        return <RequestBodyBinary {...props} value={modeInfo?.schema || {}} onChange={onRequestSchemaChange} />
      }

      if (values(OPENAPI_REQUEST_BODY_RAW_MODE_ENUM).includes(selectType as OPENAPI_REQUEST_BODY_RAW_MODE_ENUM)) {
        return <RequestBodyRaw
          value={modeInfo}
          onChange={onModeInfoChange}
          mode={selectType}
          isParameter={[
            OPENAPI_REQUEST_BODY_RAW_MODE_ENUM.JAVASCRIPT,
            OPENAPI_REQUEST_BODY_RAW_MODE_ENUM.PLAIN,
            OPENAPI_REQUEST_BODY_RAW_MODE_ENUM.HTML,
          ].includes(selectType as OPENAPI_REQUEST_BODY_RAW_MODE_ENUM)}
        />
      }

      return <RequestBodyNone />;
    }, [value, selectType, modeInfo]);

    const handleCreateItemClick: MenuItemProps['onClick'] = async ({ key }) => {
      if (!value) return;

      const newRequestData = produce(value, (draft) => {
        draft[key] = {
          "schema": {
            "type": "object",
            "properties": {}
          }
        }
      });
      onChange?.(newRequestData);

      // Update current selected type
      setSelectType(key);
    };

    const items: MenuProps['items'] = OPENAPI_REQUEST_BODY_MODE_ARRAY.map(i => {
      return {
        label: i,
        key: i,
        disabled: Object.keys(value).includes(i),
        onClick: handleCreateItemClick,
      }
    });

    function getFirstPropertyName(obj: AnyObject) {
      const keys = Object.keys(obj);
      return keys.length > 0 ? keys[0] : '';
    }

    const handleMoreItemClick = async (key: string) => {
      const newRequestData = produce(value, (draft) => {
        delete draft[key];
     
        if (key === selectType) {
          const newSelectType = getFirstPropertyName(draft);
          setSelectType(newSelectType);
        }

      });
      onChange?.(newRequestData);

    };

    const getMoreItems = () => {
      return [{
        label: t('supplement.delete'),
        key: 'delete',
      }]
    };

    return (
      <RequestBodyContainer className="request-body-container">
        <Flex justify='space-between' align='center'>
          <Flex gap={8} className="request-body-title">
            <IconFont type="icon-design-request" />
            {'Body'}
          </Flex>
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Flex className='request-body-add-btn' gap={6}>
              {t('supplement.add')}
              <IconFont type="icon-drop-down" />
            </Flex>
          </Dropdown>
        </Flex>

        {isEmpty(value) ?
          <Empty />
          :
          <>
            <Flex wrap='wrap' gap={8} align='center'>
              {Object.keys(value).map(key => {
                return <Flex className={cn('design-request-body-type-item', {
                  selected: selectType === key
                })}
                  onClick={() => {
                    setSelectType(key);
                  }}
                >
                  {key}
                  <Dropdown menu={{ items:getMoreItems(),onClick:({domEvent})=>{
                      domEvent.stopPropagation();
                      handleMoreItemClick(key);
                  } }} trigger={['click']} placement="bottomRight">
                    <Flex gap={6} onClick={(e) => e.stopPropagation()}>
                      <IconFont className='design-request-body-type-item-icon' type='icon-more' />
                    </Flex>
                  </Dropdown>

                </Flex>;
              })}
            </Flex>

            <SuspenseContent>
              <div className="request-body-content-wrap">{bodyContent}</div>
            </SuspenseContent>
          </>
        }

      </RequestBodyContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestBody;
