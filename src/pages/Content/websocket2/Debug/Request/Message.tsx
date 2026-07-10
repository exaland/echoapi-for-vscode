import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useMemoizedFn } from 'ahooks';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { cloneDeep, concat, find, findIndex, head, isEqual, map, set } from 'lodash';

import { RawEditor } from '@/components/business';
import context from '@/components/business/RawEditor/visualizationContext';
import { MessageItem, Websocket2DetailsData } from '@/types/apis/websocket2';

import MessageHeader from './MessageHeader';
import { DEFAULT_WEBSOCKET2_MESSAGE } from '@/constants/apis/request';
import ListSideBar from '@/components/business/ListSideBar';
import { RawEditorWrap } from '@/pages/Content/socketio/Debug/Request/style';

interface Props {
  value: Websocket2DetailsData;
  onChange: (data: Websocket2DetailsData) => void;
}
const Message = (props: Props) => {
  const { t } = useTranslation();
  const { Provider } = context;
  const { value, onChange } = props || {};

  const handleMessage = (data: MessageItem[]) => {
    onChange({
      ...value,
      message: data,
    });
  };
  const handleAdd = () => {
    const param_id = snowflakeId();
    const newMessage = concat(value.message, { ...DEFAULT_WEBSOCKET2_MESSAGE, param_id });
    handleMessage(newMessage);
  };
  const handleSelect = (param_id: string) => {
    onChange({
      ...value,
      active_id: param_id,
    });
  };
  const handleRemove = useMemoizedFn((param_id: string) => {
    let active_id;
    const activeKey = value?.active_id || head(value.message)?.param_id;
    const newMessage = produce(value.message, (draft) => {
      const messageIndex = findIndex(value.message, (item) => isEqual(item.param_id, param_id));
      if (messageIndex > -1) {
        draft.splice(messageIndex, 1);
      }
      if (isEqual(activeKey, param_id)) {
        const nextActiveKey = draft[messageIndex - 1]?.param_id || head(draft)?.param_id;
        active_id = nextActiveKey;
      } else {
        active_id = value?.active_id;
      }
    });

    onChange({
      ...value,
      message: newMessage,
      active_id: active_id,
    });
  });
  const onEdit = (index: number, { value: item }: { key: string; value: string }) => {
    const message = cloneDeep(value?.message);

    set(message, index, { ...message[index], name: item?.trim() || t('supplement.msg') });
    handleMessage(message);
  };

  const onChangeItemRequest = (
    data: Pick<MessageItem['request'], 'mode' | 'raw' | 'raw_parameter' | 'raw_schema'>
  ) => {
    const newMessage = map(value.message, (item) => {
      if (isEqual(item.param_id, value.active_id || head(value.message)?.param_id)) {
        return { ...item, request: { ...data } };
      }
      return item;
    });

    handleMessage(newMessage);
  };
  const curItem = useMemo(() => {
    return (
      find(value.message, (item) => isEqual(item.param_id, value.active_id)) || head(value.message)
    );
  }, [value.message, value.active_id]);

  if (!curItem) return;
  return (
    <Flex gap={12} style={{ height: '100%' }}>
      <ListSideBar
        handleSelect={handleSelect}
        value={value.message as any}
        activeId={value.active_id || head(value.message)?.param_id}
        handleEdit={onEdit}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        addText={'Message'}
      />
      <Provider
        value={{
          isDebugArea: true,
        }}
      >
        <Flex vertical gap={8} style={{ height: '100%', flex: 1, width: 0 }}>
          <RawEditorWrap className="raw-editor-wrap">
            <RawEditor
              regularValueHeight={0}
              mode={curItem.request.mode}
              isParameter={!['json', 'xml'].includes(curItem.request.mode)}
              value={curItem.request}
              onChange={onChangeItemRequest}
            />
          </RawEditorWrap>
          <MessageHeader value={curItem.request} apisData={value} onChange={onChangeItemRequest} />
        </Flex>
      </Provider>
    </Flex>
  );
};

export default Message;
