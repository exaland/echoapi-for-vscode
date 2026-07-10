import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getHtmlForWebview, getProjectConfig, showTabName } from '../utils';
import { TestingReportList } from '@/types/testing/res';
import { handelFolderTestReportDataMessage } from '../messageHandler/folderTestReport';

export const createfolderTestReportDataPanel = (data: TestingReportList, context: vscode.ExtensionContext) => {
  let { openedFolderTestReportDataPanels, sidePanelWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.FOLDER_TEST_REPORT;

  if (openedFolderTestReportDataPanels[data?.report_id]) {
    // Tab already exists, switch to it
    openedFolderTestReportDataPanels[data?.report_id].reveal(vscode.ViewColumn.One);
    return;
  }

  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    panelOptions.viewType,
    showTabName(data?.report_name || panelOptions.title),
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
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl, null);

  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelFolderTestReportDataMessage(message, context, data, panel);
  });

  // Listen for Webview view visibility changes
  panel.onDidChangeViewState(() => {
    if (panel.visible) {
      // Pass selected API id to sidebar after display
      sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setTestsActiveKey', data: data?.report_id });
    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      delete openedFolderTestReportDataPanels[data?.report_id];
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  // Store tab in list
  openedFolderTestReportDataPanels[data?.report_id] = panel;
}