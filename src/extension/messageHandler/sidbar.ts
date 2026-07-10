import * as vscode from "vscode";
import {
  deleteProjectReport,
  deleteTestingFolderData,
  downloadFile,
  getAllApiChildren,
  getAllChildIds,
  getApiList,
  getMaxSort,
  getCurrentProjectConfig,
  getProjectReportList,
  getTestingFolderName,
  setApiList,
  setProjectApisVersion,
  setProjectConfig,
  openInFileExplorer,
  getApiListName,
} from "../utils";
import { globalConfig } from "../constants";
import {
  cloneDeep,
  forEach,
  isArray,
  isEmpty,
  isFunction,
  isPlainObject,
} from "lodash";
import { fillInOpenApi, getCodeHarRequest, updateOpenData } from "../apis";
import { DEFAULT_TEAM } from "@/constants/team";
import { DEFAULT_PROJECT } from "@/constants/project";
import {
  createShare,
  deleteShare,
  getDocBaseUrl,
  getOpenApi,
  getProjectShareData,
  setProjectShareData,
} from "../utils/share";
import { snowflakeId } from "apipost-tools";
import { ApiDetailsData } from "@/types/apis/api";
import { isWin } from "../db";
import path from "path";
import os from "os";
import fs from "fs";

const saveApiListItem = (
  data: ApiDetailsData,
  context: vscode.ExtensionContext,
) => {
  const {
    sidePanelWebView,
    openedPanels,
    pushWebView,
    shareListWebView,
    openedFolderTestPanels,
  } = globalConfig;

  const apiList: any[] = getApiList(context);
  const index = apiList.findIndex((e: any) => e?.target_id === data?.target_id);
  if (index > -1) {
    apiList.splice(index, 1, data); // Replace target element
    // Update tab content and title after replacement
    updateOpenData(openedPanels, data);
  } else {
    data.sort = getMaxSort(apiList, data.parent_id);
    apiList.push(data); // Add element
  }
  // Update page
  sidePanelWebView?.webview.postMessage({
    action: "setApiList",
    data: apiList || [],
  });

  if (pushWebView) {
    pushWebView?.webview.postMessage({
      action: "setPushPanelData",
      data: {
        local_api_list: apiList,
      },
    });
  }

  if (shareListWebView) {
    shareListWebView?.webview.postMessage({
      action: "setApiList",
      data: apiList,
    });
  }

  // Update API list in run all
  if (
    isPlainObject(openedFolderTestPanels) &&
    !isEmpty(openedFolderTestPanels)
  ) {
    Object.keys(openedFolderTestPanels).forEach((folderName) => {
      let folder_id = folderName.split(":")[1];
      if (folder_id) {
        openedFolderTestPanels[folderName].webview.postMessage({
          action: "setTestData",
          data: {
            ventList: getAllApiChildren(folder_id, context), // API list under directory (flat)
          },
        });
      }
    });
  }
};

export const handleMessage = async (
  message: { action: string; data: any; option?: any },
  context: vscode.ExtensionContext,
) => {
  const apiList: any[] = getApiList(context);

  const {
    sidePanelWebView,
    openedPanels,
    openedFolderTestPanels,
    openedFolderTestReportDataPanels,
    openedDocPanels,
    pushWebView,
    shareListWebView,
  } = globalConfig;

  switch (message.action) {
    case "getApiList":
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setApiList",
          data: getApiList(context),
        });
      break;
    case "getUserConfig":
      let user_config: any = context.globalState.get("userConfig") || {};
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setUserConfig",
          data: {
            ...{
              currentTeam: DEFAULT_TEAM,
              currentProject: DEFAULT_PROJECT,
            },
            ...user_config,
          },
        });
      break;
    case "getSystemConfig":
      sidePanelWebView?.webview.postMessage({
        action: "setSystemConfig",
        data: context.globalState.get("systemConfig") || {},
      });
      break;
    case "getProjectConfig":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectConfig",
        data: getCurrentProjectConfig(context),
      });
      break;
    case "setApiList":
      setApiList(message.data, context);
      // Record project API versions for later conflict comparison
      setProjectApisVersion(context, message.data);
      // Update open data to latest
      forEach(globalConfig.openedPanels, (openedPanel, key) => {
        const openItem = message.data.find((i: any) => i?.target_id === key);
        if (isPlainObject(openItem)) {
          openedPanel.webview.postMessage({
            action: "setApiData",
            data: openItem,
          });
        }
      });

      if (pushWebView) {
        pushWebView?.webview.postMessage({
          action: "setPushPanelData",
          data: {
            local_api_list: message.data,
          },
        });
      }

      if (shareListWebView) {
        shareListWebView?.webview.postMessage({
          action: "setApiList",
          data: message.data,
        });
      }

      break;
    case "openTagPanel":
      vscode.commands.executeCommand("openTabPanel", message.data);
      break;
    case "openPushPanel":
      vscode.commands.executeCommand("echoapi.openPush", message.data);
      break;
    case "openCurlPanel":
      vscode.commands.executeCommand("openCurlPanel");
      break;
    case "openImportDataPanel":
      vscode.commands.executeCommand("openImportDataPanel", message.data);
      break;
    case "openExportDataPanel":
      vscode.commands.executeCommand("openExportDataPanel", message.data);
      break;
    case "openLogin":
      vscode.commands.executeCommand("echoapi.login");
      break;
    case "setProjectConfig":
      // Local stored data collection
      const project_config = getCurrentProjectConfig(context);
      if (isPlainObject(message.data)) {
        forEach(message.data, (value, key) => {
          project_config[key] = value;
        });
      }
      setProjectConfig(context, project_config);
      break;
    case "userSingOut":
      vscode.commands.executeCommand("echoapi.userSingOut", {
        form: "sidebar",
      });
      break;
    case "switchProject":
      try {
        const { team, project } = message.data;
        if (!team || !project) {
          return;
        }

        // Clear open tabs
        forEach(openedPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Clear open automated test tabs
        forEach(openedFolderTestPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Clear open report result tabs
        forEach(openedFolderTestReportDataPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Clear open document tabs
        forEach(openedDocPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Close all tab pages
        forEach(globalConfig, (panel, key) => {
          if (isFunction(panel?.dispose) && key !== "sidePanelWebView") {
            panel.dispose();
          }
        });

        let new_user_config: any = context.globalState.get("userConfig") || {};
        // Update currently selected project
        new_user_config.currentTeam = team;
        new_user_config.currentProject = project;

        context.globalState.update("userConfig", new_user_config);

        // Restore local apiList
        sidePanelWebView?.webview.postMessage({
          action: "setApiList",
          data: getApiList(context),
        });

        // Get project report list
        sidePanelWebView?.webview.postMessage({
          action: "setProjectReportList",
          data: getProjectReportList(context),
        });

        // Get project doc list
        sidePanelWebView?.webview.postMessage({
          action: "setProjectShareData",
          data: getProjectShareData(context),
        });

        // Get project configuration
        sidePanelWebView?.webview.postMessage({
          action: "setProjectConfig",
          data: getCurrentProjectConfig(context),
        });
      } catch (error) {}

      break;
    case "openTagPanelById":
      const curData = apiList.find(
        (i: ApiDetailsData) => i?.target_id === message.data,
      );
      curData.is_create = -1;
      curData.is_changed = -1;
      vscode.commands.executeCommand("openTabPanel", curData);
      break;
    case "openDesignPanel":
      await fillInOpenApi(message.data, context);
      vscode.commands.executeCommand("echoapi.design", message.data);
      break;
    case "createShare":
      createShare(message.data, context);
      // Refresh share list
      shareListWebView?.webview.postMessage({
        action: "setShareData",
        data: getProjectShareData(context),
      });
      break;
    case "openDesignPanelById":
      const curApiData = apiList.find(
        (i: ApiDetailsData) => i?.target_id === message.data,
      );
      curApiData.is_create = -1;
      // Supplement open api initial data
      await fillInOpenApi(curApiData, context);
      vscode.commands.executeCommand("echoapi.design", curApiData);
      break;
    case "showInputBox":
      const userInput = await vscode.window.showInputBox({
        prompt: message?.data?.prompt || "Folder Name",
        placeHolder: "",
        value: message?.data?.value || "",
      });

      // Send user input results back to Webview
      sidePanelWebView?.webview.postMessage({
        action: "inputResult",
        inputValue: userInput,
        data: {
          type: message?.data?.type || "folder",
          sourceData: message?.data?.sourceData,
        },
      });
      // Modify directory name and also modify directory automated test name
      if (!message?.data?.type || message?.data?.type === "folder") {
        const folderName = getTestingFolderName(
          message?.data?.sourceData?.target_id,
          context,
        );

        // Whether run all interface is open
        if (openedFolderTestPanels[folderName]) {
          openedFolderTestPanels[folderName].title = userInput || "";

          openedFolderTestPanels[folderName].webview.postMessage({
            action: "setTestData",
            data: {
              testingName: userInput, // Test name
            },
          });
        }

        // Whether directory settings interface is open
        if (openedPanels[message?.data?.sourceData?.target_id]) {
          // Update tab content and title
          updateOpenData(openedPanels, {
            ...message?.data?.sourceData,
            name: userInput,
          });
        }
      }

      break;
    case "saveFolder":
      saveApiListItem(message?.data, context);
      break;
    case "cloneApi":
      const target = apiList.find(
        (i) => i?.target_id === message.data.target_id,
      );
      if (target === undefined) {
        return;
      }
      const dataNew = cloneDeep(target);
      dataNew.target_id = snowflakeId();
      dataNew.version = 0;
      if (dataNew?.name === "") {
        dataNew.name = "Create";
      }
      dataNew.name += ` Copy`;

      saveApiListItem(dataNew, context);

      vscode.window.showInformationMessage("Duplicate Successfully");

      break;
    case "showConfirmation":
      const result = await vscode.window.showInformationMessage(
        message.data.title,
        { modal: true },
        "Yes",
        "No",
      );
      if (result === "Yes") {
        const curData = apiList.find(
          (i: any) => i?.target_id === message.data.target_id,
        );
        let list = [];
        if (curData.target_type === "folder") {
          // Find all child ids and delete together
          const delIds: string[] = getAllChildIds(apiList, curData) || [];
          list = apiList.filter((i: any) => !delIds.includes(i?.target_id));
          forEach(delIds, (k) => {
            if (openedPanels[k]) {
              // Tab already exists, close tab
              openedPanels[k].dispose();
              // delete openedPanels[message.data.target_id];
            }
            if (openedDocPanels[k]) {
              // Close design tab
              openedDocPanels[k].dispose();
            }
            // Delete directory-related automated test data
            const folderName = getTestingFolderName(k, context);
            if (openedFolderTestPanels[folderName]) {
              // Tab already exists, close tab
              openedFolderTestPanels[folderName].dispose();
            }
            // Delete test data
            deleteTestingFolderData(k, context);
          });
        } else {
          list = apiList.filter(
            (i: any) => i?.target_id !== message.data.target_id,
          );
          if (openedPanels[message.data.target_id]) {
            // Tab already exists, close tab
            openedPanels[message.data.target_id].dispose();
            // delete openedPanels[message.data.target_id];
          }
          if (openedDocPanels[message.data.target_id]) {
            // Close design tab
            openedDocPanels[message.data.target_id].dispose();
          }
        }

        setApiList(list, context);
        // Update page
        sidePanelWebView?.webview.postMessage({
          action: "setApiList",
          data: list || [],
        });

        if (pushWebView) {
          pushWebView?.webview.postMessage({
            action: "setPushPanelData",
            data: {
              local_api_list: list,
            },
          });
        }

        if (shareListWebView) {
          shareListWebView?.webview.postMessage({
            action: "setApiList",
            data: list,
          });
        }

        // Update API list in run all
        if (
          isPlainObject(openedFolderTestPanels) &&
          !isEmpty(openedFolderTestPanels)
        ) {
          Object.keys(openedFolderTestPanels).forEach((folderName) => {
            let folder_id = folderName.split(":")[1];
            if (folder_id) {
              openedFolderTestPanels[folderName].webview.postMessage({
                action: "setTestData",
                data: {
                  ventList: getAllApiChildren(folder_id, context), // API list under directory (flat)
                },
              });
            }
          });
        }
      }
      break;
    case "onDrop":
      // Find all elements under the moved directory
      if (isArray(message?.data?.target_ids)) {
        forEach(message?.data?.target_ids, (target_id) => {
          // Find element current position
          const index = apiList.findIndex(
            (e: any) => e?.target_id === target_id,
          );
          if (index < 0) {
            return;
          }
          // Drag element into directory
          if (
            message?.data?.after_target_id === "0" &&
            message?.data?.before_target_id === "0"
          ) {
            apiList[index].parent_id = message?.data?.parent_id || "0";
            apiList[index].sort = getMaxSort(apiList, apiList[index].parent_id);
          } else if (
            message?.data?.after_target_id === "0" &&
            message?.data?.before_target_id !== "0"
          ) {
            // Drag element after target element

            // Get all elements under target directory (excluding moved elements)
            const curFolderChildrens = apiList
              .filter(
                (i: any) =>
                  i?.parent_id === (message?.data?.parent_id || "0") &&
                  i?.target_id !== target_id,
              )
              .sort((a: any, b: any) => a.sort - b.sort);

            // Get target element position
            const goalIndex = curFolderChildrens.findIndex(
              (e: any) => e?.target_id === message?.data?.before_target_id,
            );
            if (goalIndex < 0) {
              return;
            }

            // Modify directory id
            apiList[index].parent_id = message?.data?.parent_id || "0";
            // Insert at corresponding position
            curFolderChildrens.splice(goalIndex + 1, 0, apiList[index]);
            // Re-sort
            forEach(curFolderChildrens, (newData, sort) => {
              // Find element original position
              const childIndex = apiList.findIndex(
                (e: any) => e?.target_id === newData?.target_id,
              );
              if (childIndex > -1) {
                apiList[childIndex].sort = sort + 1;
                // Modify open data
                updateOpenData(openedPanels, apiList[childIndex]);
              }
            });
          } else if (
            message?.data?.after_target_id !== "0" &&
            message?.data?.before_target_id === "0"
          ) {
            // Drag element before target element

            // Get all elements under target directory (excluding moved elements)
            const curFolderChildrens = apiList
              .filter(
                (i: any) =>
                  i?.parent_id === (message?.data?.parent_id || "0") &&
                  i?.target_id !== target_id,
              )
              .sort((a: any, b: any) => a.sort - b.sort);

            // Get target element position
            const goalIndex = curFolderChildrens.findIndex(
              (e: any) => e?.target_id === message?.data?.after_target_id,
            );
            if (goalIndex < 0) {
              return;
            }

            // Modify directory id
            apiList[index].parent_id = message?.data?.parent_id || "0";
            // Insert at corresponding position
            curFolderChildrens.splice(goalIndex, 0, apiList[index]);
            // Re-sort
            forEach(curFolderChildrens, (newData, sort) => {
              // Find element original position
              const childIndex = apiList.findIndex(
                (e: any) => e?.target_id === newData?.target_id,
              );
              if (childIndex > -1) {
                apiList[childIndex].sort = sort + 1;
                // Modify open data
                updateOpenData(openedPanels, apiList[childIndex]);
              }
            });
          }
          // Update open page data after drag
          updateOpenData(openedPanels, apiList[index]);
        });

        setApiList(apiList, context);
        // Update page
        sidePanelWebView?.webview.postMessage({
          action: "setApiList",
          data: apiList || [],
        });

        // If push page is open, update push page data
        pushWebView?.webview.postMessage({
          action: "setPushPanelData",
          data: {
            local_api_list: apiList || [],
          },
        });

        vscode.window.showInformationMessage("Move Success");
      }
      break;
    case "showSingOutConfirmation":
      vscode.window
        .showInformationMessage(
          `Session expired 
            To protect your data, please choose:
            `,
          { modal: true },
          "Sign In Again",
          "Sign Out - Exit",
        )
        .then((res) => {
          if ((res = "Sign In Again")) {
            vscode.commands.executeCommand("echoapi.userSingOut", {
              form: "sidebar",
              clearApiData: "-1",
            });
            // Open login page
            vscode.commands.executeCommand("echoapi.login");
          } else {
            // Sign out
            vscode.commands.executeCommand("echoapi.userSingOut", {
              form: "sidebar",
            });
          }
        });
      break;
    case "runFolder":
      // Open folderTest page
      vscode.commands.executeCommand(
        "echoapi.folderTest",
        message.data,
        message.option,
      );
      break;
    case "openReportData":
      // Open fReportData page
      vscode.commands.executeCommand(
        "echoapi.folderTestReportData",
        message.data,
      );
      break;
    case "getProjectReportList":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectReportList",
        data: getProjectReportList(context),
      });
      break;
    case "deleteReport":
      if (deleteProjectReport(message?.data?.report_id, context)) {
        vscode.window.showInformationMessage("Delete Success");
        // Close already open tabs
        if (openedFolderTestReportDataPanels[message?.data?.report_id]) {
          openedFolderTestReportDataPanels[message?.data?.report_id].dispose();
        }
        // Refresh page after deletion
        sidePanelWebView?.webview.postMessage({
          action: "setProjectReportList",
          data: getProjectReportList(context),
        });
      }
      break;
    case "openNewWindow":
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case "getProjectShareData":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectShareData",
        data: getProjectShareData(context),
      });
      break;
    case "deleteShare":
      deleteShare(message.data, context);

      // Close share tab
      if (openedDocPanels?.[message?.data?.target_id]) {
        openedDocPanels[message?.data?.target_id].dispose();
      }

      // Refresh share list
      // sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setProjectShareData', data: getProjectShareData(context) });
      break;
    case "openDocPanel":
      vscode.commands.executeCommand("echoapi.docsShareData", message.data);
      break;
    case "getDocBaseUrl":
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setDocBaseUrl",
          data: getDocBaseUrl(context),
        });
      break;
    case "exportOpenApiById":
      const openData = apiList.find(
        (i) => i?.target_id === message?.data?.target_id,
      );
      if (openData !== undefined) {
        const fileObj = await getOpenApi(openData, context);
        if (fileObj === null) {
          return;
        }
        await downloadFile(fileObj.fileName, fileObj.openApiStr);
      }
      break;
    case "updateShareTime":
      if (isArray(message.data)) {
        const shareData = getProjectShareData(context);
        forEach(message.data, (id) => {
          // Check if share record exists, update share time if so
          if (shareData?.[id]) {
            shareData[id].share_time = Date.now();
          }
          setProjectShareData(shareData, context);
          // Refresh share list
          shareListWebView?.webview.postMessage({
            action: "setShareData",
            data: shareData,
          });
        });
      }
      break;
    case "copyAsCurl":
      // Fix: cannot carry global parameters under directory (temporarily modify directory id)
      if (message?.data?.apiData?.parent_id) {
        message.data.apiData.parent_id = "0";
      }
      const har = await getCodeHarRequest(message.data.apiData, context);
      // Send HAR request results back to Webview
      sidePanelWebView?.webview.postMessage({
        action: "copyAsCurl",
        data: har,
      });

      // vscode.window.showInformationMessage('Copy Success');
      break;
    case "openeShareListPanel":
      vscode.commands.executeCommand("echoapi.shareList", message.data);
      break;
    case "getVscodeTheme":
      const vscodeTheme = vscode.workspace
        .getConfiguration("workbench")
        .get("colorTheme");
      sidePanelWebView?.webview.postMessage({
        action: "setVscodeTheme",
        data: vscodeTheme,
      });
      break;
    case "openVscodeFileExplorer":
      let apiListName = getApiListName(context);
      if (apiListName.includes(":") && isWin()) {
        apiListName = apiListName.replace(/:/g, "_");
      }

      const cachePath = path.join(
        os.homedir(),
        "echoapi_for_vscode",
        `${apiListName}.json`,
      );
      const filePath = path.join(
        context.globalStorageUri.fsPath,
        `${apiListName}.json`,
      );
      const normalizedPath = path.normalize(cachePath);
      if (fs.existsSync(normalizedPath)) {
        openInFileExplorer(cachePath);
      } else {
        openInFileExplorer(filePath);
      }

      break;
  }
};
