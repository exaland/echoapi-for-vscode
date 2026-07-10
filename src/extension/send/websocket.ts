global.IS_ECHOAPI = true;

import { Websocket2DetailsData } from '@/types/apis/websocket2';
import { globalConfig, websocketStore } from '../constants';
import { WSClient } from 'websocket-client-pro';
import * as vscode from 'vscode';
import { ProjectConfigType } from '@/types/project';
import { genSendBaseOptions, getApiList, getCurrentProjectConfig } from '../utils';
import { getAboutCollections } from '@/utils/send/utils';
import { SysConfig } from '@/types/settings';

export const wsDisconnect = (target_id: string) => {
  if (websocketStore[target_id]) {
    websocketStore[target_id]?.close(); //Close existing
    websocketStore[target_id] = null;
    delete websocketStore[target_id];
  }
};

export const wsConnect = async (data: { option: any, target: Websocket2DetailsData }) => {
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

    //postMessage
    const emitMessageEvent = function (msg: any) {
      const { openedPanels } = globalConfig;
      if (isClose) {
        return;
      }
      if (msg === undefined) {
        return;
      }

      if (!websocketStore[target?.target_id] && msg?.type !== 'close') {
        return;
      }

      try {
        if (openedPanels?.[target?.target_id]) {
          openedPanels[target?.target_id]?.webview.postMessage({
            action: 'setWsResult', data: {
              message: msg, target_id: target?.target_id, action: 'received'
            }
          });
        }
      } catch (error) {
        // logger.error("emitRuntimeEvent", String(error));
      }
    };

    if (websocketStore[global_target_id]) {
      try {
        websocketStore[global_target_id]?.close(); //Close existing
        await websocketStore[global_target_id]?.wait();
        websocketStore[global_target_id] = null;
        delete websocketStore[global_target_id];
      } catch (error) { }
    }

    client = new WSClient(target, option, emitMessageEvent);

    websocketStore[global_target_id] = client;

    const wsResponse = await client.connect();

    if (openedPanels?.[target?.target_id] && websocketStore[target?.target_id]) {
      openedPanels[target?.target_id]?.webview.postMessage({
        action: 'setWsResult', data: {
          message: wsResponse, target_id: target?.target_id, action: 'connected'
        }
      });
    }

    const end = await client.wait();
  } catch (error: any) {
    if (websocketStore[target?.target_id]) {
      websocketStore[target?.target_id] = null;
      delete websocketStore[target?.target_id];
    }
    if (error?.isSuccess !== undefined) {
      if (openedPanels?.[target?.target_id]) {
        openedPanels[target?.target_id]?.webview.postMessage({
          action: 'setWsResult', data: {
            message: error, target_id: target?.target_id, action: 'error'
          }
        });
      }
      return;
    }
    try {
      if (openedPanels?.[target?.target_id]) {
        openedPanels[target?.target_id]?.webview.postMessage({
          action: 'setWsResult', data: {
            message: "websocket" + String(error), target_id: target?.target_id, action: 'error'
          }
        });
      }
    } catch (e) {
    }
  }
};

export const wsSend = (data: { target_id: string; }) => {
  try {
    const { target_id } = data;
    if (!target_id) {
      return;
    }

    if (!websocketStore[target_id]) {
      return;
    }

    const client = websocketStore[target_id];
    if (!client?.send) {
      return;
    }
    client.send(data);

  } catch (error) {

  }
};

export const getWebsocketOption = async (data: { option: any, target: any }, context: vscode.ExtensionContext) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const apiList = getApiList(context);
  const { option, target } = data;
  const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};

  const envDetailKeys = projectConfig?.envDetailKeys;

  // Parent directory related parameters
  const _collection = await getAboutCollections(
    target,
    apiList,
    systemConfig,
    false,
    option?.server_id,
  );

  const options = await genSendBaseOptions({
    envId: envDetailKeys,
    scene: 'http_request',
    collection: _collection,
    curServerId: option?.server_id,
    projectConfig,
    systemConfig,
    targetId: target?.target_id,
    type:target?.target_type
  });

  return options;

}