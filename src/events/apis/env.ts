import { useProjectConfig } from "@/store";
import { EnvListItem, ServerItem } from "@/types/envManage";
import { message } from "antd";
import { snowflakeId } from "apipost-tools";
import i18next from "i18next";
import produce from "immer";
import { find, forEach, sortBy } from "lodash";

export const copyEnv = async ({ env_id, project_id }: { env_id: string; project_id: string }) => {
  const { envList, updateEnvList } = useProjectConfig.getState();

  const data = envList?.find((e) => e.env_id === env_id) as unknown as EnvListItem;
  try {
    const p = {
      ...data,
      sort: envList.reduce((max, obj) => (obj?.sort || 0) > max ? (obj?.sort || 0) : max, 0),
      env_id:snowflakeId(),
      name: `${data?.name}${i18next.t('supplement.duplicate')}`,
    };
    updateEnvList([...envList, { ...p, is_private: -1 }]);
    saveProjectConfig("envList",[...envList, { ...p, is_private: -1 }])
    message.success('Success');
  } catch (err) {
    /* empty */
  }
};


export const updateEnvServerList = async (serverList: ServerItem[]) => {
  try {
    const { updateEnvList, envList } = useProjectConfig.getState();
    const _serverList = sortBy(serverList, ['sort']);

    const newEnvList = produce(envList, (draft) => {
      forEach(draft, (_, index) => {
        draft[index].server_list = _serverList?.map((serverItem) => ({
          ...serverItem,
          uri:
            find(draft[index]?.server_list, (v) => v?.server_id === serverItem.server_id)?.uri ||
            '',
        }));
      });
    });

    updateEnvList(newEnvList);
    saveProjectConfig('envList',newEnvList);
   
  } catch (err) {
    // err
  }
};

export const saveProjectConfig = (key: any, value: any)=>{
  window?.vscode.postMessage({
    action: 'setProjectConfig',
    data: { key, value }
  });
};

export const openEnvPage = (data?:any)=>{
  window?.vscode.postMessage({
    action: 'openEnv',
    data
  });
};

export const getProjectConfig = ()=>{
  window?.vscode.postMessage({
    action: 'getProjectConfig',
  });
};