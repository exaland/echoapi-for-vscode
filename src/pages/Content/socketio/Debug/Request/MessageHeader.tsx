import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AutoComplete,
  Checkbox,
  Flex,
  Select,
} from 'antd';

import {
  useSafeState,
} from 'ahooks';
import produce from 'immer';
import { filter, includes, isEqual, map, size, trim } from 'lodash';

import Button from '@/components/ui/Button';
import { useApis } from '@/store';
import useApisWebsocket2 from '@/store/useApis/websocket2';
import { SocketIoDetailsData } from '@/types/apis/socketio';
import { MessageHeaderWrap } from './style';

interface Props {
  value: any;
  onChange: (value: any) => void;
  apisData: SocketIoDetailsData;
  onChangeApisData: (apisData: SocketIoDetailsData) => void;
}
const MessageHeader = (props: Props) => {
  const { t } = useTranslation();
  const websocket2ConnectionPool = useApisWebsocket2((state) => state.websocket2ConnectionPool);
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const { value, onChange, apisData, onChangeApisData } = props || {};
  const [binaryType, setBinaryType] = useSafeState('');

  useEffect(() => {
    if (includes(['base64', 'hexadecimal'], value?.mode)) {
      setBinaryType('binary');
    } else {
      setBinaryType('');
    }
  }, [setBinaryType, value]);
  const setEventName = (val: string) => {
    const newData = produce(apisData, (draft: any) => {
      draft.msg_data = val;
    });
    onChangeApisData(newData);
  };
  const setAck = (val: boolean) => {
    const newData = produce(apisData, (draft: any) => {
      draft.ack = val ? 1 : -1;
    });
    onChangeApisData(newData);
  };
  return (
    <MessageHeaderWrap>
      <Flex align="center" gap={12}>
        <Select
          value={binaryType || value?.mode}
          onChange={(val) => {
            if (val === 'binary') {
              setBinaryType(val);
              onChange({ ...value, mode: 'base64' });
              return;
            }
            setBinaryType('');
            onChange({ ...value, mode: val });
          }}
          size="small"
          style={{ width: 80 }}
        >
          <Select.Option value="text">Text</Select.Option>
          <Select.Option value="json">JSON</Select.Option>
          <Select.Option value="binary">Binary</Select.Option>
        </Select>
        {binaryType === 'binary' && (
          <Select
            size="small"
            value={value?.mode}
            onChange={(val) => onChange({ ...value, mode: val })}
            style={{ width: 115 }}
          >
            <Select.Option value="base64">Base64</Select.Option>
            <Select.Option value="hexadecimal">Hexadecimal</Select.Option>
          </Select>
        )}
      </Flex>
      <Flex align="center" gap={12}>
        <Checkbox
          checked={isEqual(apisData?.ack, 1)}
          onChange={(e) => {
            setAck(e?.target?.checked);
          }}
        >
          Ack
        </Checkbox>
        <AutoComplete
          style={{ width: 180,fontSize:12,height:26 }}
          value={apisData?.msg_data || ''}
          placeholder={t('ws.request.event_name')}
          onSelect={setEventName}
          maxLength={1024}
          options={filter(
            map(apisData?.request?.event?.parameter, (item) => ({
              value: item?.key,
              label: item?.key,
            })),
            (it) => trim(it?.value) !== ''
          )}
          onChange={setEventName}
        />
        <Button
          type="primary"
          size="small"
          disabled={
            !(
              size(trim(value?.raw)) > 0 &&
              isEqual(websocket2ConnectionPool[apisActiveKey]?.status, 'connect')
            )
          }
          onClick={() => {
            window?.vscode.postMessage({
              action: 'socketio_send',
              data: {
                target_id: apisActiveKey,
                msg: value?.raw,
                type: value?.mode,
                event: apisData?.msg_data || 'message',
                is_ack: apisData?.ack || -1,
              }
            });
          }}
        >
          {t('ws.request.sent')}
        </Button>
      </Flex>
    </MessageHeaderWrap>
  );
};

export default MessageHeader;
