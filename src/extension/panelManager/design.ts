import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getApiList, getHtmlForWebview, getCurrentProjectConfig, getUserConfig, showTabName } from '../utils';
import { handelDesignMessage } from '../messageHandler/design';
import { ApiDetailsData } from '@/types/apis/api';

export const createDesignPanel= (data:ApiDetailsData, context: vscode.ExtensionContext) => {
  let { openedDocPanels, sidePanelWebView }= globalConfig;

  const panelOptions = PANEL_OPTIONS.DESIGN;

  if(data === undefined){
    vscode.window.showErrorMessage('Interface data not found');
    return;
  }

  if (openedDocPanels?.[data.target_id]) {
    // Tab already exists, switch to it
    openedDocPanels[data.target_id].reveal(vscode.ViewColumn.One);
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
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl,null,false,true);

  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelDesignMessage(message, panel, data, context);
  });

  // Listen for Webview view visibility changes
  panel.onDidChangeViewState(() => {
    if (panel.visible) {
      // Pass selected API id to sidebar after display
      sidePanelWebView?.webview.postMessage({ action: 'setDocsActiveKey', data: data?.target_id });
      // Get color theme, global config, project info, user info
      const vscodeTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
      panel.webview.postMessage({ action: 'setVscodeTheme', data: vscodeTheme });

      panel?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });

      panel.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });

      panel.webview.postMessage({ action: 'setUserConfig', data: getUserConfig(context) });
    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      delete openedDocPanels[data?.target_id];
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  openedDocPanels[data?.target_id] = panel;
}