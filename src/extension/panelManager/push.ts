import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getApiList, getHtmlForWebview } from '../utils';
import { handelPushMessage } from '../messageHandler/push';

export const createPushPanel = (data:any, context: vscode.ExtensionContext) => {
  let { pushWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.PUSH;

  if (pushWebView) {
    // Tab already exists, switch to it
    pushWebView.reveal(vscode.ViewColumn.One);
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
       // Get latest API list information
       const local_api_list = getApiList(context);
       // Get current user information
       let user_config: any = context.globalState.get('userConfig') || {};
       // Get version record of local project APIs
       let project_apis_version: any = context.globalState.get('projectApisVersion') || {};
 
       panel?.webview.postMessage({
         action: 'setPushPanelData', data: {
           local_api_list,
           user_config,
           project_apis_version
         }
       });
    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.pushWebView = null;
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  globalConfig.pushWebView = panel;
}