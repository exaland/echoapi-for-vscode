import { ApiDetailsData } from "@/types/apis/api";
import { assign, cloneDeep, concat, find, findIndex, forEach, groupBy, head, isArray, isEmpty, isEqual, isNull, isNumber, isObject, isPlainObject, isString, isUndefined, keys, map, omit, pullAt, reduce, size, trim, values } from "lodash";
import { GenSendBaseOptionsType, SendBaseOptions } from "./type";
import { DEFAULT_FOLDER_REQUEST } from "../constants/apis/request";
import { ApiSendResponseDataVariables, ApiSendingData, ApiSendResponse, ApiSendResponseDataRequest, ApiSendResponseDataResponse } from '@/types/apis/send';
import aTools from 'apipost-inside-tools';
import { STATUS_CODE } from "../constants/common";
import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import curlToPostman from 'curl-to-postmanv2';
import dayjs from "dayjs";
import { formatTime } from "../utils/time";
import parseUrl from 'url-parse';
import { parseStreamToRaw } from "@/utils/parse";
import { APIS_TARGET_TYPE_ENUM } from "@/constants/apis";
import { DEFAULT_APIS_BASE_DATA } from "@/constants/apis/default";
import { DEFAULT_API_RESPONSE } from "@/constants/apis/response";
import { genUrlByQuery, getHistoryOpensData, getParameterDataFilterContentLength } from "@/utils/apis";
import { getCookiesOptions, getEnvOptions, getProjectOptions } from "./send";
import { EnvListItem } from "@/types/envManage";
import { snowflakeId } from "apipost-tools";
import { existFileSync, getDataFromGlobalStorage, setDataToGlobalStorage } from './db';
import { DEFAULT_PROJECT, DEFAULT_PROJECT_CONFIG } from "@/constants/project";
import { EventItem } from "@/types/testing";
import { CASE_ITEM_TYPE } from "@/constants/testing";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { DEFAULT_TEAM } from "@/constants/team";
import { globalConfig } from "./constants";
import { Project, TeamItem } from "@/types/user";
import i18next from "i18next";

const handleResponseConsole = (console: any) => {
  const _console = cloneDeep(console);

  const time = formatTime(dayjs(), 'HH:mm:ss');

  return map(_console, (item) => ({
    ...item,
    time: item?.time || time,
  }));
};

// Request parameter preprocessing
export const prepareRequest = (tempRequest: ApiDetailsData['request'], runTimeHeaders?: any[]) => {
  const resultRequest = cloneDeep(tempRequest);
  // Complete HTTP protocol prefix
  if (isArray(tempRequest?.header?.parameter) && isArray(runTimeHeaders)) {
    resultRequest.header = {
      parameter: runTimeHeaders.concat(tempRequest?.header?.parameter),
    };
  }

  return resultRequest;
};

/**
 * Generate base parameters for sending requests
 * @param scene Scene type
 * @param envId Environment ID
 * @param targetId API ID
 * @param collection Data collection
 * @param databaseConfigs Database configuration
 * @returns SendBaseOptions
 */
export const genSendBaseOptions: GenSendBaseOptionsType = async ({
  envId,
  scene,
  collection,
  databaseConfigs,
  projectConfig,
  systemConfig,
  curServerId,
  targetId,
  type
}) => {
  const { envDetailKeys, envList, globalParams, globalVars, serverList, cookie } = projectConfig || {};
  const curEnv = find(envList, (env) => isEqual(env.env_id, envId || envDetailKeys));

  const options: SendBaseOptions = {};

  // Send type
  options.scene = scene;

  // Global parameters
  options.globals = reduce(
    keys(globalVars),
    (prev: any, curr) => {
      prev[curr] = globalVars[curr]?.current_value || globalVars[curr]?.value;

      return prev;
    },
    {}
  );

  // Get project related information
  options.project = globalParams ? getProjectOptions(globalParams, systemConfig, type) : {
    request: cloneDeep(DEFAULT_FOLDER_REQUEST)
  };

  // Get environment related parameters
  options.env = getEnvOptions(curEnv, serverList, curServerId, targetId || '', collection);

  // Global Cookie
  options.cookies = getCookiesOptions(cookie, systemConfig);

  // System configuration
  options.system_configs = {
    // Timeout
    send_timeout: 0,
    // Auto redirect
    auto_redirect: 1,
    // Max redirect count
    max_redirect_time: 5,
    // Auto detect mock
    auto_gen_mock_url: 1,
    // Auto JSON format
    request_param_auto_json: -1,
    // Proxy parameter handling
    proxy: {
      // Use system proxy: -1 (enabled), 2 (disabled), 1 (custom proxy)
      type: 2,
      // Prioritize HTTP PROXY, HTTPS PROXY, NO PROXY system env vars. Yes: 1 / No: -1
      envfirst: -1,
      // Proxy Bypass, pass as array with newlines
      bypass: [],
      // Protocol types
      protocols: [],
      auth: {
        // Whether to enable authentication
        authenticate: -1,
        // Proxy server host
        host: '',
        // Authentication username
        username: '',
        // Authentication password
        password: '',
      },
    },
    // CA certificate parameter handling
    ca_cert: {
      base64: '',
      open: -1,
      path: '',
    },
    // Client certificate parameter handling
    client_cert: {},
  };

  // Parent directory related parameters
  if (collection) {
    options.collection = collection;
  }

  // Database connection configuration
  if (databaseConfigs) {
    options.database_configs = databaseConfigs;
  }

  return options;
};

export const handleSendResponse = async (
  context: vscode.ExtensionContext,
  sendResponse: ApiSendResponse,
  environmentWebView: vscode.WebviewPanel | null,
  isDownload?: boolean,
  /** Whether sandbox mode */
  isSandBox?: STATUS_CODE,

) => {
  const { target_id, error } = sendResponse;

  const { assertions, console, request, response, visualizer, variables } =
    sendResponse?.data || {};

  // Script error handling
  const defaultSendingData: Partial<ApiSendingData> = {
    timestamp: new Date().valueOf(),
    asserts: [],
    visualizerHtml: null,
    requestHeaders: {},
    responseHeaders: {},
    cookies: [],
    target_id,
    message: '',
    responseError: error,
  };

  let _sendingData: Partial<ApiSendingData> = {
    ...defaultSendingData,
  };

  let sendError = false;

  // error.error_type equals 'test' means post-execution script error, no interception needed as response already exists
  if ((!isNull(error) && !isEqual(error.error_type, 'test')) || !response || !request) {
    _sendingData = assign({}, _sendingData, {
      sendStatus: 'sendError',
      message: error?.message || i18next.t('supplement.req_err'),
      response: null,
    });

    sendError = true;
  }

  // console
  _sendingData.consoleList = handleResponseConsole(console || []);
  // Assertions
  _sendingData.asserts = isArray(assertions) ? assertions : [];
  // Visualizer
  _sendingData.visualizerHtml =
    !!visualizer?.processed_template && isString(visualizer?.processed_template)
      ? visualizer.processed_template
      : null;

  // Non-sandbox mode
  if (!isEqual(isSandBox, STATUS_CODE.ENABLE)) {
    // Handle environment variables and global variables
    await handleResponseVariables(variables, context, environmentWebView);
    // Handle response cookies
    await handleResponseCookies(request, response?.arr_cookies, context, environmentWebView);
  }

  const result = (await convertSendingData(sendResponse, isDownload, sendError)) || {};

  _sendingData = assign({}, _sendingData, result);

  return _sendingData;
};

const convertSendingData = async (
  sendResponse: ApiSendResponse,
  _isDownload?: boolean,
  sendError?: boolean
) => {
  if (isEmpty(sendResponse)) return;

  let _result: Partial<ApiSendingData> = {};

  const { target_id } = sendResponse;
  const { request, response } = sendResponse?.data || {};

  if (!request) return;

  const { stream, mime_type, arr_cookies } = response || {};

  if (!sendError) {
    (response as ApiSendResponseDataResponse).raw_body = parseStreamToRaw(
      stream?.data,
      mime_type,
      'utf8'
    );
  }

  _result = {
    target_id,
    sendStatus: 'initial',
    requestHeaders: isPlainObject(request?.headers) ? request.headers : {},
    responseHeaders: isPlainObject(response?.headers) ? response?.headers : {},
    cookies: isArray(arr_cookies) ? arr_cookies : [],
    response: sendError ? undefined : omit(response, ['headers', 'arr_cookies']),
    request,
    timestamp: new Date().valueOf(),
  };

  if (sendError) {
    _result.sendStatus = 'sendError';
  }

  return _result;
};


// Handle variable related information
export const handleResponseVariables = async (
  variables: ApiSendResponseDataVariables | undefined,
  context: vscode.ExtensionContext,
  environmentWebView: vscode.WebviewPanel | null,
  env_id?: string
) => {
  // Local stored data collection
  let default_project_config: any = getCurrentProjectConfig(context) || {};

  const { envList, envDetailKeys, globalVars } = default_project_config;

  const current_env_id = env_id || envDetailKeys;

  if (!isPlainObject(variables)) {
    return;
  }

  const currentEnvIndex = findIndex(envList, (item: any) => item?.env_id === current_env_id);

  if (isPlainObject(variables?.environment) && currentEnvIndex !== -1) {
    // Handle environment variables
    const envInfo = await transformEnvVars(envList[currentEnvIndex], variables?.environment);
    envList[currentEnvIndex] = { ...envList[currentEnvIndex], ...envInfo };

    default_project_config.envList = envList;
  }

  // Handle global variables
  if (isPlainObject(variables?.globals)) {
    const _globalVars = transformGlobalVars(globalVars, variables?.globals);
    default_project_config.globalVars = _globalVars;
  }
  setProjectConfig(context, default_project_config);
  // Update global page open content
  environmentWebView && environmentWebView.webview.postMessage({ action: 'setProjectConfig', data: default_project_config });
};

export const handleResponseCookies = async (
  request: ApiSendResponseDataRequest,
  cookies: ApiSendResponseDataResponse['arr_cookies'],
  context: vscode.ExtensionContext,
  environmentWebView: vscode.WebviewPanel | null,
) => {

  // Local stored data collection
  let default_project_config: any = getCurrentProjectConfig(context);

  const { cookie } = default_project_config;

  const _domainInfo = cookie || {};

  if (size(cookies) <= 0 || isUndefined(cookies)) return;

  const cookieObj: any = {};
  const localList = reduce(
    values(_domainInfo?.cookieObj),
    (prev: any, curr) => concat(prev, curr),
    []
  );

  for (let index = 0; index < cookies.length; index++) {
    const item = cloneDeep(cookies[index]);

    if (
      (isString(item?.name) && trim(item.name).length <= 0) ||
      (isString(item?.key) && trim(item.key).length <= 0)
    ) {
      continue;
    }

    if ((!item.key && !item.value) || (!item.name && !item.value)) {
      continue;
    }

    if (isUndefined(item.domain)) {
      try {
        let _hostname = '';
        let _host = '';

        if (isString(request?.uri)) {
          _hostname = parseUrl(request?.uri).hostname;
        }

        if (typeof request?.uri === 'object' && !!request?.uri?.host) {
          _host = request?.uri?.host;
        }

        if (_host || _hostname) {
          item.domain = _host || _hostname;
        } else {
          continue;
        }
      } catch (err) {
        continue;
      }
    }

    const tempArr: any = [];
    forEach(localList, (localItem: any) => {
      let localDomain = localItem.domain;
      let remoteDomain = item.domain;

      if (localDomain.charAt(0) === '.') {
        localDomain = localDomain.substr(1, localDomain.length);
      }

      if (remoteDomain?.charAt(0) === '.') {
        remoteDomain = remoteDomain.substr(1, remoteDomain.length);
      }

      if (
        localDomain === remoteDomain &&
        localItem.key === item.name &&
        localItem.path === item.path &&
        tempArr.length <= 0
      ) {
        item.cookie_id = localItem.cookie_id;

        tempArr.push(item);
      }
    });

    if (isPlainObject(item) && !isEmpty(item?.name)) {
      item.key = item?.name;
    }

    if (item.expires) {
      const _expires = new Date(item.expires);
      item.expires = _expires;
    }

    for (const property in item) {
      if (property === 'maxAge' || property === 'expiratioxnDate') {
        let nowData = new Date().getTime();
        nowData += (item?.[property] as number) * 1000;
        item.expires = new Date(nowData).toUTCString();
      }
    }

    // Set cookie project
    item.project_id = getCurrentProjectId(context);

    if (tempArr.length <= 0) {
      const cookieId = snowflakeId();

      item.cookie_id = cookieId;
      cookieObj[item.cookie_id] = item;
    } else {
      tempArr.forEach((i: any) => {
        cookieObj[i.cookie_id] = i;
      });
    }
  }

  const localCookieObj = reduce(
    localList,
    (acc: any, item) => {
      acc[item.cookie_id] = item;
      return acc;
    },
    {}
  );

  const finalCookieObj = assign({}, localCookieObj, cookieObj);
  const cookieArr: any[] = values(finalCookieObj);

  _domainInfo.cookieObj = groupBy(cookieArr, 'domain');

  default_project_config.cookie = _domainInfo;
  setProjectConfig(context, default_project_config);

  // Update global page open content
  environmentWebView && environmentWebView.webview.postMessage({ action: 'setProjectConfig', data: default_project_config });
};

  // Transform environment variables
export const transformEnvVars = async (
  currentEnvData: EnvListItem,
  envVariables?: ApiSendResponseDataVariables['environment']
) => {
  if (!envVariables) return;

  const newList: { [key: string]: any } = {};
  const localList: { [key: string]: any } = currentEnvData?.env_var_list || {};

  Object.keys(envVariables).forEach((key: any) => {
    newList[key] = {
      current_value: envVariables[key],
      value: localList[key]?.value || '',
      description: localList[key]?.description || '',
    };
  });

  const result = {
    ...currentEnvData,
    env_var_list: newList,
  };
  return result;
};

  // Transform global variables
export const transformGlobalVars = (localGlobalVars: any, globalVariables?: ApiSendResponseDataVariables['globals']) => {
  if (!globalVariables) return;

  return reduce(
    keys(globalVariables),
    (prev: any, curr) => {
      prev[curr] = {
        current_value: globalVariables[curr],
        value: localGlobalVars[curr]?.value || '',
        description: localGlobalVars[curr]?.description || '',
      };
      return prev;
    },
    {}
  );
};

export const getAllChildIds = (apiList: ApiDetailsData[], apisData: ApiDetailsData) => {
  try {
    const resultData: string[] = [];

    const deepFind = (curApisData: ApiDetailsData) => {
      forEach(apiList, (forItem) => {
        if (forItem.parent_id === curApisData.target_id) {
          resultData.push(forItem.target_id);

          if (isEqual(forItem.target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
            deepFind(forItem);
          }
        }
      });
    };

    // Push current data to result set first
    resultData.push(apisData.target_id);
    deepFind(apisData);

    return resultData;
  } catch (err) { }
};

export const getMaxSort = (apiList: ApiDetailsData[], parent_id: string = '0') => {
  const childList = apiList.filter((i: ApiDetailsData) => i?.parent_id === parent_id);
  const maxSort = childList.reduce((max, obj) => obj?.sort > max ? obj?.sort : max, 0);
  return maxSort + 1;
};

export const curlImport = (parsedValue: string) => {
  return new Promise((resolve, reject) => {
    try {
      curlToPostman.convert({ type: 'string', data: parsedValue }, (error: any, result: any) => {
        if (result?.error && !result?.result) {
          reject(result?.error?.message);
          return;
        }
        if (error) {
          reject(error);
          return;
        }

        const newApi = aTools.curlPostman2apipost(head<any>(result?.output)?.data);

        if (!isPlainObject(newApi)) {
          return;
        }

        newApi.project_id = '';
        newApi.name = DEFAULT_APIS_BASE_DATA?.name || 'HTTP Request';
        newApi.response = DEFAULT_API_RESPONSE;
        newApi.request.header.parameter = getParameterDataFilterContentLength(
          newApi.request.header.parameter || []
        );

        const newUrl = genUrlByQuery(newApi?.url, newApi.request.query.parameter);

        if (isString(newUrl)) {
          newApi.url = newUrl;
        }
        if (isPlainObject(newApi) && newApi?.target_type === APIS_TARGET_TYPE_ENUM.API) {
          // Open new tab
          const newApiData: any = getHistoryOpensData(newApi);
          vscode.commands.executeCommand('openTabPanel', newApiData);
          resolve(null);
        }

      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getApiList = (context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    let apiList: any[] = [];
    let apiListName = 'apiList';
    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      apiListName = apiListName + `:${user_config.currentProject.project_id}`;
      apiList = getDataFromGlobalStorage(context, apiListName, []);
    } else {
      apiList = getDataFromGlobalStorage(context, apiListName, []);
    };
    return apiList;
  } catch (error) {
    return [];
  }
};

export const getAllApiChildren = (folder_id: string, context: vscode.ExtensionContext) => {
  const apiList = getApiList(context);
  const result: EventItem[] = [];
  const getChild = (id: string, list: EventItem[]) => {
    const childList = apiList.filter(i => i?.parent_id === id).sort((a, b) => a?.sort - b?.sort);
    if (childList.length > 0) {
      let folderIds: string[] = [];
      childList.forEach(child => {
        if (child.target_type === CASE_ITEM_TYPE.API) {
          result.push({
            event_id: child.target_id,
            test_id: folder_id,
            type: CASE_ITEM_TYPE.API,
            enabled: 1,
            sort: 1,
            data: child,
            parent_event_id: '0',
            /** Whether bidirectional sync */
            auto_sync: true,
            project_id: "-1"
          });
        }
        if (child.target_type === 'folder') {
          folderIds.push(child.target_id);
        }
      });
      if (folderIds.length > 0) {
        folderIds.forEach(f_id => {
          getChild(f_id, list);
        });
      }
    }
  };
  getChild(folder_id, result);
  return result;
};

export const setApiList = (newList: ApiDetailsData[], context: vscode.ExtensionContext) => {
  try {
    let apiListName = getApiListName(context);
    setDataToGlobalStorage(context, apiListName, newList);
    return true;
  } catch (error) {
    return false;
  }
};

export const getApiListName = (context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    let apiListName = 'apiList';
    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      apiListName = apiListName + `:${user_config.currentProject.project_id}`;
    } else {
    };
    return apiListName;
  } catch (error) {
    return 'apiList';
  }
};

export const getTestingFolderName = (folder_id: string, context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    let apiListName = `-1:${folder_id}:test`;
    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      apiListName = `${user_config.currentProject.project_id}:${folder_id}:test`;
    }
    return apiListName;
  } catch (error) {
    return `-1:${folder_id}:test`;
  }
};

export const getProjectTestName = (context: vscode.ExtensionContext) => {
  let projectTestName = `-1:test`;
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      projectTestName = `${user_config.currentProject.project_id}:test`;
    }
    return projectTestName;
  } catch (error) {
    return projectTestName;
  }
};

export const getTestingFolderData = (folder_id: string, context: vscode.ExtensionContext) => {
  try {
    let projectTestName = getProjectTestName(context);

    let projectTestData: any = getDataFromGlobalStorage(context, projectTestName);
    const projectTestFolderData = projectTestData?.[folder_id] || {};
    return projectTestFolderData;
  } catch (error) {
    return {};
  }
};

export const setTestingFolderData = (folder_id: string, data: any, context: vscode.ExtensionContext) => {
  try {
    let projectTestName = getProjectTestName(context);

    let projectTestData: any = getDataFromGlobalStorage(context, projectTestName);
    let projectTestFolderData = projectTestData?.[folder_id] || {};
    if (isPlainObject(data)) {
      forEach(data, (val, key) => {
        projectTestFolderData[key] = val;
      });
      projectTestData[folder_id] = projectTestFolderData;
      setDataToGlobalStorage(context, projectTestName, projectTestData);
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const getProjectReportList = (context: vscode.ExtensionContext) => {
  try {
    let reslut: any[] = [];
    let projectTestName = getProjectTestName(context);

    let projectTestData: any = getDataFromGlobalStorage(context, projectTestName);
    if (isPlainObject(projectTestData)) {
      forEach(projectTestData, (_val, key) => {
        if (isArray(projectTestData[key]?.reportList)) {
          reslut = reslut.concat(projectTestData[key].reportList);
        }
      });
    }
    reslut.sort((a, b) => b?.complete?.start_at - a?.complete?.start_at);
    return reslut;
  } catch (error) {
    return [];
  }
};

export const deleteProjectReport = (report_id: string, context: vscode.ExtensionContext) => {
  try {
    let projectTestName = getProjectTestName(context);

    let projectTestData: any = getDataFromGlobalStorage(context, projectTestName);
    if (isPlainObject(projectTestData)) {
      forEach(projectTestData, (_val, key) => {
        // Delete report index
        let reportIndex = -1;
        if (isArray(projectTestData[key]?.reportList)) {
          forEach(projectTestData[key]?.reportList, (report, index) => {
            if (report?.report_id === report_id) {
              // Found folder test position
              reportIndex = parseInt(index);
            }
          });
          if (reportIndex >= 0) {
            // Found and delete
            pullAt(projectTestData[key]?.reportList, reportIndex);
            setDataToGlobalStorage(context, projectTestName, projectTestData);
          }
        }
      });
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteTestingFolderData = (folder_id: string, context: vscode.ExtensionContext) => {

  try {
    let projectTestName = getProjectTestName(context);

    let projectTestData: any = getDataFromGlobalStorage(context, projectTestName);
    delete projectTestData[folder_id];
    setDataToGlobalStorage(context, projectTestName, projectTestData)
    return true;
  } catch (error) {
    return false;
  }
};

export const getCurrentProjectConfig = (context: vscode.ExtensionContext) => {
  let projectConfig = { ...DEFAULT_PROJECT_CONFIG };
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    const project_id = user_config?.currentProject && user_config?.currentProject?.project_id !== '-1' ? user_config.currentProject.project_id : '-1';
    const projectConfigFileName = project_id === '-1' ? `projectConfig_-1_-1` : `projectConfig_${user_config?.userInfo?.uid || -1}_${project_id}`;
    // Check if file exists
    if (existFileSync(context, projectConfigFileName)) {
      projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...getDataFromGlobalStorage(context, projectConfigFileName) };
    } else {
      // File does not exist, get from globalState
      let project_config: any = context.globalState.get('projectConfig') || {};
      projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...project_config?.[project_id] || {} };

      // Write to file
      if (setProjectConfig(context, projectConfig)) {
        // Delete data from globalState
        delete project_config[project_id];
        context.globalState.update("projectConfig", project_config);
      }
    }

    if (isArray(projectConfig?.envList)) {
      projectConfig.envList = projectConfig.envList.map((i: any) => {
        if (i?.env_id == 1 && i?.name == 'Default') {
          i.name = 'Default Environment';
        }
        if (isArray(i?.server_list)) {
          i.server_list = i.server_list.map((f: any) => {
            if (f?.server_id == 1 && f?.name == 'default_server') {
              f.name = 'Default Services';
            }
            return f;
          })
        }
        return i;
      })
    };

    if (isArray(projectConfig?.serverList)) {
      projectConfig.serverList = projectConfig.serverList.map((i: any) => {
        if (i?.server_id == 1 && i?.name == 'default_server') {
          i.name = 'Default Services';
        }

        return i;
      })
    };

    return projectConfig;
  } catch (error) {

  }
  return projectConfig;
}

export const getCurrentProjectId = (context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      return user_config?.currentProject?.project_id;
    } else {
      return '-1';
    };
  } catch (error) {
    return '-1';
  }
};

export const setProjectConfig = (context: vscode.ExtensionContext, new_project_config: any) => {
  try {
    let { sidePanelWebView } = globalConfig;

    let user_config: any = context.globalState.get('userConfig') || {};

    const project_id = user_config?.currentProject && user_config?.currentProject?.project_id !== '-1' ? user_config.currentProject.project_id : '-1';
    const projectConfigFileName = project_id === '-1' ? `projectConfig_-1_-1` : `projectConfig_${user_config?.userInfo?.uid || -1}_${project_id}`;

    if (!setDataToGlobalStorage(context, projectConfigFileName, new_project_config)) {
      return false;
    }

    if (sidePanelWebView) {
      sidePanelWebView?.webview.postMessage({ action: 'setProjectConfig', data: new_project_config });
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const setProjectApisVersion = (context: vscode.ExtensionContext, apis: ApiDetailsData[]) => {
  try {
    let project_apis_version: any = context.globalState.get('projectApisVersion') || {};
    if (isArray(apis)) {
      forEach(apis, (item) => {
        if (item?.target_id && item?.project_id && item.project_id !== '-1' && isNumber(item?.version)) {
          if (!project_apis_version?.[item.project_id]) {
            project_apis_version[item.project_id] = {};
          }
          project_apis_version[item.project_id][item.target_id] = item.version;
        }
      });
    }
    context.globalState.update("projectApisVersion", project_apis_version);
  } catch (error) { }
};

export const getProjectApisVersion = (context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    let project_apis_version: any = context.globalState.get('projectApisVersion') || {};

    if (user_config?.currentProject && user_config?.currentProject?.project_id !== '-1') {
      return project_apis_version?.[user_config.currentProject.project_id] || {};
    } else {
      return {};
    };
  } catch (error) { }
  return {};
};

export const getUserConfig = (context: vscode.ExtensionContext): { currentTeam: TeamItem; currentProject: Project } => {
  try {
    let user_config: any = context.globalState.get('userConfig') || {};
    return {
      ...{
        currentTeam: DEFAULT_TEAM,
        currentProject: DEFAULT_PROJECT
      }, ...user_config
    }
  } catch (error) { }
  return {
    currentTeam: DEFAULT_TEAM,
    currentProject: DEFAULT_PROJECT
  };
};

export const getHtmlForWebview = (webviewUri: vscode.Uri, resourceBaseUrl: vscode.Uri, data?: any, script?: Boolean, designScript?: Boolean) => {

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My View</title>
      <style>
        #loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--vscode-editor-background);
            z-index: 1000;
            color: var(--vscode-breadcrumb-focusForeground, var(--vscode-foreground, #FFFFFF));
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
    </head>
    <body> 
      <div id="root">
        <div id="loading">loading...</div>
      </div>
      <script>
      window.isMac = ${os.platform() === 'darwin' ? 'true' : 'false'}
      window.vscode = acquireVsCodeApi();
      window.vscodeData = ${data && JSON.stringify(data)};
      window.resourceBaseUrl = "${resourceBaseUrl}";
    </script>
      <script src="${webviewUri}"></script>
      ${script && '<script async src="https://www.echoapi.cloud/analytics/analyticsv2.min.js"></script>'}
      ${designScript && '<script async src="https://www.echoapi.cloud/analytics/analyticsv2-design.min.js"></script>'}
    </body>
    </html>
  `;
}

export const downloadFile = async (fileName: string, fileText: string) => {
  // Get user home directory and download path
  const userHome = os.homedir();
  const downloadPath = path.join(userHome, 'Downloads');
  const options = {
    defaultUri: vscode.Uri.file(path.join(downloadPath, fileName)),
    filters: {
      'Text files': ['json'],
      'All files': ['*']
    }
  };

  const uri = await vscode.window.showSaveDialog(options);
  if (uri) {
    const data = fileText;
    try {
      fs.writeFileSync(uri.fsPath, data)
      vscode.window.showInformationMessage('Export Successful！🎉: ' + uri.fsPath);
      return true;
    } catch (error: any) {
      vscode.window.showErrorMessage('Export failed: ' + error?.message);
    }
  }
  return false;
}

export const copyTextToClipboard = (text: string) => {
  vscode.env.clipboard.writeText(text).then(() => {
    // Successfully copied to clipboard
    vscode.window.showInformationMessage('Copy Success.');
  }, (error) => {
    // Copy failed
    vscode.window.showErrorMessage('Copy Failed: ' + error);
  });
}

export const showTabName = (text: string): string => {
  if (text.length > 20) {
    return `${text.slice(0, 20)}...`;
  }
  return text;
};

export const getLocalIPv4 = () => {
  try {
    const interfaces: any = os.networkInterfaces();
    for (const i in interfaces) {
      for (const iface of interfaces[i]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    return 'localhost';
  }
  return 'localhost';
};

export const getVscodeFontSize = () => {
  try {
    const fontSize = vscode.workspace.getConfiguration('editor').get('fontSize') as number;
    if (isNumber(fontSize)) {
      return fontSize;
    }

    return 12;
  } catch (error) {
    return 12;
  }
}

export const getVscodeFontFamily = () => {
  try {
    const fontFamily = vscode.workspace.getConfiguration('editor').get('fontFamily') as string;
    if (isString(fontFamily)) {
      return fontFamily;
    }

    return '';
  } catch (error) {
    return '';
  }
}

export const getCurrentEnvCurrentServer = (context: vscode.ExtensionContext, curServerId: string) => {
  const { envDetailKeys, envList, serverList } = getCurrentProjectConfig(context) || {};
  let curEnv: any = find(envList, (env) => isEqual(env.env_id, envDetailKeys));

  if (isUndefined(curEnv) || !isObject(curEnv)) {
    curEnv = {
      env_id: '',
      env_name: '',
      env_pre_url: '',
      env_pre_urls: {},
      environment: {},
    };
  }

  const defaultSererId = curServerId || find(serverList, (im) => im?.is_default === 1)?.server_id || '';

  const defaultServer = find(curEnv?.server_list, (findItem) => isEqual(findItem?.server_id, defaultSererId)) || {};

  return defaultServer;
}

export const openInFileExplorer = (filePath: string) => {
  const platform = os.platform();
  const normalizedPath = path.normalize(filePath);

  try {
    let command: string;
    switch (platform) {
      case 'win32': // Windows
        // Use `/select` parameter to select file
        // Convert to Windows-style path
        const windowsPath = normalizedPath.replace(/\//g, '\\');
        // Check if path exists
        if (!fs.existsSync(windowsPath)) {
          vscode.window.showErrorMessage(`Path does not exist: ${windowsPath}`);
          return;
        }
        command = `explorer /select,"${windowsPath}"`;
        break;
      case 'darwin': // macOS
        // Use `-R` parameter to locate file
        command = `open -R "${normalizedPath}"`;
        break;
      case 'linux': // Linux
        // Use file manager command (e.g. nautilus) and specify parent directory
        const parentDir = path.dirname(normalizedPath);
        command = `xdg-open "${parentDir}"`;
        break;
      default:
        vscode.window.showErrorMessage(`Unsupported platform: ${platform}`);
        return;
    }
    childProcess.exec(command);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to reveal file: ${error}`);
  }
}