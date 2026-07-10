import { globalConfig } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getHtmlForWebview } from '../utils';
import { handelCurlMessage } from '../messageHandler/curl';

export const createCurlPanel= (data:any, context: vscode.ExtensionContext) => {
  let { curlWebView }= globalConfig;

  if (curlWebView) {
    // Tab already exists, switch to it
    curlWebView.reveal(vscode.ViewColumn.One);
    return;
  }
  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    'curlPanel',
    'cURL',
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
    path.join(context.extensionPath, 'dist', 'images', 'curl.png')
  );

  panel.iconPath = iconPath;
  const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist', 'curlPanel.js')));
  const resourceBaseUrl = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist')));

  // And set its HTML content
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl,null);

  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelCurlMessage(message, context);
  });

    // Listen for Webview view visibility changes
    panel.onDidChangeViewState(() => {
      if (panel.visible) {
      }
    });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      globalConfig.curlWebView = null;
      // When the panel is closed, cancel any future updates to the webview content
    },
    null,
    context.subscriptions
  );
  globalConfig.curlWebView = panel;
}