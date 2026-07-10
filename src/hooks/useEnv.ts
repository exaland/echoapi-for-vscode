import { useProjectConfig, useStorage, useUserConfig } from "@/store";
import { AuthOauth2 } from "@/types/apis/auth";
import { message } from "antd";
import produce from "immer";
import { cloneDeep, isPlainObject, isString, setWith } from "lodash";
import { useTranslation } from "react-i18next";

const useEnv = () => {
  const { t } = useTranslation();

  const handleSetToken = (data: any) => {
    const { updateGlobalParams, globalParams } = useProjectConfig.getState();
    const { oauthRefreshData, updateOauthRefreshData } = useStorage.getState();
    const { uid } = useUserConfig.getState().userInfo;
    if (data?.access_token) {
      message.success(t("common.auth.get_access_success"));

      if (globalParams) {
        const newData = produce(globalParams, (draft) => {
          draft.auth = {
            ...draft.auth,
            oauth2: {
              ...((draft.auth?.oauth2 || {}) as AuthOauth2),
              access_token: isString(data?.access_token)
                ? data?.access_token
                : JSON.stringify(data?.access_token),
            },
          };
        });
        updateGlobalParams?.(newData);
      }
    } else {
      message.error(t("common.auth.get_access_fail"));
    }
    if (data?.refresh_token) {
      const newOauthRefreshData = cloneDeep(oauthRefreshData);
      setWith(
        newOauthRefreshData,
        [uid, globalParams?.auth?.oauth2?.clientId || ""],
        data,
        Object,
      );
      updateOauthRefreshData(newOauthRefreshData);
    }
  };

  const handleProxyFetchResult = (event: {
    code: number;
    data: any;
    error: string;
  }) => {
    const { code, data, error } = event;
    if (code !== 200 || !isPlainObject(data)) {
      message.error(t("common.auth.get_access_fail"));
      return;
    }
    handleSetToken(data);
  };

  return {
    handleProxyFetchResult,
  };
};

export default useEnv;
