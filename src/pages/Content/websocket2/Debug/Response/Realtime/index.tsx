import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown } from 'antd';

import { useSafeState } from 'ahooks';
import aptTools from 'apipost-tools';
import { cloneDeep, isArray, isEqual, isFunction, isObject, isString, map, size } from 'lodash';

import { Sending } from '@/components/business';
import FlowResponse from '@/components/business/FlowResponse';
import ResizablePanels from '@/components/business/ResizablePanels';
import ResponseResult from '@/components/business/ResponseResult';

import { IconFont, Tooltip } from '@/components/ui';
import Empty from '@/components/ui/Empty';
import { useApis } from '@/store';
import useWebsocket2Store from '@/store/useApis/websocket2';
import { MessageItem } from '@/types/apis/websocket2';

import useWebsocket2 from '../../../useWebsocket2';
import Header from './Header';
import { handleSocketResponse } from './utils';
import { ExampleLabelContainer, ExampleListContainer, WebsocketLeftPanelContainer } from '../../style';

interface Props {
  value: any;
  onChange: (value: any) => void;
}

const Realtime: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const websocket2ConnectionPool = useWebsocket2Store((state) => state.websocket2ConnectionPool);
  const { updatePool } = useWebsocket2();
  const apisActiveData = useApis((state) => state.apisActiveData);
  const apisActiveKey = apisActiveData.target_id;

  const [mode, setMode] = useSafeState<any>('text');
  const [data, setData] = useSafeState<any>({});
  const [filterValue, setFilterValue] = useSafeState<string>('');
  const [filterType, setFilterType] = useSafeState<string>('all');
  const [isScrollAuto, setIsScrollAuto] = useSafeState<boolean>(true);
  const lastScrollTop = useRef(0);
  const resultRef = useRef<any>(null);
  const panelProps = {
    defaultSize: 50,
    minSize: 5,
    collapsible: true,
    collapsedSize: 5,
  };
  const mapTips: any = {
    connect: '',
    disconnect: `${t('ws.response.disconnect')}`,
    error: '',
    send: '',
    message: '',
  };

  const isJSONString = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return isObject(parsed) && !isArray(parsed);
    } catch (err) {
      return false;
    }
  };
  
  const rawHandle = (data: any) => {
    let str = '';
    switch (data?.action) {
      case 'connect':
        str = data?.message?.message;
        break;
      case 'send':
        str = data?.message?.data;
        break;
      case 'message':
        str = data?.message?.data;
        break;
      default:
        str = data?.message?.message;
        break;
    }

    return str || '';
  };

  const calcContent = (params?: any, parseToJsonStr = false) => {
    try {
      const { action, message } = params || {};

      if (action === 'message') {
        if (!isString(message) && message?.data?.type && message?.data?.data) {
          const bufferRaw = aptTools.bufferToRaw(message?.data?.data, {});
          const { raw } = bufferRaw;
          const result = raw;

          if (isJSONString(result)) {
            return result;
          }

          if (parseToJsonStr) {
            return JSON.stringify(result);
          }

          return result;
        }

        return parseToJsonStr ? JSON.stringify(message) : String(message);
      } else {
        return rawHandle(params);
      }
    } catch (err) {
      return '';
    }
  };
  const resultRaw = useMemo(() => {
    return calcContent(data) || '';
  }, [data]);
  const renderTitle = (data: any) => {
    const { action } = data || {};
    return (
      <div
        className="title"
        style={{
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {mapTips[action]}
        {calcContent(data)}
      </div>
    );
  };

  const wsTemplateStateList = useMemo(() => {
    return handleSocketResponse(
      websocket2ConnectionPool[apisActiveKey]?.socketRes,
      filterValue,
      filterType
    );
  }, [websocket2ConnectionPool, apisActiveKey, filterValue, filterType]);
  const DropdownItems = useMemo(() => {
    return map(value?.message, (item: MessageItem) => ({
      label: (
        <ExampleLabelContainer>
          <span className="name">
            <Tooltip title={item.name}>{item.name}</Tooltip>
          </span>
        </ExampleLabelContainer>
      ),
      key: item.param_id,
    }));
  }, [value]);

  const saveSocketMessageDom = (
    <Dropdown
      trigger={['click']}
      dropdownRender={(menu) => {
        return <ExampleListContainer style={{ minWidth: 120 }}>{menu}</ExampleListContainer>;
      }}
      menu={{
        items: DropdownItems,
        onClick: ({ key }) => {
          const newValue = cloneDeep(value);
          newValue?.message.forEach((item: MessageItem) => {
            if (item.param_id === key) {
              item.response.raw = resultRaw;
              item.response.mode = mode;
            }
          });
          onChange(newValue);
        },
      }}
    >
      <Tooltip title={t('api.design.save_response')}>
        <IconFont type="icon-save" className="icon-copy" />
      </Tooltip>
    </Dropdown>
  );
  const customTipsContent = (data: any) => {
    if (isString(data?.message)) return {};

    return {
      size: data?.message?.size,
      time: data?.message?.time,
      mode: data?.message?.dataType,
    };
  };
  useEffect(() => {
    if (!isFunction(resultRef?.current?.setTabsValue)) {
      return;
    }
    if (!isEqual(data?.message?.fitForShow, 'Monaco') && isEqual(data?.action, 'message')) {
      resultRef?.current?.setTabsValue('preview');
    } else {
      resultRef?.current?.setTabsValue('beautify');
    }
  }, [data]);

  useEffect(() => {
    const el = document.querySelector('.ws2');
    const scroll = el && isScrollAuto;
    if (scroll) {
      el.scrollTop = el?.scrollHeight || 0;
    }
  }, [isScrollAuto, wsTemplateStateList]);
  useEffect(() => {
    const el = document.querySelector('.ws2');
    el?.addEventListener('scroll', () => {
      const el = document.querySelector('.ws2');
      el?.addEventListener('scroll', function () {
        const currentScrollTop = el.scrollTop;
        if (currentScrollTop < lastScrollTop.current) {
          setIsScrollAuto(false);
        }
        lastScrollTop.current = currentScrollTop;
      });
    });
  }, [setIsScrollAuto]);
  useEffect(() => {
    if (wsTemplateStateList[size(wsTemplateStateList) - 1]?.action === 'send') {
      setIsScrollAuto(true);
    }
  }, [wsTemplateStateList]);
  return (
    <>
      {websocket2ConnectionPool[apisActiveKey]?.status === 'connecting' && (
        <Sending
          onCancel={() => {
            
            // Disconnect
            window?.vscode.postMessage({
              action: 'ws_disconnect',
              data: value?.target_id
            });

            updatePool(value?.target_id, 'disconnect', {});
          }}
        />
      )}

      <div
        style={{
          height: '100%',
        }}
      >
        {size(wsTemplateStateList) > -1 ? (
          <ResizablePanels
            panelGroupProps={{
              autoSaveId: 'ws_realtime_container_resize_save_id',
              direction: 'horizontal',
            }}
            leftPanelProps={{
              ...panelProps,
              collapseTitle: t('supplement.socket_realtime_msg'),
            }}
            rightPanelProps={{
              ...panelProps,
              collapseTitle: t('supplement.socket_realtime_content'),
            }}
            leftPanel={
              <WebsocketLeftPanelContainer>
                <Header
                  target_id={apisActiveKey}
                  filterValue={filterValue}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  setFilterValue={setFilterValue}
                />
                <div
                  className="ws2"
                  style={{
                    overflow: 'auto',
                    maxHeight: 'calc(100% - 50px)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <FlowResponse
                    renderTitle={renderTitle}
                    customTipsContent={customTipsContent}
                    onItemClick={(item: any) => {
                      setData(item);
                    }}
                    data={wsTemplateStateList}
                  />
                </div>
              </WebsocketLeftPanelContainer>
            }
            rightPanel={
              <div style={{ height: '100%', padding: 8 }}>
                {isEqual(data?.action, 'message') && (
                  <ResponseResult
                    ref={resultRef}
                    data={
                      {
                        ...data,
                        fit_for_show: data?.message?.fitForShow,
                        stream: data?.message?.data,
                        mime_type: { ext: data?.message?.dataType, mime: '' },
                      } as any
                    }
                    setMode={setMode}
                    resultIncludesTabs={['beautify', 'native', 'preview']}
                    warpVisible={false}
                    rawHtml={resultRaw}
                  />
                )}
                {!isEqual(data?.action, 'message') && (
                  <ResponseResult
                    ref={resultRef}
                    data={
                      {
                        ...data,
                        fit_for_show: data?.message?.fitForShow,
                        stream: data?.message?.data,
                        mime_type: { ext: data?.message?.dataType, mime: '' },
                      } as any
                    }
                    setMode={setMode}
                    resultIncludesTabs={['beautify', 'native']}
                    warpVisible={false}
                    rawHtml={resultRaw}
                  />
                )}
              </div>
            }
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default Realtime;
