import * as vscode from "vscode";
import { globalConfig } from "../constants";
import {
  curlImport,
  getApiList,
  getCurrentProjectConfig,
  getCurrentProjectId,
  getMaxSort,
  setApiList,
  setProjectConfig,
} from "../utils";
import { importMethod } from "@/utils/export";
import { createBatchApi } from "@/utils/apis";
import { IMPORT_TYPE_ENUM, ImportLocationEnum } from "@/constants/settings";
import { find, forEach, has, isArray, isString } from "lodash";
import { validate } from "jsonschema";
import { apiConverFormat } from "../utils/import";
import echoapiSchemaRule from "@/constants/import/echoapi_schema";
import { snowflakeId } from "apipost-tools";
import { swaggerConverFormat } from "@/events/export";

export const handelImportDataMessage = async (
  message: { action: string; data: any },
  context: vscode.ExtensionContext,
  data: any,
) => {
  let { sidePanelWebView, importDataWebView } = globalConfig;
  switch (message.action) {
    case "getUserConfig":
      importDataWebView?.webview.postMessage({
        action: "setUserConfig",
        data: context.globalState.get("userConfig") || {},
      });
      break;
    case "getSystemConfig":
      let systemConfig: any = context.globalState.get("systemConfig") || {};
      if (isString(data?.type)) {
        systemConfig["import_data_init_type"] = data.type;
      }
      importDataWebView?.webview.postMessage({
        action: "setSystemConfig",
        data: systemConfig,
      });
      break;
    case "importData":
      const { newApis, chooseFolder, newEnvs } = message.data;
      const apiList: any[] = getApiList(context);
      // Check if selected directory has been deleted
      if (
        chooseFolder !== "0" &&
        apiList.find((i) => i?.target_id === chooseFolder) === undefined
      ) {
        vscode.window.showErrorMessage(
          "The selected directory has been deleted. Please select another directory",
        );
        return;
      }

      // Save environment, need to parse service info carried by environment, add new services if not exist locally
      if (isArray(newEnvs) && newEnvs.length > 0) {
        // Get local environment list and service list
        const currentProjectConfig = getCurrentProjectConfig(context);
        const localEnvList = currentProjectConfig?.envList || [];
        const localServerList = currentProjectConfig?.serverList || [];
        forEach(newEnvs, (newEnv) => {
          if (!isArray(newEnv?.server_list) || newEnv.server_list.length <= 0) {
            newEnv = {
              ...newEnv,
              server_list: localServerList?.map((e) => ({ ...e, uri: "" })),
            };
          } else {
            forEach(newEnv.server_list, (server) => {
              if (
                localServerList.findIndex(
                  (l) => l?.server_id === server?.server_id,
                ) === -1
              ) {
                localServerList.push({
                  ...server,
                  uri: "",
                  sort:
                    localServerList.reduce(
                      (max, obj) =>
                        (obj?.sort || 0) > max ? obj?.sort || 0 : max,
                      0,
                    ) + 1,
                });
              }
            });
          }

          // If default environment, change env_id to prevent duplicate default environments
          if (newEnv?.env_id === "1") {
            newEnv.env_id = snowflakeId();
          }

          localEnvList.push(newEnv);
        });

        forEach(localEnvList, (_, index) => {
          localEnvList[index].server_list = localServerList?.map(
            (serverItem) => ({
              ...serverItem,
              uri:
                find(
                  localEnvList[index]?.server_list,
                  (v) => v?.server_id === serverItem.server_id,
                )?.uri || "",
            }),
          );
        });

        // Save modified environment and services locally
        setProjectConfig(context, currentProjectConfig);
      }

      if (!newApis) {
        return;
      }
      const maxSort = getMaxSort(apiList, chooseFolder || "0");
      const newList = createBatchApi(newApis || [], maxSort, chooseFolder);

      const saveList = apiList.concat(newList);
      // Save locally
      setApiList(saveList, context);

      // Update left sidebar directory
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setApiList",
          data: saveList || [],
        });
      vscode.window.showInformationMessage("Import Successful！ 🎉");
      importDataWebView?.dispose();

      break;
    case "getImportData":
      const { json, fileType, formData } = message.data;
      const project_id = getCurrentProjectId(context);
      data = {
        apis: [],
        models: [],
        envs: [],
      };

      if (fileType === IMPORT_TYPE_ENUM.POSTMAN) {
        // Check if it is an environment file
        if (isString(json?.name) && isArray(json?.values)) {
          data = {
            name: "New Project",
            intro: "",
            global: {},
            apis: [],
            envs: [
              {
                env_id: snowflakeId(),
                is_private: -1,
                env_var_list: json.values.reduce((pre: any, item: any) => {
                  if (!has(item, "enabled") || item?.enabled) {
                    pre[item?.key] = {
                      value: item?.value || "",
                      current_value: item?.value || "",
                      description: "",
                    };
                  }
                  return pre;
                }, {}),
                name: json?.name,
              },
            ],
            models: [],
          };
          importDataWebView?.webview.postMessage({
            action: "setImportData",
            type: "select_envs",
            data: data,
          });
          return;
        }

        const res = await importMethod.postmanToApipost(json, "vscode");

        if (res?.status === "success") {
          data = {
            ...data,
            apis: res?.data?.apis || [],
          };
        } else {
          vscode.window.showErrorMessage(
            "Import Failed: Unsupported file format. Please upload a vaild Postman file or a compatible format",
          );
          return;
        }
      } else if (fileType === IMPORT_TYPE_ENUM.ECHOAPI) {
        let valid = validate(json, echoapiSchemaRule).valid;
        if (!valid) {
          vscode.window.showErrorMessage(
            "Non standard format EchoAPI file, please check and upload it again.",
          );
          return;
        }

        const res: any = apiConverFormat(json, project_id);
        data = {
          ...data,
          apis: res?.apis || [],
          envs: (res?.global?.envs || []).filter((i: any) => i.env_id !== "2"), // Filter mock environment
        };
      } else if (fileType === IMPORT_TYPE_ENUM.THUNDER_CLIENT) {
        const res = importMethod.thunderToApipost(json, "");
        if (res?.status === "success") {
          data = {
            ...data,
            apis: res?.data?.apis || [],
          };
        } else {
          vscode.window.showErrorMessage(
            "Non standard format Thunder Client file, please check and upload it again.",
          );
          return;
        }
      } else if (
        fileType === IMPORT_TYPE_ENUM.SWAGGER ||
        fileType === IMPORT_TYPE_ENUM.SWAGGERURL
      ) {
        const {
          api_cover_modal,
          model_cover_modal,
          env_cover_modal,
          basePath,
          hostPath,
        } = formData;
        const res = await importMethod.swaggerToApipost(json, {
          basePath,
          host: hostPath,
        });
        if (res.status !== "error") {
          const config = {
            mode: ImportLocationEnum.append,
            folder_id: "0",
            host: "",
            base_path: "",
            api_cover_modal,
            model_cover_modal,
            env_cover_modal,
          };
          // Processing logic...
          const swaggerData: any = swaggerConverFormat(
            res.data,
            config,
            project_id,
          );
          data = {
            ...data,
            apis: swaggerData?.apis || [],
            envs: (swaggerData?.global?.envs || []).filter(
              (i: any) => i.env_id !== "2",
            ), // Filter mock environment
          };
        }
      }
      importDataWebView?.webview.postMessage({
        action: "setImportData",
        data: data,
      });
      break;
    case "getApiList":
      // Initialize and pass API list
      importDataWebView?.webview.postMessage({
        action: "setApiList",
        data: getApiList(context) || [],
      });
      break;
    case "getVscodeTheme":
      const vscodeTheme = vscode.workspace
        .getConfiguration("workbench")
        .get("colorTheme");
      importDataWebView?.webview.postMessage({
        action: "setVscodeTheme",
        data: vscodeTheme,
      });
      break;
    case "curlImport":
      try {
        await curlImport(message.data);
        // Close import page
        importDataWebView?.dispose();
      } catch (error: any) {
        vscode.window.showErrorMessage(error);
      }
      break;
  }
};
