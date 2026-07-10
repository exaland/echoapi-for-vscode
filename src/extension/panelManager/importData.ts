import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getApiList, getHtmlForWebview } from '../utils';
import { handelImportDataMessage } from '../messageHandler/importData';
import { isString } from 'lodash';

export const createImportDataPanel = (data: any, context: vscode.ExtensionContext) => {
  let { importDataWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.IMPORTDATA;

  if (importDataWebView) {
    let systemConfig: any = context.globalState.get('systemConfig') || {}
    if (isString(data?.type)) {
      systemConfig['import_data_init_type'] = data.type;
    }
    importDataWebView?.webview.postMessage({ action: 'setSystemConfig', data: systemConfig });

    // Tab already exists, switch to it
    importDataWebView.reveal(vscode.ViewColumn.One);
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
    handelImportDataMessage(message, context, data);
  });

  // Listen for Webview view visibility changes
  panel.onDidChangeViewState(() => {
    if (panel.visible) {
        // Get latest API list
        panel.webview.postMessage({ action: 'setApiList', data: getApiList(context) || [] });
    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.importDataWebView = null;
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  globalConfig.importDataWebView = panel;
}