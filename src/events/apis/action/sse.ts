import i18next from "i18next";

import { ApisItemActionType } from "@/types/apis/other";

export const shareSSE = (params: ApisItemActionType) => {
};

export const copySSE = (params: ApisItemActionType) => {
};

export const cloneSSE = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: "cloneApi",
    data: {
      target_id: apisData.target_id,
    },
  });
};

export const deleteSSE = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: "showConfirmation",
    data: {
      title: i18next.t("supplement.sure_del", { arg: apisData.name }),
      target_id: apisData.target_id,
    },
  });
};

export const editSSE = (params: ApisItemActionType) => {
  const { apisData } = params;

  window?.vscode.postMessage({
    action: "showInputBox",
    data: {
      prompt: "Enter New Name",
      type: "api",
      sourceData: apisData,
      value: apisData?.name || "",
    },
  });
};

export const displayFinder = (params: ApisItemActionType) => {
  window?.vscode.postMessage({
    action: "openVscodeFileExplorer",
  });
};

export default {
  share: shareSSE,
  copy: copySSE,
  clone: cloneSSE,
  delete: deleteSSE,
  edit: editSSE,
  displayFinder: displayFinder,
};
