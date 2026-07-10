import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getHtmlForWebview } from '../utils';
import { handelLoginMessage } from '../messageHandler/login';

export const createLoginPanel = (data: any, context: vscode.ExtensionContext) => {
  let { loginWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.LOGIN;

  if (loginWebView) {
    // Tab already exists, switch to it
    loginWebView.reveal(vscode.ViewColumn.One);
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
    handelLoginMessage(message, context, panel);
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.loginWebView = null;
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  globalConfig.loginWebView = panel;
}