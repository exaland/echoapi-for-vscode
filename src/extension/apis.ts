const { Worker } = require('worker_threads');
import path from 'path';
import * as vscode from 'vscode';
import { cloneDeep, find, forEach, includes, isEmpty, isEqual, isNil, isPlainObject, isString, map, omit } from 'lodash';
import { copyTextToClipboard, genSendBaseOptions, getApiList, getCurrentProjectConfig, handleResponseVariables, handleSendResponse, prepareRequest, showTabName } from './utils';
import { DEFAULT_REQUEST_SYSTEM_HEADERS } from '../constants/apis/request';
import { ApiSendResponse } from '@/types/apis/send';
import Har2languages from 'har2languages';
import { ProjectConfigType } from '@/types/project';
import { SysConfig } from '@/types/settings';
import { ApiDetailsData } from '@/types/apis/api';
import Mock from 'mockjs';
import { snowflakeId } from 'apipost-tools';
import { EventData, } from '@/types/testing';
import { RunnerTestingProps } from '@/types/testing/common';
import { DEFAULT_ADD_CASE_NAME } from '@/constants/testing';
import { STATUS_CODE } from '@/constants/common';
import { EnvListItem } from '@/types/envManage';
import { createTargetIdMap, getAboutCollections } from '@/utils/send/utils';

let worker: any = null;
const getSendData = async (requestData: any, projectConfig: ProjectConfigType, systemConfig: SysConfig, context: vscode.ExtensionContext, option?: { server_id: string }) => {
  try {
    const tempRequest: any = cloneDeep(omit(requestData, ['response']));

    const curEnv = find(projectConfig?.envList || [], (env) => isEqual(env.env_id, projectConfig?.envDetailKeys));

    // Request data preprocessing
    tempRequest.request = prepareRequest(tempRequest.request, systemConfig?.systemRequestHeader || DEFAULT_REQUEST_SYSTEM_HEADERS);

    const apiList = getApiList(context);

    // Parent directory related parameters
    const _collection = await getAboutCollections(
      tempRequest,
      apiList,
      systemConfig,
      true,
      option?.server_id,
    );

    // Create target_id mapping and delete extra fields
    const targetIdMap = createTargetIdMap(_collection, curEnv?.server_list);

    if (_collection) {
      for (let index = 0; index < _collection.length; index++) {
        const item = _collection[index];
        _collection[index] = targetIdMap.get(item.target_id) || item;
      }
    }

    const options = await genSendBaseOptions({
      scene: 'http_request',
      collection: _collection,
      databaseConfigs: {},
      projectConfig,
      systemConfig,
      curServerId: option?.server_id,
      targetId: requestData?.target_id,
    });

    const params = {
      option: options,
      test_events: [
        {
          type: 'api',
          data: tempRequest,
        },
      ],
    };
    return { params, tempRequest };
  } catch (err: any) {
    throw new Error(err?.message || err?.msg || String(err));
  }
};

export const generateTestingRunnerParams = async ({
  testingData,
  projectConfig,
  systemConfig,
  originCollection
}: RunnerTestingProps) => {

  const currentTesting = {
    name: 'test folder',
    testing_id: ''
  };

  const eventList = testingData?.event_list || [];
  const settings = testingData?.settings;
  
  const { env_id, enable_sandbox, ignore_error, iteration_data, execute_count, interval_time } =
    settings || {}; // Current test case settings

  try {
    const name = currentTesting.name || DEFAULT_ADD_CASE_NAME;
    const executeCount = execute_count;
    const intervalTime = interval_time;

    const testEvents: any = [];
    const collection: any = [];

    forEach(eventList, (item) => {
      // Request data preprocessing
      item.data.request = prepareRequest(item.data.request, systemConfig?.systemRequestHeader || DEFAULT_REQUEST_SYSTEM_HEADERS);

      collection.push(item.data);
      testEvents.push({
        ...item, data: {
          target_id: item.data.target_id,
          parent_id: item.data.parent_id
        }
      });
    });

    const options = await genSendBaseOptions({
      envId: env_id,
      scene: 'auto_test',
      collection: originCollection,
      databaseConfigs: {},
      projectConfig,
      systemConfig,
    });

    options.name = name;
    options.ignore_error = ignore_error;
    options.enable_sandbox = enable_sandbox;
    options.iterationCount = executeCount;
    options.sleep = intervalTime;
    options.testing_id = currentTesting.testing_id;
    options.iterationData = iteration_data || [];

    return {
      option: options,
      test_events: testEvents,
    };
  } catch (error: any) {
    throw new Error(error?.message || error?.msg || String(error));
  }
};

function runWorker(method: string, args: any[], callback?: any) {
  return new Promise((resolve, reject) => {
    try {
      if (worker !== null) {
        worker.terminate();
      }
      worker = new Worker(path.join(__dirname, 'runtime-dist', 'work.js'));

      worker.on('message', (message: unknown) => {
        if (callback) {
          callback(message);
          return;
        }
        resolve(message);
      });

      worker.on('error', (error: any) => {
        reject(error);
      });

      worker.on('exit', (code: any) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      // Send method name and parameters to worker thread
      worker.postMessage({ method, args });
    } catch (error: any) {
      vscode.window.showInformationMessage(`error!!!${error.message}`);
    }
  });
}

export const stopWorker = () => {
  try {
    if (worker) {
      // When termination is needed
      worker.terminate();
      worker = null;
    }
  } catch (error) { }
}


export const sendApi = async (apiData: any, context: vscode.ExtensionContext, environmentWebView: vscode.WebviewPanel | null, option?: { server_id: string }) => {
  try {
    const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
    const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};
    const { params } = await getSendData(apiData, projectConfig, systemConfig, context, option);
    const result = await runWorker('httpSend', [params.option, params.test_events]) as string;
    return await handleSendResponse(context, JSON.parse(result) as ApiSendResponse, environmentWebView, false, -1);
  } catch (error: any) {
    vscode.window.showInformationMessage(error.message);
  }
};

export const sendSse = async (apiData: any, context: vscode.ExtensionContext, environmentWebView: vscode.WebviewPanel | null, callback: any, option?: { server_id: string }) => {
  try {
    const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
    const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};
    const { params } = await getSendData(apiData, projectConfig, systemConfig, context, option);
    await runWorker('runnerEvent', [params.option, params.test_events], async (result: any) => {
      if (!isPlainObject(result)) {
        result = JSON.parse(result);
      }

      if (result.action === 'sse') {
        callback({ streamResponse: [{ ...result, action: 'message', id: snowflakeId() }] });
      }
      if (result.action === 'request') {
        const responseResult = await handleSendResponse(context, result.data as ApiSendResponse, environmentWebView, false, -1)
        callback({
          ...responseResult,
          streamResponse: [
            {
              action: 'complete',
              data: apiData.url,
              error: null,
              msg: 'success',
              id: snowflakeId(),
            },
          ],
        })
      }

    });
  } catch (error: any) {
  }
}

/**
 * targetIds include sample_id and target_id
 *
 */
export const getRuntimeCollections = (eventData: EventData,context: vscode.ExtensionContext,systemConfig:SysConfig) => {
  const apiList = getApiList(context);
  const tempObj: { [key: string]: any } = {};
  for (const item of apiList) {
    tempObj[item.target_id] = item;
  }
  let collections:any[] = [];
  let collectionIds:string[] = [];

  const eventList = eventData?.event_list || [];

  const findParentTargetIds = (data: ApiDetailsData) => {
    if (!includes(collectionIds, data.target_id)) {
      collectionIds.push(data.target_id);
      collections.push(omit(data,['response']));
      const parent_id = tempObj[data.target_id]?.parent_id;

      // Ensure parent_id exists and is not '0'
      if (parent_id && parent_id !== '0' && tempObj?.[parent_id]) {
        findParentTargetIds(tempObj[parent_id]);
      }
    }
  };

  forEach(eventList, (item) => {
    // Request data preprocessing
    item.data.request = prepareRequest(item.data.request, systemConfig?.systemRequestHeader || DEFAULT_REQUEST_SYSTEM_HEADERS);
    
    findParentTargetIds(item.data);
  });

  return collections;
};

export const sendAutoTest = async (eventData: EventData, context: vscode.ExtensionContext, environmentWebView: vscode.WebviewPanel | null, callback: any) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};

 // Parent directory related parameters
  const originCollection = getRuntimeCollections(eventData,context,systemConfig);

  // Get pre-request parameters
  const runnerTestingParams = await generateTestingRunnerParams({
    testingData: eventData,
    projectConfig,
    systemConfig,
    originCollection
  });
  await runWorker('runnerEvent', [runnerTestingParams.option, runnerTestingParams.test_events], async (result: any) => {
    if (!isPlainObject(result)) {
      result = JSON.parse(result);
    }

    if (result.action === 'request') {
      callback(result);
    }
    if (result.action === 'complete') {
      // Not in sandbox mode, if there are global variables or environment variables, update
      if (eventData.settings.enable_sandbox !== STATUS_CODE.ENABLE) {
        if (!isNil(result.data.variables)) {
          // Handle environment variables and global variables
          await handleResponseVariables(result.data.variables, context, environmentWebView, eventData?.settings?.env_id);
        }
      }
      callback(result);
    }
  });

}

export const getCodeHarRequest = async (apiData: ApiDetailsData, context: vscode.ExtensionContext, option?: { server_id: string }) => {
  try {
    const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
    const systemConfig = context.globalState.get('systemConfig') as SysConfig || {};
    const { params } = await getSendData(apiData, projectConfig, systemConfig, context, option);
    const result = await runWorker('httpHar', [params.option, params.test_events]) as string;
    return result;
  } catch (error: any) {
  }
}

export const updateOpenData = (openedPanels: { [key: string]: vscode.WebviewPanel }, apiData: ApiDetailsData) => {
  const panel = openedPanels?.[apiData?.target_id];
  if (['api','folder'].includes(apiData?.target_type) && panel) {
    // Update title
    panel.title = showTabName(apiData?.name);
    // Update content
    panel.webview.postMessage({ action: 'setApiData', data: apiData });
  }
};

export const updateOpenApiData = (openedPanels: { [key: string]: vscode.WebviewPanel }, apiData: ApiDetailsData) => {
  const panel = openedPanels?.[apiData?.target_id];
  if (apiData?.target_type === 'api' && panel) {
    // Update title
    panel.title = showTabName(apiData?.name);
    // Update content
    panel.webview.postMessage({ action: 'setDesignApiData', data: apiData });
  }
};

export const updateOpenProjectConfig = (openedPanels: { [key: string]: vscode.WebviewPanel }, projectConfig: ProjectConfigType) => {
  forEach(openedPanels, (openedPanel) => {
    openedPanel.webview.postMessage({ action: 'setProjectConfig', data: projectConfig });
  });
};

export const varReplace = (_val: string, context: vscode.ExtensionContext, option?: any) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const globalVars = projectConfig.globalVars;
  const envList = projectConfig.envList;
  const envDetailKeys = projectConfig.envDetailKeys;


  const { mock } = option || { mock: true };
  const currentEnv: EnvListItem =
    find(envList, (item) => item.env_id === envDetailKeys) || ({} as EnvListItem);
  if (typeof _val !== 'string') {
    return _val;
  }

  // mock
  if (_val === null) {
    return '';
  }

  if (typeof _val === 'string' && mock) {
    const _matches = _val.match(/{{\$([a-zA-Z0-9_]+).*?}}/gi);
    // Replace mock syntax in variables.
    if (_matches instanceof Array) {
      for (const _match of _matches) {
        let mock_rule = _match.replace(/{{\$([a-zA-Z0-9_]+).*?}}/gi, '@$1');

        // for 5.3.2
        try {
          mock_rule = Mock.mock(mock_rule);
        } catch (e) {
          //
        }
        _val = _val.replace(_match, mock_rule);
      }
    }
  }

  if (_val.toString().indexOf('{{') === -1) {
    return _val;
  }

  if (currentEnv && !isEmpty(currentEnv)) {
    for (const _x in currentEnv.env_var_list) {
      if (_x !== '') {
        let _reg: any = false;

        try {
          _reg = new RegExp(`[{][{]${_x}[}][}]`, 'g');
        } catch (e) {
        }
        if (
          _reg &&
          typeof currentEnv.env_var_list[_x].current_value !== 'undefined' &&
          typeof _val === 'string'
        ) {
          _val = _val.replace(_reg, currentEnv.env_var_list[_x].current_value);
        }
      }
    }
  }

  // Check global variables
  if (globalVars && !isEmpty(globalVars)) {
    for (const _x in globalVars) {
      if (_x !== '') {
        let _reg: any = false;

        try {
          _reg = new RegExp(`[{][{]${_x}[}][}]`, 'g');
        } catch (e) {
        }

        if (_reg && typeof globalVars[_x] !== 'undefined' && typeof _val === 'string') {
          _val = _val.replace(_reg, globalVars[_x]);
        }
      }
    }
  }

  return _val;
};

export const copyAsCurl = async (apiData: ApiDetailsData, context: vscode.ExtensionContext) => {
  try {
    const codeHar: any = await getCodeHarRequest(apiData, context);
    if (isString(codeHar)) {
      vscode.window.showErrorMessage(`${codeHar}`);
      return;
    }
    const request = cloneDeep(codeHar)?.log?.entries?.[0]?.request;
    request.url = request?.url?.split('#')[0];
    request.headers = map(request?.headers, (it) => {
      if (!isString(it.value)) {
        return { ...it, value: String(it.value) };
      }
      return it;
    });
    const har2languages = new Har2languages();
    const languagesRes: any = har2languages.convert(request, 'shell', 'curl');

    if (languagesRes?.status === 'error') {
      vscode.window.showInformationMessage(`${languagesRes?.message}`);
      return;
    }
    try {
      languagesRes.data = decodeURIComponent(languagesRes?.data);
      languagesRes.data = varReplace(languagesRes.data, context);
      copyTextToClipboard(languagesRes.data || '');
    } catch (error) { }
  } catch (error) { }
};

export const fillInOpenApi = async (apiData: ApiDetailsData, context?: vscode.ExtensionContext) => {
  if (!isPlainObject(apiData?.open_api)) {
    apiData.open_api = {
      [apiData?.url || '/']: {
        [apiData.method.toLocaleLowerCase()]: {
          "summary": apiData?.name || "",
          "description": "",
          "tags": [],
          "parameters": [],
          "requestBody": {
            "content": {}
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {}
                  },
                  "example": ""
                }
              }
            },
            "404": {
              "description": "Failure",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {}
                  },
                  "example": ""
                }
              }
            }
          }
        }
      }
    };
  }
  return apiData;
}