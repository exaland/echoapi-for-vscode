import { cloneDeep, forEach, isPlainObject } from 'lodash';
import * as vscode from 'vscode';
import { globalConfig } from '../constants';
import { sendAutoTest, stopWorker } from '../apis';
import { getAllApiChildren, getCurrentProjectConfig, getProjectReportList, getTestingFolderData, getTestingFolderName, setTestingFolderData } from '../utils';
import { ApiDetailsData } from '@/types/apis/api';
import { ADD_CASE_DEFAULT } from '@/constants/testing/default';

export const handelFolderTestMessage = (message: { action: string, data: any }, context: vscode.ExtensionContext, panel: vscode.WebviewPanel, folderData: ApiDetailsData, openHistoryReport: boolean) => {
  const { environmentWebView, sidePanelWebView } = globalConfig;

  switch (message.action) {
    case 'getSystemConfig':
      panel?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });
      break;
    case 'sendEventList':
      sendAutoTest(message.data, context, environmentWebView, (vl: any) => {
        // Send request results back to Webview
        panel.webview.postMessage({ action: 'sendEventList', data: vl });
      });

      break;
    case 'getProjectConfig':
      panel.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });
      break;
    case 'stopSendEventList':
      stopWorker();

      break;
    case 'saveFolderTestData':
      setTestingFolderData(folderData.target_id, message.data, context);

      // Refresh report list
      sidePanelWebView?.webview.postMessage({ action: 'setProjectReportList', data: getProjectReportList(context) });
      break;
    case 'openEnv':
      vscode.commands.executeCommand('echoapi.openEnv', message.data);
      break;
    case 'openNewWindow':
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case 'refreshEventList':
      // Get all API endpoints under the folder and assemble into event list
      const eventList = getAllApiChildren(folderData.target_id, context);
      panel.webview.postMessage({
        action: 'setTestData', data: {
          eventList, // API list under directory (flat)
        }
      });
      break;
    case 'getTestData':
      // Get all API endpoints under the folder and assemble into event list
      panel.webview.postMessage({
        action: 'setTestData', data: {
          showReportList: openHistoryReport,
          testingName: folderData.name,// Test name
          eventList: getAllApiChildren(folderData.target_id, context), // API list under directory (flat)
          config: cloneDeep(ADD_CASE_DEFAULT.settings), // Folder run configuration
          reportList: [], // Report list
          ...getTestingFolderData(folderData.target_id, context) || {}
        }
      });
      break;
  }

};