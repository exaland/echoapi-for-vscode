import dayjs from 'dayjs';
import { cloneDeep, isEqual, isString, trim } from 'lodash';

import useWebsocket2Store from '@/store/useApis/websocket2';

import { getWs2SendOptions } from './utils';

const useWebsocket2 = () => {
  const updatePool = (
    target_id: string,
    type: 'connect' | 'connecting' | 'disconnect',
    data: any,
    responseData?: any
  ) => {
    const { websocket2ConnectionPool, updateWebsocket2ConnectionPool } =
      useWebsocket2Store.getState();
    if (data) {
      const newRes = {
        ...data,
      };
      updateWebsocket2ConnectionPool({
        ...websocket2ConnectionPool,
        [target_id]: {
          status: type,
          socketRes: [...(websocket2ConnectionPool?.[target_id]?.socketRes || []), newRes],
          responseData: {
            ...websocket2ConnectionPool?.[target_id]?.responseData,
            ...(responseData || {}),
          },
        },
      });
    }
  };
  const connectWebSocket = async (ITarget: any, status: string, curServerId:string) => {
    const target = cloneDeep(ITarget);

    // Currently connecting
    if (['connecting','connect'].includes(status)) {
      // Disconnect
      window?.vscode.postMessage({
        action: 'ws_disconnect',
        data: target?.target_id
      });
      updatePool(target?.target_id, 'disconnect', {});
      return false;
    }

    // WebSocket connection preprocessing
    const options:any = await getWs2SendOptions(target);
    const updateWebsocket2ConnectionPool =
      useWebsocket2Store.getState().updateWebsocket2ConnectionPool;
    const _websocket2ConnectionPool = useWebsocket2Store.getState().websocket2ConnectionPool;
    updateWebsocket2ConnectionPool({
      ..._websocket2ConnectionPool,
      [target?.target_id]: {
        status: 'connecting',
        socketRes: _websocket2ConnectionPool[target?.target_id]?.socketRes || [],
      },
    });

    options.server_id = curServerId;

    // WebSocket connection request
    window?.vscode.postMessage({
      action: 'ws_connect',
      data: {
        option: options,
        target,
      }
    });
  };

  const handelWsResult = (event: any) => {
    const { message, target_id } = event;
    switch (event?.action) {
      case 'connected':
        if (message?.isSuccess) {
          updatePool(
            target_id,
            'connect',
            {
              action: 'connect',
              message,
            },
            message.data
          );
        } else {
          updatePool(target_id, 'disconnect', {
            action: 'error',
            message: message,
          });
        }
        break;
      case 'received':
        const { type, isSuccess } = message || {};
        if (isEqual(type, 'close')) {
          updatePool(target_id, 'disconnect', {
            action: isSuccess ? 'disconnect' : 'error',
            message: message,
          });
          return;
        }
        updatePool(target_id, 'connect', {
          action: type,
          message: message,
        });
        break;
      case 'error':
        updatePool(target_id, 'disconnect', {
          action: 'error',
          message: message,
        });
        break;
      default:
        break;
    }
  };

  return {
    connectWebSocket,
    updatePool,
    handelWsResult
  };
};

export default useWebsocket2;
