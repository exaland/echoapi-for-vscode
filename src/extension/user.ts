import { DEFAULT_PROJECT } from "@/constants/project";
import { DEFAULT_TEAM } from "@/constants/team";
import { forEach } from "lodash";
import * as vscode from 'vscode';
import { globalConfig } from './constants';
import { getDataFromGlobalStorage } from "./db";


export const userSingOut = (data:any, context: vscode.ExtensionContext) => {
  const { openedPanels, pushWebView, environmentWebView, sidePanelWebView, loginWebView, openedFolderTestPanels } = globalConfig;

  let user_config: any = context.globalState.get('userConfig') || {};
  // Clear local token storage
  user_config.token = '';

  user_config.teamProjectList = [];
  user_config.currentTeam = DEFAULT_TEAM;
  user_config.currentProject = DEFAULT_PROJECT;

  context.globalState.update('userConfig', user_config);

  if (data?.clearApiData !== '-1') {
    // Clear open tabs
    forEach(openedPanels, (openedPanel) => {
      openedPanel.dispose();
    });
    // Clear open automated test tabs
    forEach(openedFolderTestPanels, (openedPanel) => {
      openedPanel.dispose();
    });
  }


  // Close push page
  pushWebView && pushWebView.dispose();

  // Close environment page
  environmentWebView && environmentWebView.dispose();

  // Get local project API data and update sidebar
  sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setApiList', data: getDataFromGlobalStorage(context,'apiList',[]) });

  // Update user config to sidebar
  sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setUserConfig', data: user_config });

  if (data?.form !== 'login') {
    // Update user config to login page
    loginWebView && loginWebView.webview.postMessage({ action: 'setUserConfig', data: user_config });
  }
}