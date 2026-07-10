import * as vscode from 'vscode';
import { DEFAULT_TARGET_NAME, globalConfig } from '../constants';
import { ApiDetailsData } from '@/types/apis/api';
import { createShare, getDocBaseUrl, getProjectShareData, setProjectShareData } from '../utils/share';
import { getApiList, getMaxSort, getCurrentProjectConfig, getUserConfig, setApiList, setProjectConfig, showTabName } from '../utils';
import { isArray, isPlainObject, trim } from 'lodash';
import { fillInOpenApi, updateOpenApiData } from '../apis';
import { importMethod } from '@/utils/export';
import { DEFAULT_AUTH } from '@/constants/apis/auth';

const saveApiData = (data: any, context: vscode.ExtensionContext, panel: vscode.WebviewPanel) => {
  let { sidePanelWebView, openedPanels } = globalConfig;
  const apiList: ApiDetailsData[] = getApiList(context);
  // Locally saved data collection
  let newData: ApiDetailsData = data;
  const index = apiList.findIndex(e => e?.target_id === newData?.target_id);
  newData.is_create = -1;
  if (trim(newData?.name).length <= 0) {
    newData.name = DEFAULT_TARGET_NAME?.[newData?.target_type] || 'HTTP Request';
  };
  if (index > -1) {
    // Design page only saves design page related fields
    let newDesignData = apiList[index];
    newDesignData.open_api = newData?.open_api || {};
    newDesignData.name = newData?.name || '';
    newData = newDesignData;
    apiList.splice(index, 1, newDesignData); // Replace element
  } else {
    newData.sort = getMaxSort(apiList, newData.parent_id);
    apiList.push(newData); // Add element
  }
  // Update open after saving
  panel.webview.postMessage({ action: 'setApiData', data: newData });
  // Update tab content and title after replacement
  updateOpenApiData(openedPanels, newData);

  // Update title
  panel.title = showTabName(newData?.name);

  setApiList(apiList, context);
  // Update left directory
  sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setApiList', data: apiList || [] });

  // Check if there is a share record, if so, update the share time
  const shareData = getProjectShareData(context);
  if (shareData?.[newData.target_id]) {
    shareData[newData.target_id].share_time = Date.now();
    setProjectShareData(shareData, context);
    // Refresh share list
    sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setProjectShareData', data: shareData });
  }

  vscode.window.showInformationMessage('Save Successfully！🎉');
}

export const handelDesignMessage = async (message: { action: string, data: any }, panel: vscode.WebviewPanel, targetData: ApiDetailsData, context: vscode.ExtensionContext) => {
  let { sidePanelWebView } = globalConfig;
  switch (message.action) {
    case 'getSystemConfig':
      panel?.webview.postMessage({ action: 'setSystemConfig', data: context.globalState.get('systemConfig') || {} });
      break;
    case 'getVscodeTheme':
      const vscodeTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
      panel.webview.postMessage({ action: 'setVscodeTheme', data: vscodeTheme });
      break;
    case 'openEnv':
      vscode.commands.executeCommand('echoapi.openEnv', message.data);
      break;
    case 'getApiData':
      panel.webview.postMessage({ action: 'setApiData', data: targetData });
      break;
    case 'getProjectConfig':
      panel.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });
      break;
    case 'setProjectConfig':
      const { key, value } = message.data;
      // Locally saved data collection
      let project_config: any = getCurrentProjectConfig(context);
      project_config[key] = value;
      setProjectConfig(context, project_config);
      break;
    case 'getUserConfig':
      panel.webview.postMessage({ action: 'setUserConfig', data: getUserConfig(context) });
      break;
    case 'openNewWindow':
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case 'openTagPanelById':
      const localApiList: any[] = getApiList(context);
      const curData = localApiList.find((i: ApiDetailsData) => i?.target_id === message.data);
      curData.is_create = -1;
      curData.is_changed = -1;
      vscode.commands.executeCommand('openTabPanel', curData);
      break;
    case 'saveAndopenTagPanelById':
      saveApiData(message.data, context, panel);
      const curSaveData = getApiList(context).find((i: ApiDetailsData) => i?.target_id === message.data.target_id);
      curSaveData.is_create = -1;
      curData.is_changed = -1;
      vscode.commands.executeCommand('openTabPanel', curSaveData);
      break;
    case 'getDocBaseUrl':
      panel.webview.postMessage({ action: 'setDocBaseUrl', data: getDocBaseUrl(context) });
      break;
    case 'saveApiData':
      saveApiData(message.data, context, panel);
      break;
    case 'createShare':
      createShare(message.data, context);
      break;
    case 'pullFromDebugById':
      const apiLists: any[] = getApiList(context);
      const targetIndex = apiLists.findIndex(e => e?.target_id === message?.data?.target_id);
      let newApiData: ApiDetailsData;
      if (targetIndex > -1) {
        newApiData = apiLists[targetIndex];
      } else {
        newApiData = message.data.apisData;
      }
      fillInOpenApi(newApiData);
      break;
    case 'pushToDebug':
      if (!isPlainObject(message?.data)) {
        return;
      }
      const apisData = message.data;
      const res = await importMethod.swaggerToApipost({
        info: {
          "title": 'Open Api',
          "description": '',
          "version": "1.0.0"
        },
        openapi: '3.0.0',
        servers: [],
        paths: {
          ...apisData?.open_api || {}
        }
      }, {
        basePath: true,
        host: true
      });
      if (res.status === 'error') {
        vscode.window.showErrorMessage(res.message);
      }
      if (isArray(res?.data?.apis) && res.data.apis.length > 0) {
        let targetItem = res.data.apis[0];

        apisData.url = targetItem?.url || '';
        apisData.method = targetItem?.method || '';
        apisData.description = targetItem?.description || '';
        if (isPlainObject(targetItem.response)) {
          apisData.response = targetItem.response
        }
        apisData.request = {
          ...{
            auth: DEFAULT_AUTH,
            pre_tasks: [],
            post_tasks: [],
            header: {
              parameter: targetItem?.request?.header?.parameter || [],
            },
            query: {
              parameter: targetItem?.request?.query?.parameter || [],
            },
            cookie: {
              parameter: [],
            },
            restful: {
              parameter: targetItem?.request?.restful?.parameter || [],
            },
          },
          body: {
            mode: targetItem?.request?.body?.mode || 'none',
            parameter: targetItem?.request?.body?.parameter || [],
            raw: targetItem?.request?.body?.raw || '',
            raw_parameter: targetItem?.request?.body?.raw_parameter || [],
            raw_schema: targetItem?.request?.body?.raw_schema || { type: 'object' },
            binary: null,
          },
        }

        const apiLists: any[] = getApiList(context);
        const targetIndex = apiLists.findIndex(e => e?.target_id === apisData?.target_id);
        if (targetIndex > -1) {
          apiLists.splice(targetIndex, 1, apisData); // Replace element
        } else {
          apisData.sort = getMaxSort(apiLists, apisData.parent_id);
          apiLists.push(apisData); // Add element
        }

        // Update open after saving
        panel.webview.postMessage({ action: 'setApiData', data: apisData });

        setApiList(apiLists, context);
        // Update left directory
        sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setApiList', data: apiLists || [] });
        vscode.window.showInformationMessage('Push Successfully！🎉');
      }
      break;
  }
};