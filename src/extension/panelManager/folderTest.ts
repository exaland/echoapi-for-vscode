import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getAllApiChildren, getHtmlForWebview, getCurrentProjectConfig, getTestingFolderData, getTestingFolderName, showTabName } from '../utils';
import { handelFolderTestMessage } from '../messageHandler/folderTest';
import { ApiDetailsData } from '@/types/apis/api';
import { ADD_CASE_DEFAULT } from '@/constants/testing/default';
import { cloneDeep } from 'lodash';

export const createFolderTestPanel = (data: ApiDetailsData, context: vscode.ExtensionContext, option?:any) => {
  let { openedFolderTestPanels } = globalConfig;

  const folderName = getTestingFolderName(data.target_id, context);

  const panelOptions = PANEL_OPTIONS.FOLDER_TEST;

  // Whether to open report page
  const openHistoryReport = option?.openHistoryReport || false;

  if (openedFolderTestPanels[folderName]) {
     // Get all API endpoints under directory and assemble into event list
    const eventList = getAllApiChildren(data.target_id, context);
    // Tab already exists, switch to it
    openedFolderTestPanels[folderName].reveal(vscode.ViewColumn.One);

    // Return to initial state
    openedFolderTestPanels[folderName].webview.postMessage({ action: 'setTestData', data: {
      isInit:true,
      showReportList:openHistoryReport,
      testingName:data.name,// Test name
      eventList, // API list under directory (flat)
      config:cloneDeep(ADD_CASE_DEFAULT.settings), // Folder run configuration
      reportList:[], // Report list
      ...getTestingFolderData(data.target_id, context) || {}
    } });

    return;
  }

  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    panelOptions.viewType,
    showTabName(data?.name || panelOptions.title),
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      // Enable popup window permission
      enableFindWidget: true,
      enableCommandUris: true,
    },
  );
  // Get icon path
  const iconPath = vscode.Uri.file(
    path.join(context.extensionPath, 'dist', 'images', panelOptions.iconName)
  );

  panel.iconPath = iconPath;
  let scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist', `${panelOptions.viewType}.js`)));
  if(process?.env?.NODE_ENV ==="development"){
    scriptUri = `http://localhost:${LOCAL_PORT}/${panelOptions.viewType}.bundle.js`;
  }
  const resourceBaseUrl = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist')));

  // And set its HTML content
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl,null);
  
  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelFolderTestMessage(message, context, panel, data, openHistoryReport);
  });

    // Listen for Webview view visibility changes
    panel.onDidChangeViewState(() => {
      if (panel.visible) {
        // Pass environment info to page after display
        panel.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });
      }
    });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      delete openedFolderTestPanels[folderName];
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  // Store tab in list
  openedFolderTestPanels[folderName] = panel;
}