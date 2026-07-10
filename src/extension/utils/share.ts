import { forEach } from "lodash";
import { ApiDetailsData } from "@/types/apis/api";
import { ShareInfoData } from "@/types/share";
import { exportMethod } from "@/utils/export";
import { isPlainObject } from "lodash";
import * as vscode from "vscode";
import { DEFAULT_PROJECT } from "@/constants/project";
import { getCurrentProjectConfig } from "../utils";
import { EnvList } from "@/types/envManage";
import { AnyObject } from "@/types/common";
import { Project } from "@/types/user";
import { globalConfig } from "../constants";

export const createShare = (
  shareInfoData: ShareInfoData,
  context: vscode.ExtensionContext,
) => {
  try {
    let user_config: any = context.globalState.get("userConfig") || {};
    let projectShareName = `-1:share`;
    if (
      user_config?.currentProject &&
      user_config?.currentProject?.project_id !== "-1"
    ) {
      projectShareName = `${user_config.currentProject.project_id}:share`;
    }
    let projectShareData: any = context.globalState.get(projectShareName) || {};
    if (isPlainObject(projectShareData)) {
      projectShareData[shareInfoData.target_id] = shareInfoData;
    }
    context.globalState.update(projectShareName, projectShareData);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteShare = (
  shareInfoData: ShareInfoData,
  context: vscode.ExtensionContext,
) => {
  try {
    let user_config: any = context.globalState.get("userConfig") || {};
    let projectShareName = `-1:share`;
    if (
      user_config?.currentProject &&
      user_config?.currentProject?.project_id !== "-1"
    ) {
      projectShareName = `${user_config.currentProject.project_id}:share`;
    }
    let projectShareData: any = context.globalState.get(projectShareName) || {};
    if (isPlainObject(projectShareData)) {
      delete projectShareData[shareInfoData.target_id];
    }
    context.globalState.update(projectShareName, projectShareData);
    return true;
  } catch (error) {
    return false;
  }
};

export const batchDeleteShare = (
  deleteIds: string[],
  context: vscode.ExtensionContext,
) => {
  try {
    let user_config: any = context.globalState.get("userConfig") || {};
    let projectShareName = `-1:share`;
    if (
      user_config?.currentProject &&
      user_config?.currentProject?.project_id !== "-1"
    ) {
      projectShareName = `${user_config.currentProject.project_id}:share`;
    }
    let projectShareData: any = context.globalState.get(projectShareName) || {};
    if (isPlainObject(projectShareData)) {
      deleteIds.forEach((id) => {
        delete projectShareData[id];
      });
    }
    context.globalState.update(projectShareName, projectShareData);
    return true;
  } catch (error) {
    return false;
  }
};

export const getProjectShareData = (context: vscode.ExtensionContext) => {
  try {
    let user_config: any = context.globalState.get("userConfig") || {};
    let projectShareName = `-1:share`;
    if (
      user_config?.currentProject &&
      user_config?.currentProject?.project_id !== "-1"
    ) {
      projectShareName = `${user_config.currentProject.project_id}:share`;
    }
    let projectShareData: { [x: string]: ShareInfoData } =
      context.globalState.get(projectShareName) || {};

    return projectShareData;
  } catch (error) {
    return {};
  }
};

export const setProjectShareData = (
  projectShareData: { [x: string]: ShareInfoData },
  context: vscode.ExtensionContext,
) => {
  try {
    let user_config: any = context.globalState.get("userConfig") || {};
    let projectShareName = `-1:share`;
    if (
      user_config?.currentProject &&
      user_config?.currentProject?.project_id !== "-1"
    ) {
      projectShareName = `${user_config.currentProject.project_id}:share`;
    }

    context.globalState.update(projectShareName, projectShareData);
    return true;
  } catch (error) {
    return false;
  }
};

export const getExportData = (
  rest: any = {},
  context: vscode.ExtensionContext,
) => {
  let user_config: any = context.globalState.get("userConfig") || {};
  let project_config: any = getCurrentProjectConfig(context);
  let project = {};
  if (
    user_config?.currentProject &&
    user_config?.currentProject?.project_id !== "-1"
  ) {
    project = user_config.currentProject;
  } else {
    project = DEFAULT_PROJECT;
  }
  const envList: EnvList = project_config.envList;

  const envs = envList
    ?.filter((item) => item?.env_id !== "2")
    ?.map(({ env_var_list, name, server_list }) => {
      const url =
        server_list?.find((e) => e?.server_id === "1" || e?.is_default === 1)
          ?.uri || "";
      return {
        env_var_list,
        url,
        name,
      };
    });
  return {
    project,
    envs,
    models: [],
    mock_rules: [],
    ...rest,
  };
};

export const getOpenApi = async (
  apiData: ApiDetailsData,
  context: vscode.ExtensionContext,
) => {
  try {
    const json = getExportData({ apis: [apiData] }, context);
    const fileName = `echoapi_${apiData.name}_openapi.json`;
    const res = await exportMethod.apiToSwagger(json, "3.0");
    if (res.status === "success") {
      return {
        fileName,
        openApiStr: JSON.stringify(res.data, null, "\t"),
      };
    } else {
      vscode.window.showErrorMessage(res.message);
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getApiDocsUrlById = (
  target_id: string,
  context: vscode.ExtensionContext,
) => {
  const docBaseUrl = context.globalState.get("docBaseUrl");
  return `${docBaseUrl}?share_id=${target_id}`;
};

export const setApiDocsBaseUrl = (
  context: vscode.ExtensionContext,
  docBaseUrl: string,
  reStart?: boolean,
) => {
  context.globalState.update("docBaseUrl", docBaseUrl);
  if (reStart) {
    updatePageDocBaseUrl(docBaseUrl);
  }
};

export const updatePageDocBaseUrl = (docBaseUrl: string) => {
  let { sidePanelWebView, shareListWebView } = globalConfig;
  sidePanelWebView?.webview.postMessage({
    action: "setDocBaseUrl",
    data: docBaseUrl,
  });
  shareListWebView?.webview.postMessage({
    action: "setDocBaseUrl",
    data: docBaseUrl,
  });
  // Notify open tabs
  forEach(globalConfig.openedPanels, (openedPanel, key) => {
    openedPanel.webview.postMessage({
      action: "setDocBaseUrl",
      data: docBaseUrl,
    });
  });

  // Notify open tabs
  forEach(globalConfig.openedDocPanels, (openedDocPanel, key) => {
    openedDocPanel.webview.postMessage({
      action: "setDocBaseUrl",
      data: docBaseUrl,
    });
  });
};

export const getDocBaseUrl = (context: vscode.ExtensionContext) => {
  const docBaseUrl = context.globalState.get("docBaseUrl");
  return docBaseUrl;
};

export const completeOpenApiData = (
  pathsItem: AnyObject,
  context: vscode.ExtensionContext,
) => {
  let user_config: any = context.globalState.get("userConfig") || {};
  let project_config: any = getCurrentProjectConfig(context);
  let project: Project = {} as Project;
  if (
    user_config?.currentProject &&
    user_config?.currentProject?.project_id !== "-1"
  ) {
    project = user_config.currentProject;
  } else {
    project = DEFAULT_PROJECT;
  }
  const envList: EnvList = project_config.envList;
  const servers = envList
    ?.filter((item) => item?.env_id !== "2")
    ?.map(({ env_var_list, name, server_list }) => {
      const url =
        server_list?.find((e) => e?.server_id === "1" || e?.is_default === 1)
          ?.uri || "";
      return {
        variables: Object.keys(env_var_list || {}).reduce(
          (pre: any, curKey) => {
            const cur = env_var_list[curKey];
            pre[curKey] = {
              default: cur?.current_value || cur?.value || "",
              description: cur?.description || "",
            };
            return pre;
          },
          {},
        ),
        url,
        description: name || "",
      };
    });

  return {
    info: {
      title: project?.name || "Open Api",
      description: "",
      version: "1.0.0",
    },
    openapi: "3.0.3",
    servers,
    paths: {
      ...(pathsItem || {}),
    },
  };
};
