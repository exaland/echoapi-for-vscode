import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Select, Space, message } from 'antd';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { cloneDeep, find, findIndex, isEqual, map } from 'lodash';

import LineTabs from '@/components/business/LineTabs';
import RawEditor from '@/components/business/RawEditor';
import { Input, Modal } from '@/components/ui';
import { DEFAULT_SOCKETIO_MESSAGE } from '@/constants/apis/default';
import { MessageItem, SocketIoDetailsData } from '@/types/apis/socketio';
import { EditFormat } from '@/utils/common';

import { ExampleModalContainer } from '../../style';

interface Props {
  onChange?: (v: SocketIoDetailsData) => void;
  rawHtml?: string;
  data: SocketIoDetailsData;
  mode: string;
}

const Index = forwardRef((props: Props, ref) => {
  const { onChange, rawHtml, data, mode } = props;
  const { value: editValue } = EditFormat(rawHtml || '');
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [binaryType, setBinaryType] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [activeKey, setActiveKey] = useState<'request' | 'response'>('response');
  const [exampleInfo, setExampleInfo] = useState<MessageItem>({
    ...DEFAULT_SOCKETIO_MESSAGE,
  });

  useImperativeHandle(ref, () => {
    return {
      show: ({ key }: any) => {
        setActiveKey('response');
        if (key === 'add') {
          setIsCreate(true);
          setExampleInfo({
            ...DEFAULT_SOCKETIO_MESSAGE,
            response: {
              ...DEFAULT_SOCKETIO_MESSAGE.response,
              raw: editValue,
              mode: mode,
            },
          });
        } else {
          setIsCreate(false);
          const item = find(data?.message, (e) => e.param_id === key);

          if (item) {
            setExampleInfo({
              ...item,
              response: {
                ...item.response,
                raw: editValue,
                mode: mode,
              },
            });
          }
        }
        setOpen(true);
      },
    };
  });

  const items = useMemo(() => {
    return map(['request', 'response'], (item) => ({
      label: <>{item}</>,
      key: item,
    }));
  }, []);

  const rawEditorValue = useMemo(
    () => ({
      raw: exampleInfo?.[activeKey]?.raw || '',
      raw_schema: exampleInfo?.[activeKey]?.raw_schema,
      raw_parameter: exampleInfo?.[activeKey]?.raw_parameter || [],
    }),
    [activeKey, exampleInfo]
  );

  const handleOnChange = useMemoizedFn(
    (key: string, newValue: any, place: 'request' | 'response' = 'response') => {
      let _targetItem = cloneDeep(exampleInfo);
      if (isEqual(key, 'name')) {
        _targetItem = {
          ..._targetItem,
          [key]: newValue,
        };
      } else if (isEqual(key, 'raw-edit')) {
        _targetItem = {
          ..._targetItem,
          [place]: {
            ..._targetItem[place],
            ...newValue,
          },
        };
      } else if (isEqual(key, 'schema')) {
        _targetItem = {
          ..._targetItem,
          [place]: {
            ..._targetItem[place],
            ...newValue,
          },
        };
      } else if (isEqual(key, 'mode')) {
        _targetItem = {
          ..._targetItem,
          [place]: {
            ..._targetItem[place],
            [key]: newValue,
          },
        };
      }

      setExampleInfo(_targetItem);
    }
  );

  const onOk = () => {
    if (!exampleInfo?.name) {
      message.info(t('api.design.new_modal.name_error_tip'));
      return;
    }
    if (isCreate) {
      const newData = produce(data, (draft) => {
        draft.message.push(exampleInfo);
      });
      if (onChange) {
        onChange(newData);
      }
    } else {
      const newData = produce(data, (draft) => {
        const targetIndex = findIndex(draft?.message, (findItem) =>
          isEqual(findItem.param_id, exampleInfo?.param_id)
        );
        draft.message[targetIndex] = exampleInfo;
      });
      if (onChange) {
        onChange(newData);
      }
    }
    setOpen(false);
  };

  return (
    <Modal
      onOk={onOk}
      destroyOnClose
      width="60vw"
      closeIcon={null}
      onCancel={() => setOpen(false)}
      open={open}
    >
      <ExampleModalContainer>
        <Input
          width={110}
          value={exampleInfo?.name}
          onBlur={(event) =>
            handleOnChange('name', event.target.value?.trim() || t('supplement.msg'))
          }
          onChange={(event) => handleOnChange('name', event.target.value)}
        />
        <LineTabs
          items={items}
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key as any)}
        />
        <Flex align="center" justify="space-between">
          <Space align="center" className="info-wrap">
            {isEqual(activeKey, 'request') ? t('supplement.req') : t('supplement.res')}
            <Select
              value={binaryType || exampleInfo?.[activeKey]?.mode}
              onChange={(val) => {
                if (val === 'binary') {
                  setBinaryType(val);
                  handleOnChange(
                    'mode',
                    isEqual(activeKey, 'request') ? 'base64' : 'binary',
                    activeKey
                  );
                  return;
                }
                setBinaryType('');
                handleOnChange('mode', val, activeKey);
              }}
              size="small"
              style={{ width: 80 }}
            >
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="xml">XML</Select.Option>
              <Select.Option value="html">HTML</Select.Option>
              <Select.Option value="binary">Binary</Select.Option>
            </Select>
            {binaryType === 'binary' && isEqual(activeKey, 'request') && (
              <Select
                size="small"
                value={exampleInfo?.[activeKey]?.mode}
                onChange={(val) => handleOnChange('mode', val, activeKey)}
                style={{ width: 115 }}
              >
                <Select.Option value="base64">Base64</Select.Option>
                <Select.Option value="hexadecimal">Hexadecimal</Select.Option>
              </Select>
            )}
          </Space>
        </Flex>
        <div className="raw-editor-example">
          <RawEditor
            responseParameterTitle={t('common.raw_input.body_value')}
            mode={exampleInfo?.[activeKey]?.mode}
            isParameter={!['json', 'xml'].includes(exampleInfo?.[activeKey]?.mode)}
            value={rawEditorValue}
            onChange={(value, key = 'schema') => handleOnChange(key, value, activeKey)}
          />
        </div>
      </ExampleModalContainer>
    </Modal>
  );
});

export default Index;
