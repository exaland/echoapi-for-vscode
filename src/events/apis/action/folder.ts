import i18next from "i18next";

import { createOpensItem } from "@/events/apis/opens";
import { ApisItemActionType } from "@/types/apis/other";

import { APIS_TARGET_TYPE_ENUM } from "@/constants/apis";
import { useApis } from "@/store";

export const addFolderChild = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: childTargetType as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  if (["api", "sse"].includes(childTargetType as APIS_TARGET_TYPE_ENUM)) {
    window?.vscode.postMessage({
      action:
        tabsValue == "docs" && childTargetType === "api"
          ? "openDesignPanel"
          : "openTagPanel",
      data: result,
    });
  }
  if (childTargetType === "folder") {
    window?.vscode.postMessage({
      action: "showInputBox",
      data: {
        type: "folder",
        sourceData: result,
      },
    });
  }
};

export const addApiChild = async (params: ApisItemActionType) => {
  const { apisData, tabsValue } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.API as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: tabsValue == "docs" ? "openDesignPanel" : "openTagPanel",
    data: result,
  });
};

export const addChildFolder = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.FOLDER as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: "showInputBox",
    data: {
      type: "folder",
      sourceData: result,
    },
  });
};

export const addSseChild = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.SSE as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: tabsValue == "docs" ? "openDesignPanel" : "openTagPanel",
    data: result,
  });
};

export const addWebsocket2Child = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.WEBSOCKET2 as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: "openTagPanel",
    data: result,
  });
};

export const addSocketIoChild = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.SOCKETIO as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: "openTagPanel",
    data: result,
  });
};

export const addGraphqlChild = async (params: ApisItemActionType) => {
  const { apisData } = params;
  const result = await createOpensItem({
    target_type: APIS_TARGET_TYPE_ENUM.GRAPHQL as APIS_TARGET_TYPE_ENUM,
    project_id: "",
    parent_id: apisData?.target_id || "0",
  });
  window?.vscode.postMessage({
    action: "openTagPanel",
    data: result,
  });
};

export const shareFolder = (_params: ApisItemActionType) => {
};

export const copyFolder = (_params: ApisItemActionType) => {
};

export const pasteFolder = (_params: ApisItemActionType) => {
};

export const cloneFolder = (_params: ApisItemActionType) => {
};

export const editFolder = (params: ApisItemActionType) => {
  const { apisData } = params;

  window?.vscode.postMessage({
    action: "showInputBox",
    data: {
      prompt: "Enter New Name",
      sourceData: apisData,
      value: apisData?.name || "",
      type: "folder",
    },
  });
};

export const editFolderData = (params: ApisItemActionType) => {
  const { apisData } = params;
  const { updateApisActiveKey } = useApis.getState();
  // Update the currently selected tab key
  updateApisActiveKey(apisData.target_id);
  window?.vscode.postMessage({
    action: "openTagPanelById",
    data: apisData.target_id,
  });
};

export const deleteFolder = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: "showConfirmation",
    data: {
      title: i18next.t("supplement.sure_del", { arg: apisData.name }),
      target_id: apisData.target_id,
    },
  });
};

export const runFolder = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: "runFolder",
    data: apisData,
  });
};

export const openHistoryReport = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: "runFolder",
    data: apisData,
    option: {
      openHistoryReport: true,
    },
  });
};

export const displayFinder = (_params: ApisItemActionType) => {
  window?.vscode.postMessage({
    action: "openVscodeFileExplorer",
  });
};

export default {
  api: addApiChild,
  sse: addSseChild,
  websocket2: addWebsocket2Child,
  socketio: addSocketIoChild,
  graphql: addGraphqlChild,
  folder: addChildFolder,
  add: addFolderChild,
  share: shareFolder,
  copy: copyFolder,
  clone: cloneFolder,
  delete: deleteFolder,
  paste: pasteFolder,
  edit: editFolder,
  run: runFolder,
  report: openHistoryReport,
  editData: editFolderData,
  displayFinder: displayFinder,
};
