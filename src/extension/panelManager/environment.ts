import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getHtmlForWebview, getProjectConfig } from '../utils';
import { handelEnvMessage } from '../messageHandler/environment';
import { ENV_MANAGE_ENUM } from '@/pages/Environment/constants';

export const createEnvironmentPanel = (data:any, context: vscode.ExtensionContext) => {
  let { environmentWebView }= globalConfig;

  const panelOptions = PANEL_OPTIONS.ENVIRONMENT;

  if (environmentWebView) {
    // Tab already exists, switch to it
    environmentWebView.reveal(vscode.ViewColumn.One);
    // Create new environment
    if (data?.create) {
      environmentWebView.webview.postMessage({ action: 'initCreateEnv' });
    }else if(data?.global_param){
      environmentWebView.webview.postMessage({ action: 'setEnvSettingKeys', data: ENV_MANAGE_ENUM.globalParm });
      if(data?.global_param_tab_key){
        environmentWebView.webview.postMessage({ action: 'setProjectConfig', data: {
          globalParamsTabKey:data.global_param_tab_key
        } });
      }
    } else if (!data?.cookie) {
      environmentWebView.webview.postMessage({ action: 'setEnvSettingKeys', data: !data?.env_id ? '1' : data?.env_id });
    } 
    if(data?.cookie){
      environmentWebView.webview.postMessage({ action: 'setEnvSettingKeys', data: ENV_MANAGE_ENUM.cookie });
    }
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
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl,null);

  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelEnvMessage(message, context, data, panel);
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.environmentWebView = null;
    },
    null,
    context.subscriptions
  );
  globalConfig.environmentWebView = panel;
}