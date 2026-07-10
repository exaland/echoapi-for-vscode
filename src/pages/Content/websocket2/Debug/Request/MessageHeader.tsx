import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Select,
} from 'antd';

import {
  useSafeState,
} from 'ahooks';
import { includes, isEqual, size, trim } from 'lodash';

import Button from '@/components/ui/Button';
import { useApis } from '@/store';
import useApisWebsocket2 from '@/store/useApis/websocket2';
import { Websocket2DetailsData } from '@/types/apis/websocket2';
import { MessageHeaderWrap } from './style';

interface Props {
  value: any;
  onChange: (value: any) => void;
  apisData: Websocket2DetailsData;
}
const MessageHeader = (props: Props) => {
  const { t } = useTranslation();
  const websocket2ConnectionPool = useApisWebsocket2((state) => state.websocket2ConnectionPool);
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const { value, onChange } = props || {};
  const [binaryType, setBinaryType] = useSafeState('');

  useEffect(() => {
    if (includes(['base64', 'hexadecimal'], value?.mode)) {
      setBinaryType('binary');
    } else {
      setBinaryType('');
    }
  }, [setBinaryType, value]);
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
          <Select.Option value="xml">XML</Select.Option>
          <Select.Option value="html">HTML</Select.Option>
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
              action: 'ws_send',
              data: {
                target_id: apisActiveKey,
                msg: value?.raw,
                type: value?.mode,
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
