import * as vscode from 'vscode';
import { getApiList, getApiListName, getCurrentProjectConfig, setProjectApisVersion } from '../utils';
import { globalConfig } from '../constants';
import { setDataToGlobalStorage } from '../db';

export const handelPushMessage = (message: { action: string, data: any }, context: vscode.ExtensionContext) => {
  const { pushWebView } = globalConfig;

  switch (message.action) {
    case 'getPushPanelData':
      // Get API list information
      const local_api_list = getApiList(context);
      // Get current user information
      let user_config: any = context.globalState.get('userConfig') || {};
      // Get version record of local project APIs
      let project_apis_version: any = context.globalState.get('projectApisVersion') || {};

      pushWebView?.webview.postMessage({
        action: 'setPushPanelData', data: {
          local_api_list,
          user_config,
          project_apis_version
        }
      });
      break;
    case 'openNewWindow':
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case 'pushSuccess':
      pushWebView?.dispose();
      vscode.window.showInformationMessage('Push Successfully！🎉');
      break;
    case 'setApiList':
      let apiListName = getApiListName(context);
      setDataToGlobalStorage(context, apiListName, message.data);
      // Record project API versions for later conflict comparison
      setProjectApisVersion(context, message.data);
      break;
    case 'showSingOutConfirmation':
      vscode.window.showInformationMessage(
        'The login session has expired. Would you like to log in again?',
        { modal: true },
        'Yes',
        'No'
      ).then(res => {
        if (res = 'Yes') {
          vscode.commands.executeCommand('echoapi.userSingOut', { form: 'sidebar', clearApiData: '-1' });
          // Open login page
          vscode.commands.executeCommand('echoapi.login');


        } else {
          // Sign out
          vscode.commands.executeCommand('echoapi.userSingOut', { form: 'sidebar' });
        }
      });
      break;
    case 'getSystemConfig':
      pushWebView?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });
      break;
    case 'getProjectConfig':
      pushWebView?.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });
      break;
    case 'openEnv':
      vscode.commands.executeCommand('echoapi.openEnv', message.data);
      break;
  }

}