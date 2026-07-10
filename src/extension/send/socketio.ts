global.IS_ECHOAPI = true;

import { Websocket2DetailsData } from '@/types/apis/websocket2';
import { globalConfig, socketIoStore } from '../constants';
import { SocketClient } from 'socket.io-client-pro';
import * as vscode from 'vscode';
import { SocketIoDetailsData } from '@/types/apis/socketio';
import { createTargetIdMap, getAboutCollections } from '@/utils/send/utils';
import { SysConfig } from '@/types/settings';
import { genSendBaseOptions, getApiList, getCurrentProjectConfig } from '../utils';
import { ProjectConfigType } from '@/types/project';
import { find, isEqual } from 'lodash';

export const socketioDisconnect = (target_id: string) => {
  if (socketIoStore[target_id]) {
    socketIoStore[target_id]?.disconnect(); //Close existing
    socketIoStore[target_id] = null;
    delete socketIoStore[target_id];
  }
};

// Promise Queue
class PromiseQueue {
  queue = Promise.resolve(true);

  add(operation: any) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(operation).then(resolve).catch(reject);
    });
  }
  get() {
    return this.queue;
  }
}


export const socketioConnect = async (data: { option: any, target: SocketIoDetailsData }) => {
  const { openedPanels } = globalConfig;
  let client;
  let global_target_id;
  let isClose = false;
  const { target, option } = data;
  try {
    if (!target?.target_id) {
      return;
    }
    global_target_id = target.target_id;
    const enqueue = new PromiseQueue();
    //postMessage
    const emitMessageEvent = function (msg: any) {
      const { openedPanels } = globalConfig;
      if (isClose) {
        return;
      }

      if (!socketIoStore[target?.target_id]) {
        return;
      }

      if(msg?.type === 'disconnect' && msg?.isSuccess){
        socketIoStore[target?.target_id] = null;
        delete socketIoStore[target?.target_id];
      }

      if (msg === undefined) {
        return;
      } else {
        try {
          enqueue.add(() => {
            if (['disconnect','connect_error','error','connect_timeout'].indexOf(msg?.type) > -1) {
              socketIoStore[target?.target_id] = null;
              delete socketIoStore[target?.target_id];
            }

            if (openedPanels?.[target?.target_id]) {
              openedPanels[target?.target_id]?.webview.postMessage({
                action: 'setSocketIoResult', data: {
                  message: msg, target_id: target?.target_id, action: 'received'
                }
              });
            }
          })
        } catch (error) {
          // logger.error("emitRuntimeEvent", String(error));
        }
      }
    };

    if (socketIoStore[global_target_id]) {
      try {
        socketIoStore[global_target_id]?.disconnect(); //Close existing
        await socketIoStore[global_target_id]?.awaitDisconnect();
        socketIoStore[global_target_id] = null;
        delete socketIoStore[global_target_id];
      } catch (error) { }
    }

    client = new SocketClient({ target, option, callback: emitMessageEvent });

    socketIoStore[global_target_id] = client;

    const wsResponse = await client.connect();

    if (openedPanels?.[target?.target_id]) {
      openedPanels[target?.target_id]?.webview.postMessage({
        action: 'setSocketIoResult', data: {
          message: wsResponse, target_id: target?.target_id, action: 'connected', target: target
        }
      });
    }

    const end = await client.awaitDisconnect();

    await enqueue.get();
  } catch (error: any) {
    if (socketIoStore[target?.target_id]) {
      socketIoStore[target?.target_id] = null;
      delete socketIoStore[target?.target_id];
    }
    if (error?.isSuccess !== undefined) {
      if (openedPanels?.[target?.target_id]) {
        openedPanels[target?.target_id]?.webview.postMessage({
          action: 'setSocketIoResult', data: {
            message: error, target_id: target?.target_id, action: 'error'
          }
        });
      }
      return;
    }
    try {
      if (openedPanels?.[target?.target_id]) {
        openedPanels[target?.target_id]?.webview.postMessage({
          action: 'setSocketIoResult', data: {
            message: "websocket" + String(error), target_id: target?.target_id, action: 'error'
          }
        });
      }
    } catch (e) {
    }
  }
};

export const socketioSend = async (data: { target_id: any; event: any; msg: any; is_ack: any; type: any; }) => {
  try {
    const { target_id, event, msg, is_ack, type } = data;
    if (!target_id) {
      return;
    }

    if (!event) {
      return;
    }

    if (!socketIoStore?.[target_id]) {
      return;
    }

    const client = socketIoStore[target_id];
    if (!client?.emitEvent) {
      return;
    }

    if (is_ack) {
      client.emitEventWithAck(event, msg, type);
    } else {
      client.emitEvent(event, msg, type);
    }
  } catch (error) {
  }
};

export const socketioUpdateEvent = async (data: { target_id: any; parameter: any; }) => {
  const { openedPanels } = globalConfig;
  try {
    const { target_id, parameter } = data;
    if (!target_id) {
      return;
    }

    if (!parameter) {
      return;
    }

    if (!socketIoStore[target_id]) {
      return;
    }

    const client = socketIoStore[target_id];
    if (!client?.updateEvent) {
      return;
    }

    const ret = client.updateEvent(parameter);

    if (openedPanels?.[target_id]) {
      openedPanels[target_id]?.webview.postMessage({
        action: 'setSocketIoResult', data: {
          message: { ...ret, target_id: target_id },
          target_id: target_id,
          action: 'updateEvent'
        }
      });
    }
  } catch (error) {
  }
};

export const getSocketIoOption = async (data: { option: any, target: any }, context: vscode.ExtensionContext) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const apiList = getApiList(context);
  const { option, target } = data;
  const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};
  // Parent directory related parameters
  const _collection = await getAboutCollections(
    target,
    apiList,
    systemConfig,
    false,
    option?.server_id,
  );

  const curEnv = find(projectConfig?.envList || [], (env) => isEqual(env.env_id, projectConfig?.envDetailKeys));

  // Create target_id mapping and remove extra fields
  const targetIdMap = createTargetIdMap(_collection, curEnv?.server_list);

  if (_collection) {
    for (let index = 0; index < _collection.length; index++) {
      const item = _collection[index];
      _collection[index] = targetIdMap.get(item.target_id) || item;
    }
  }
  const options = await genSendBaseOptions({
    scene: 'http_request',
    collection: _collection,
    databaseConfigs: {},
    projectConfig,
    systemConfig,
    curServerId: option?.server_id,
    targetId: target?.target_id,
    type:target?.target_type
  });
  return options;
}
