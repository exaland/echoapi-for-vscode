import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getApiList, getHtmlForWebview } from '../utils';
import { handelPushMessage } from '../messageHandler/shareList';
import { getProjectShareData } from '../utils/share';

export const createShareListPanel = (data:any, context: vscode.ExtensionContext) => {
  let { shareListWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.SHARELIST;

  if (shareListWebView) {
    // Tab already exists, switch to it
    shareListWebView.reveal(vscode.ViewColumn.One);
    return;
  }
  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    panelOptions.viewType,
    panelOptions.title,
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
    handelPushMessage(message, context);
  });

   // Listen for Webview view visibility changes
   panel.onDidChangeViewState(() => {
    if (panel.visible) {
      // Pass latest data to view after display
      panel?.webview.postMessage({ action: 'setApiList', data: getApiList(context) });
      panel?.webview.postMessage({ action: 'setShareData', data: getProjectShareData(context) });
    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.shareListWebView = null;
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  globalConfig.shareListWebView = panel;
}