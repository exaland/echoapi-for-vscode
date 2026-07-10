import i18next from 'i18next';

import { ApisItemActionType } from '@/types/apis/other';
import useShare from '@/store/useShare';
import { message } from 'antd';
import { copyStringToClipboard } from '@/utils/common';

export const shareApi = (params: ApisItemActionType) => {
};

export const copyApi = (params: ApisItemActionType) => {
};

export const copyAsCurl = (params: ApisItemActionType)=>{
  const { apisData } = params;
  window?.vscode.postMessage({
    action: 'copyAsCurl',
    data: {
      apiData:apisData
    }
  });
}

function removeTrailingSubstring(str:string, trailingStr:string) {
  if (str.endsWith(trailingStr)) {
    return str.slice(0, -trailingStr.length);
  }
  return str;
}

export const copyOpenApiUrl = (params: ApisItemActionType)=>{
  const { apisData } = params;

  const { docBaseUrl }  = useShare.getState();
  let baseUrl = removeTrailingSubstring(docBaseUrl,'api-docs');
  copyStringToClipboard(`${baseUrl}swagger.json?share_id=${apisData.target_id}`, () => message.success('Copy Success'))

  window?.vscode.postMessage({
    action: 'createShare',
    data: {
      target_id: apisData.target_id,
      share_time: Date.now()
    }
  });
}

export const cloneApi = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: 'cloneApi',
    data: {
      target_id:apisData.target_id
    }
  });
};

export const deleteApi = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: 'showConfirmation',
    data: {
      title:i18next.t('supplement.desgin_sure_del', { arg: apisData.name }),
      target_id:apisData.target_id
    }
  });
};

export const editApi = (params: ApisItemActionType) => {
  const { apisData } = params;
  
  window?.vscode.postMessage({
    action: 'showInputBox',
    data:{
      prompt:'Enter New Name',
      type:'api',
      sourceData:apisData,
      value:apisData?.name || ''
    }
  });
};

export const displayFinder=(params: ApisItemActionType)=>{
  window?.vscode.postMessage({
    action: 'openVscodeFileExplorer',
  });
}

export default {
  share: shareApi,
  copy: copyApi,
  clone: cloneApi,
  delete: deleteApi,
  edit: editApi,
  copyAsCurl:copyAsCurl,
  copyOpenApiUrl:copyOpenApiUrl,
  displayFinder:displayFinder
};
