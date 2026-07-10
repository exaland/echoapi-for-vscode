import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Tag } from 'antd';

import { useSafeState } from 'ahooks';
import aptTools from 'apipost-tools';
import {
  includes,
  isArray,
  isEqual,
  isObject,
  isString,
  map,
  size,
} from 'lodash';

import { Sending } from '@/components/business';
import FlowResponse from '@/components/business/FlowResponse';
import ResizablePanels from '@/components/business/ResizablePanels';
import ResponseResult from '@/components/business/ResponseResult';

import { Tooltip } from '@/components/ui';
import Empty from '@/components/ui/Empty';
import { useApis } from '@/store';
import useWebsocket2Store from '@/store/useApis/websocket2';
import { MessageItem } from '@/types/apis/socketio';
import { hexToRGBA } from '@/utils/common';

import useWebsocket2 from '../../../useWebsocket2';
import ExampleModal from './ExampleModal';
import Header from './Header';
import { getSendStr, handleSocketResponse, stringToColor } from './utils';
import { ExampleLabelContainer, SocketIoLeftPanelContainer } from '../../style';

interface Props {
  target_id: string;
  onChange: (value: any) => void;
  apiScreenDirection:any;
}

const Realtime: React.FC<Props> = ({ target_id, onChange, apiScreenDirection }) => {
  const { t } = useTranslation();
  const websocket2ConnectionPool = useWebsocket2Store((state) => state.websocket2ConnectionPool);
  const { updatePool } = useWebsocket2();
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const opensApiDetailsData = useApis((state) => state.opensApiDetailsData);
  const value: any = opensApiDetailsData[target_id];
  const [mode, setMode] = useSafeState<any>('text');
  const [data, setData] = useSafeState<any>({});
  const [filterValue, setFilterValue] = useSafeState<string>('');
  const [filterType, setFilterType] = useSafeState<string>('all');
  const [isScrollAuto, setIsScrollAuto] = useSafeState<boolean>(true);
  const lastScrollTop = useRef<{ [k: string]: number }>();
  const resultRef = useRef<any>(null);
  const flowRef = useRef<any>(null);
  const exampleRef = useRef<any>(null);
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
    listen: `${t('supplement.listening')}`,
    'listen-end': `${t('supplement.listen_end')}`,
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
        str = getSendStr(data?.message?.message?.data);
        break;
      case 'listen':
        str = data?.message;
        break;
      case 'listen-end':
        str = data?.message;
        break;
      case 'send_ack':
        str = getSendStr(data?.message?.message?.data);
        break;
      default:
        str = data?.message?.message;
        break;
    }

    return str || '';
  };

  const calcContent = (params?: any, parseToJsonStr = false) => {
    try {
      const {
        action,
        message: { message },
      } = params || {};

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
        {includes(['message', 'send', 'send_ack'], action) && data?.message?.message?.event && (
          <Tag
            bordered={false}
            style={{
              marginLeft: 8,
              color: stringToColor(data?.message?.message?.event),
              background: hexToRGBA(stringToColor(data?.message?.message?.event), 0.05),
            }}
          >
            {data?.message?.message?.event}
          </Tag>
        )}
        {includes(['listen', 'listen-end'], action) ? (
          <Tag
            bordered={false}
            style={{
              marginLeft: 8,
              color: stringToColor(calcContent(data)),
              background: hexToRGBA(stringToColor(calcContent(data)), 0.05),
            }}
          >
            {calcContent(data)}
          </Tag>
        ) : (
          <>
            {!isEqual(data?.message?.fitForShow, 'Monaco') && isEqual(data?.action, 'message')
              ? '<Binary>'
              : calcContent(data)}
          </>
        )}
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

  const customTipsContent = (data: any) => {
    if (isString(data?.message)) return {};

    return {
      size: data?.message?.size,
      time: data?.message?.time,
      mode: data?.message?.dataType,
    };
  };
  useEffect(() => {
    if (!isEqual(data?.message?.fitForShow, 'Monaco') && isEqual(data?.action, 'message')) {
      resultRef?.current?.setTabsValue('preview');
    } else {
      resultRef?.current?.setTabsValue('beautify');
    }
  }, [data]);

  useEffect(() => {
    const scroll = flowRef?.current && isScrollAuto;
    if (scroll) {
      flowRef.current.scrollTop = flowRef?.current?.scrollHeight || 0;
    }
  }, [apisActiveKey, isScrollAuto, wsTemplateStateList]);
  useEffect(() => {
    flowRef.current?.addEventListener('scroll', () => {
      if (!lastScrollTop.current)
        lastScrollTop.current = {
          [apisActiveKey]: 0,
        };
      const currentScrollTop = flowRef.current.scrollTop;
      if (currentScrollTop < lastScrollTop.current[apisActiveKey]) {
        setIsScrollAuto(false);
      }
      lastScrollTop.current[apisActiveKey] = currentScrollTop;
    });
    const currentFlowRef = flowRef.current;

    return () => {
      // Use local variable to remove event listener
      currentFlowRef?.removeEventListener('scroll', () => { });
    };
  }, [apisActiveKey]);
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
              action: 'socketio_disconnect',
              data: target_id
            });
            updatePool(target_id, 'disconnect', {});
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
              direction: apiScreenDirection === 'horizontal' ? 'vertical' : 'horizontal',
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
              <SocketIoLeftPanelContainer>
                <Header
                  target_id={apisActiveKey}
                  filterValue={filterValue}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  setFilterValue={setFilterValue}
                />
                <div
                  ref={flowRef}
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
              </SocketIoLeftPanelContainer>
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
                        stream: data?.message?.message?.data,
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
      <ExampleModal
        data={value}
        mode={mode}
        rawHtml={resultRaw}
        onChange={onChange}
        ref={exampleRef}
      />
    </>
  );
};

export default Realtime;
