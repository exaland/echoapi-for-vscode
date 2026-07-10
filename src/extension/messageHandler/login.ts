import { forEach, isPlainObject } from 'lodash';
import * as vscode from 'vscode';
import { globalConfig } from '../constants';

export const handelLoginMessage = (message: { action: string, data: any }, context: vscode.ExtensionContext, panel:vscode.WebviewPanel)=>{
  const { sidePanelWebView }  = globalConfig;

  let user_config: any = context.globalState.get('userConfig') || {};
  switch (message.action) {
    case 'getSystemConfig':
      globalConfig?.loginWebView?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });
      break;
    case 'openNewWindow':
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case 'saveUserConfig':
      // Local stored data collection
      if (isPlainObject(message.data)) {
        forEach(message.data, (value, key) => {
          user_config[key] = value;
        });
      }
      context.globalState.update('userConfig', user_config);
      // Update user config to sidebar
      sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setUserConfig', data: user_config });
      break;
    case 'userSingOut':
      vscode.commands.executeCommand('echoapi.userSingOut', { form: 'login' });
      break;
    case 'getUserConfig':
      panel.webview.postMessage({ action: 'setUserConfig', data: context.globalState.get('userConfig') || {} });
      break;
    case 'showSingOutConfirmation':
      vscode.window.showInformationMessage(
        `Session expired 
        To protect your data, please choose:
        `,
        { modal: true },
        'Sign In Again',
        'Sign Out - Exit'
      )      .then(res => {
        // Sign out
        vscode.commands.executeCommand('echoapi.userSingOut', { form: 'sidebar' });
        if (res = 'Sign In Again') {
          // Open login page
          vscode.commands.executeCommand('echoapi.login');
        }
      });
      break;
  }

}