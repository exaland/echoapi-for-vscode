import { INIT_DEFAULT_API_DATAS } from "@/constants/apis/default";
import { snowflakeId } from "apipost-tools";
import { cloneDeep, forEach, isArray } from "lodash";
import * as vscode from "vscode";
import { getDataFromGlobalStorage, setDataToGlobalStorage } from "./db";
import { getVscodeFontFamily, getVscodeFontSize } from "./utils";

export const initializePlugin = async (context: vscode.ExtensionContext) => {
  // First time entering the plugin and no API data in local project, add sample APIs
  let extension_config: any = context.globalState.get("extensionConfig") || {};
  const apiList = getDataFromGlobalStorage(context, "apiList", []);
  if (
    !extension_config?.firstInit &&
    (!isArray(apiList) || apiList.length <= 0)
  ) {
    // Add sample APIs
    const initApiList = cloneDeep(INIT_DEFAULT_API_DATAS);
    let parent_id = "0";
    initApiList.forEach((i) => {
      i.target_id = snowflakeId();
      if (i?.target_type === "folder") {
        parent_id = i.target_id;
      } else {
        i.parent_id = parent_id;
      }
    });
    setDataToGlobalStorage(context, "apiList", initApiList);
  }

  if (!extension_config?.firstFullData && apiList.length > 0) {
    // Complete missing data
    forEach(apiList, (api: any) => {
      let headers = api?.request?.header?.parameter;
      if (isArray(headers) && headers.length > 0) {
        api.request.header.parameter = headers.map((i) => {
          if (!i?.param_id) {
            i.param_id = snowflakeId();
          }
          return i;
        });
      }
      let querys = api?.request?.query?.parameter;
      if (isArray(querys) && querys.length > 0) {
        api.request.query.parameter = querys.map((i) => {
          if (!i?.param_id) {
            i.param_id = snowflakeId();
          }
          return i;
        });
      }
      let restfuls = api?.request?.restful?.parameter;
      if (isArray(restfuls) && restfuls.length > 0) {
        api.request.restful.parameter = restfuls.map((i) => {
          if (!i?.param_id) {
            i.param_id = snowflakeId();
          }
          return i;
        });
      }
      let cookies = api?.request?.cookie?.parameter;
      if (isArray(cookies) && cookies.length > 0) {
        api.request.cookie.parameter = cookies.map((i) => {
          if (!i?.param_id) {
            i.param_id = snowflakeId();
          }
          return i;
        });
      }
      let bodyParameter = api?.request?.body?.parameter;
      if (isArray(bodyParameter) && bodyParameter.length > 0) {
        api.request.body.parameter = bodyParameter.map((i) => {
          if (!i?.param_id) {
            i.param_id = snowflakeId();
          }
          return i;
        });
      }
    });

    setDataToGlobalStorage(context, "apiList", apiList);
    // Record data completion
    extension_config.firstFullData = true;
  }
  // Record first time entering the plugin
  extension_config.firstInit = true;
  context.globalState.update("extensionConfig", extension_config);

  // Get vscode font size ratio and save to system config
  let font_size = getVscodeFontSize();
  let font_family = getVscodeFontFamily();
  // Local stored data collection
  let default_system_config: any =
    context.globalState.get("systemConfig") || {};
  default_system_config.font_size = font_size;
  default_system_config.font_family = font_family;

  context.globalState.update("systemConfig", default_system_config);
};
