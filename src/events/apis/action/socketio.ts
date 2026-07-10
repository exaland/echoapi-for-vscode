import i18next from 'i18next';

import { ApisItemActionType } from '@/types/apis/other';

export const cloneSocketIo = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: 'cloneApi',
    data: {
      target_id:apisData.target_id
    }
  });
};

export const deleteSocketIo = (params: ApisItemActionType) => {
  const { apisData } = params;
  window?.vscode.postMessage({
    action: 'showConfirmation',
    data: {
      title:i18next.t('supplement.sure_del', { arg: apisData.name }),
      target_id:apisData.target_id
    }
  });
};

export const editSocketIo = (params: ApisItemActionType) => {
  const { apisData, tabsValue } = params;
  
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
  clone: cloneSocketIo,
  delete: deleteSocketIo,
  edit:editSocketIo,
  displayFinder:displayFinder
};
