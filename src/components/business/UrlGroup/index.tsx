import React, { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ConfigProvider, Divider, Flex, Input, Select, SelectProps, Space, Typography } from 'antd';

import classnames from 'classnames';
import { find, includes, isArray, isString, toLower, toUpper } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { PROTOCOL_OPTIONS } from '@/constants/apis';
import { METHODS_MAP } from '@/constants/common';
import useTheme from '@/hooks/useTheme';
import { openEnvPage, saveProjectConfig } from '@/events/apis/env';
import { useApis, useProjectConfig } from '@/store';

import VarInput from '../VarInput';

import { MethodDropdownWrap, OptionsItemContainer, UrrGroupWrap } from './style';
import { getCollectionServerId } from '@/utils/apis';
import { CurlDataType } from '@/types/apis/other';

export interface UrlGroupProps {
  envId?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  data: {
    url?: string;
    method?: string;
    protocol?: string;
    service?: string;
    func?: string;
  };
  placeholder?: string;
  maxLength?: number;
  urlGroupExtraContent?: React.ReactNode;
  supportCurlImport?: boolean;
  onChange: (key: string, value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>, isEnvOpen?: boolean) => void;
  curlChange?: (d: CurlDataType) => void;
  curServerId: string;
  SetCurServerId: (newId: string) => void;
  hideProtocol?: boolean
  hideServer?: boolean
}

type LabelRender = SelectProps['labelRender'];

const UrlGroup = (props: UrlGroupProps) => {
  const {
    envId,
    type = 'api',
    data,
    readOnly = false,
    className = '',
    style = {},
    placeholder,
    maxLength,
    urlGroupExtraContent,
    onChange,
    onKeyDown,
    curServerId,
    SetCurServerId,
    hideProtocol = false,
    hideServer = false,
    supportCurlImport = false,
    curlChange,
  } = props || {};
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const apisActiveData = useApis(store => store.apisActiveData);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const updateCurrentServerId = useApis((state) => state.updateCurrentServerId);
  const customMethodList = useProjectConfig((state) => state?.customMethodList);
  const updateCustomMethodList = useProjectConfig((state) => state?.updateCustomMethodList);

  const [methodSearchValue, setMethodSearchValue] = useState('');
  const [methodSelectOpen, setMethodSelectOpen] = useState(false);

  const currentEnv = useMemo(() => {
    const env = envId || envDetailKeys;
    return find(envList, (it) => it?.env_id === env); // use passed environment id if available, otherwise use default
  }, [envList, envDetailKeys, envId]);

  const envUrl = useMemo(() => {
    if (isArray(currentEnv?.server_list)) {
      const defaultServer = currentEnv.server_list.find(i => i?.is_default === 1);
      return defaultServer?.uri || '';
    }
    return '';
  }, [currentEnv]);


  useEffect(() => {
    const tempServerId = getCollectionServerId(apisActiveData?.target_id, apiOriginDetailsList.reduce((pre: any, cur) => {
      if (cur?.target_id) {
        pre[cur.target_id] = cur;
      }
      return pre;
    }, {}));
    updateCurrentServerId(tempServerId);
    SetCurServerId(tempServerId);
  }, [apiOriginDetailsList]);

  const handleChange = (key: string, value: string) => {
    onChange(key, value);
  };

  const defaultServerId = useMemo(() => {
    if (isArray(currentEnv?.server_list)) {
      const defaultServerId = currentEnv.server_list.find(i => i?.is_default === 1)?.server_id || '';
      if(defaultServerId){
        return defaultServerId;
      }
      return currentEnv.server_list.find(i => i?.server_id == '1')?.server_id || '';
    }
    return '';
  }, [currentEnv]);

  const addServer = () => {
    openEnvPage({ env_id: currentEnv?.env_id });
  };

  const renderUri = (uri: string) => {
    if (uri.length <= 0) {
      return <span style={{ fontStyle: 'italic' }}>null</span>;
    }
    return uri;
  };

  const optionRender: SelectProps['optionRender'] = (option) => {
    return (
      <OptionsItemContainer>
        <span className="label">{option?.data?.label}</span>
        <span className="uri">{renderUri(option?.data?.uri || '')}</span>
      </OptionsItemContainer>
    );
  }

  const serverOptions = useMemo(() => {
    return currentEnv?.server_list?.map((item) => ({
      label: item.name,
      value: item.server_id,
      uri: item.uri,
    }));
  }, [currentEnv?.server_list]);

  const methodDropdownRender = useCallback((_menu: React.ReactElement) => {
    let methodList = METHODS_MAP[type].concat(customMethodList);
    let searchMethodList = methodList.filter(i => (toLower(i).includes(toLower(methodSearchValue)) || !methodSearchValue));
    let noSearch = methodList.filter(i => (toLower(i) === toLower(methodSearchValue))).length <= 0;
    return <>
      <MethodDropdownWrap>
        <Flex vertical style={{ maxHeight: 256, overflowY: 'auto' }}>
          {searchMethodList.map(i => <div onClick={() => {
            handleChange('method', `${i}`);
            setMethodSelectOpen(false);
          }} aria-selected="false" className={classnames('beautify-select-item', 'beautify-select-item-option', {
            "beautify-select-item-option-selected": data?.method === i
          })} title={i}>
            <div className="beautify-select-item-option-content">{i}</div>
            <span onClick={(e) => e.stopPropagation()} className="beautify-select-item-option-state" unselectable="on" aria-hidden="true" style={{ "userSelect": "none" }}>
              {!METHODS_MAP[type].includes(i) && <IconFont className='select-item-icon-delete' style={{ cursor: 'pointer' }} onClick={(e) => {
                e.stopPropagation();
                onMethodDelete(i);
              }} type='icon-delete'></IconFont>}
            </span>
          </div>)}
        </Flex>
        {noSearch && methodSearchValue.length > 0 && <>
          <Divider style={{ margin: '8px 0' }} />
          <Flex align='center' className="select-item-add" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: 14, flexWrap: 'nowrap' }} onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onMethodAddClick();
          }}>
            <Typography.Text style={{ color: 'var(--font-light-color)' }}>
              Use
            </Typography.Text>
            '
            <Typography.Text ellipsis style={{ color: 'var(--font-content-color)', maxWidth: 44 }}>
              {methodSearchValue}
            </Typography.Text>
            '
          </Flex>
        </>}
      </MethodDropdownWrap>
    </>;
  }, [customMethodList, methodSearchValue, data]);

  const onMethodDelete = (val: string) => {
    let newCustomMethodList = [...customMethodList.filter(i => i !== val)]
    updateCustomMethodList(newCustomMethodList);
    saveProjectConfig('customMethodList', newCustomMethodList);
  };
  useEffect(() => {
    if (!methodSelectOpen && methodSearchValue.length > 0) {
      let { customMethodList: list } = useProjectConfig.getState();
      let methodList = METHODS_MAP[type].concat(list);
      let searchMethodList = methodList.filter(i => toLower(i) === (toLower(methodSearchValue)));
      // not saved yet, auto save new method on blur
      if (searchMethodList.length <= 0 && methodSearchValue.length > 0) {
        updateCustomMethodList([...list, methodSearchValue]);
        saveProjectConfig('customMethodList', [...list, methodSearchValue]);
      }
      setMethodSearchValue('');
    }
  }, [methodSelectOpen, methodSearchValue]);
  const onMethodBlur = () => {
    let val = methodSearchValue.trim();
    // Save selection on blur
    if (val.length > 0) {
      handleChange('method', val);
    } else if (data?.method && data.method.length > 0 && METHODS_MAP[type].concat(customMethodList).filter(i => i === data.method).length <= 0) {
      let newCustomMethodList = [...customMethodList, data.method];
      updateCustomMethodList(newCustomMethodList);
      saveProjectConfig('customMethodList', newCustomMethodList);
    }
  };

  const onMethodAddClick = () => {
    handleChange('method', methodSearchValue);
    setMethodSearchValue('');

    let newCustomMethodList = [...customMethodList, methodSearchValue];
    updateCustomMethodList(newCustomMethodList);
    saveProjectConfig('customMethodList', newCustomMethodList);


    setMethodSelectOpen(false);
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      setMethodSelectOpen(false);
    }
  }

  const pasteCurlChange = (d: CurlDataType) => {
    if (supportCurlImport) {
      curlChange?.(d);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: themeToken.popoverSelectBgColor,
            borderRadius: themeToken.borderRadius,
            fontSize: themeToken.fontSize14,
            colorBorder: 'transparent',
          },
          Input: {
            activeShadow: 'none',
            fontSize: themeToken.fontSize14,
            hoverBg: themeToken.highlightChangeColor,
            activeBg: themeToken.highlightChangeColor,
          },
        },
      }}
    >
      <UrrGroupWrap $token={themeToken} className={className} style={style}>
        {['api', 'sse'].includes(type) && <>
          <Select
            open={methodSelectOpen}
            onDropdownVisibleChange={(open) => {
              setMethodSelectOpen(open);
            }}
            className={classnames('default', {
              [data?.method?.toLowerCase() || 'default']: true,
            })}
            disabled={readOnly}
            value={data?.method || METHODS_MAP[type][0]}
            suffixIcon={<IconFont style={{ pointerEvents: 'none' }} type="icon-drop-down" />}
            size='small'
            dropdownRender={methodDropdownRender}
            placeholder='METHOD'
            dropdownStyle={{ width: '110px' }}
            showSearch={true}
            searchValue={methodSearchValue}
            onSearch={(val) => {
              if (val?.length > 32) return;
              setMethodSearchValue(toUpper(val));
            }}
            onBlur={onMethodBlur}
            onInputKeyDown={onInputKeyDown}
          >
            {METHODS_MAP[type].map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
          <div className="line"></div>
        </>
        }



        <div className="url-group-container">
          {includes(['sse', 'api','websocket2','socketio','graphql'], type) && !hideServer && isArray(currentEnv?.server_list) && (
            <Tooltip
              overlayInnerStyle={{ wordBreak: 'break-all' }}
              title={
                <>
                  {t('supplement.from_env')}“{currentEnv?.name}“{envUrl}
                  &nbsp;
                  <span
                    style={{ color: themeToken.colorPrimary, cursor: 'pointer' }}
                    onClick={() => openEnvPage({ env_id: currentEnv?.env_id })}
                  >
                    {t('supplement.go_edit')}
                  </span>
                </>
              }
            >
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      selectorBg: 'transparent',
                      borderRadius: themeToken.borderRadius,
                      colorText: themeToken.fontLightColor,
                    },
                  },
                }}
              >
                {isArray(currentEnv?.server_list) && currentEnv?.server_list.some(i => (isString(i?.uri) && i?.uri.length > 0)) && <Select
                  value={curServerId || defaultServerId}
                  labelRender={labelRender}
                  optionRender={optionRender}
                  options={serverOptions}
                  suffixIcon={
                    <IconFont
                      style={{ pointerEvents: 'none', color: themeToken.fontLightColor }}
                      type="icon-drop-down"
                    />
                  }
                  popupMatchSelectWidth={450}
                  className="right-select right-select-http env-desc"
                  onChange={(i)=>{
                    updateCurrentServerId(i);
                    SetCurServerId(i);
                  }}
                  size='small'
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Button style={{ color: 'var(--color-primary)', padding: '5px 2px' }} type="text" icon={<IconFont type='icon-add-line' />} onClick={addServer}>
                          Add Server
                        </Button>
                      </Space>
                    </>
                  )}
                />
                }

              </ConfigProvider>
            </Tooltip>
          )}
          {includes(['api', 'sse', 'grpc', 'websocket2', 'socketio'], type) ? (
            <VarInput
              placeholder={placeholder || t('common.enter_url_placeholder')}
              maxLength={maxLength}
              enableNewRow={false}
              envId={envId}
              value={data?.url || ''}
              onKeyDown={onKeyDown}
              onChange={(v) => {
                handleChange('url', v);
              }}
              readOnly={readOnly}
              pasteCurlChange={pasteCurlChange}
            />
          ) : (
            <Input
              maxLength={maxLength}
              className="url-group-input"
              placeholder={placeholder || t('common.enter_url_placeholder')}
              readOnly={readOnly}
              onChange={(e) => handleChange('url', e?.target?.value || '')}
              value={data?.url || ''}
            />
          )}
        </div>

        {includes(['api'], type) && !hideProtocol && (
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  selectorBg: 'transparent',
                  borderRadius: themeToken.borderRadius,
                  colorText: themeToken.fontLightColor,
                },
              },
            }}
          >
            <Select
              value={data?.protocol || 'http/1.1'}
              suffixIcon={
                <IconFont
                  style={{ pointerEvents: 'none', color: themeToken.fontLightColor }}
                  type="icon-drop-down"
                />
              }
              popupMatchSelectWidth={false}
              className="right-select right-select-http"
              onChange={handleChange.bind(null, 'protocol')}
              size='small'
            >
              {PROTOCOL_OPTIONS.map((item: { value: string; label: string }) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                  {item.value === 'http/2' && (
                    <Tooltip title={t('api.design.http2_tip')}>
                      <IconFont style={{ marginLeft: 4 }} type="icon-wenhao" />
                    </Tooltip>
                  )}
                </Select.Option>
              ))}
            </Select>
          </ConfigProvider>
        )}
        {urlGroupExtraContent}
      </UrrGroupWrap>
    </ConfigProvider>
  );
};

export default UrlGroup;
