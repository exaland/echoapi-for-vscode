import * as vscode from 'vscode';
import { globalConfig } from '../constants';
import { downloadFile, getApiList } from '../utils';
import { batchDeleteShare, deleteShare, getDocBaseUrl, getOpenApi, getProjectShareData } from '../utils/share';
import { isArray } from 'lodash';

export const handelPushMessage = async (message: { action: string, data: any }, context: vscode.ExtensionContext) => {
  const { shareListWebView, openedDocPanels } = globalConfig;

  switch (message.action) {
    case 'getSystemConfig':
      shareListWebView?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });
      break;
    case 'openNewWindow':
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case 'getApiList':
      shareListWebView?.webview.postMessage({ action: 'setApiList', data: getApiList(context) });
      break;
    case 'getShareData':
      shareListWebView?.webview.postMessage({ action: 'setShareData', data: getProjectShareData(context) });
      break;
    case 'getDocBaseUrl':
      shareListWebView?.webview.postMessage({ action: 'setDocBaseUrl', data: getDocBaseUrl(context) });
      break;
    case 'deleteShare':
      deleteShare(message.data, context);

      // Close share tab
      if (openedDocPanels?.[message?.data?.target_id]) {
        openedDocPanels[message?.data?.target_id].dispose();
      }

      // Refresh share list
      shareListWebView?.webview.postMessage({ action: 'setShareData', data: getProjectShareData(context) });
      break;
    case 'batchDeleteShare':
      batchDeleteShare(message.data, context);
      // Close share tab
      if (isArray(message.data)) {
        message.data.forEach(id => {
          if (openedDocPanels?.[id]) {
            openedDocPanels[id].dispose();
          }
        });
      }

      // Refresh share list
      shareListWebView?.webview.postMessage({ action: 'setShareData', data: getProjectShareData(context) });
      break;
    case 'exportOpenApiById':
      const apiList: any[] = getApiList(context);
      const openData = apiList.find(i => i?.target_id === message?.data?.target_id);
      if (openData !== undefined) {
        const fileObj = await getOpenApi(openData, context);
        if (fileObj === null) {
          return;
        }
        await downloadFile(fileObj.fileName, fileObj.openApiStr);
      }
      break;

  }

}