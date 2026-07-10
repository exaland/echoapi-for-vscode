import {
  cloneDeep,
  forEach,
  isArray,
  isEqual,
  isPlainObject,
  isString,
  setWith,
  trim,
} from "lodash";

import useWebsocket2Store from "@/store/useApis/websocket2";

import { getWs2SendOptions } from "./utils";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useApis, useStorage, useUserConfig } from "@/store";
import produce from "immer";
import { AuthOauth2 } from "@/types/apis/auth";

const useWebsocket2 = () => {
  const { t } = useTranslation();
  const updatePool = (
    target_id: string,
    type: "connect" | "connecting" | "disconnect",
    data: any,
    responseData?: any,
  ) => {
    const { websocket2ConnectionPool, updateWebsocket2ConnectionPool } =
      useWebsocket2Store.getState();
    if (data) {
      const newRes = {
        ...data,
      };
      updateWebsocket2ConnectionPool({
        ...websocket2ConnectionPool,
        [target_id]: {
          status: type,
          socketRes: [
            ...(websocket2ConnectionPool?.[target_id]?.socketRes || []),
            newRes,
          ],
          responseData: {
            ...websocket2ConnectionPool?.[target_id]?.responseData,
            ...(responseData || {}),
          },
        },
      });
    }
  };
  const connectWebSocket = async (
    ITarget: any,
    status: string,
    temporaryServerId: string,
  ) => {
    const target = cloneDeep(ITarget);

    if (["connecting", "connect"].includes(status)) {
      // Disconnect
      window?.vscode.postMessage({
        action: "socketio_disconnect",
        data: target?.target_id,
      });
      updatePool(target?.target_id, "disconnect", {});
      return false;
    }

    // WebSocket connection preprocessing
    const options = await getWs2SendOptions(target, temporaryServerId);
    const updateWebsocket2ConnectionPool =
      useWebsocket2Store.getState().updateWebsocket2ConnectionPool;
    const _websocket2ConnectionPool =
      useWebsocket2Store.getState().websocket2ConnectionPool;
    updateWebsocket2ConnectionPool({
      ..._websocket2ConnectionPool,
      [target?.target_id]: {
        status: "connecting",
        socketRes:
          _websocket2ConnectionPool[target?.target_id]?.socketRes || [],
      },
    });

    // WebSocket connection request
    window?.vscode.postMessage({
      action: "socketio_connect",
      data: {
        option: options,
        target,
      },
    });
  };

  const handelSocketIoResult = (event: any) => {
    const { message, target_id, target } = event;
    switch (event?.action) {
      case "connected":
        if (message?.isSuccess) {
          updatePool(
            target_id,
            "connect",
            {
              action: "connect",
              message,
            },
            message?.actualRequestParas,
          );
          forEach(target?.request?.event?.parameter, (item: any) => {
            if (isEqual(item?.value, "1") && trim(item?.key) !== "") {
              updatePool(target_id, "connect", {
                action: "listen",
                message: item?.key,
              });
            }
          });
        } else {
          // Only write when connected
          const websocket2ConnectionPool =
            useWebsocket2Store.getState().websocket2ConnectionPool;
          if (websocket2ConnectionPool?.[target_id]?.status === "connect") {
            updatePool(target_id, "disconnect", {
              action: "error",
              message: message,
            });
          }
        }
        break;
      case "received":
        const { type, isSuccess } = message || {};
        if (isEqual(type, "close") || isEqual(type, "disconnect")) {
          updatePool(target_id, "disconnect", {
            action: isSuccess ? "disconnect" : "error",
            message: message,
          });
          return;
        }
        updatePool(target_id, "connect", {
          action: type,
          message: message,
        });

        break;
      case "error":
        updatePool(target_id, "disconnect", {
          action: "error",
          message: message,
        });

        break;
      case "updateEvent":
        if (isArray(message?.removedEvents)) {
          forEach(message.removedEvents, (k: string) => {
            updatePool(target_id, "connect", {
              action: "listen-end",
              message: k,
            });
          });
        }
        if (isArray(message?.addedEvents)) {
          forEach(message.addedEvents, (k: string) => {
            updatePool(target_id, "connect", {
              action: "listen",
              message: k,
            });
          });
        }
        break;
      default:
        break;
    }
  };

  const handleSetToken = (data: any) => {
    const { updateApisActiveData, apisActiveData } = useApis.getState();
    const { oauthRefreshData, updateOauthRefreshData } = useStorage.getState();
    const { uid } = useUserConfig.getState().userInfo;
    if (data?.access_token) {
      message.success(t("common.auth.get_access_success"));

      if (apisActiveData) {
        const newData = produce(apisActiveData, (draft) => {
          draft.request.auth = {
            ...draft.request.auth,
            oauth2: {
              ...((draft.request.auth?.oauth2 || {}) as AuthOauth2),
              access_token: isString(data?.access_token)
                ? data?.access_token
                : JSON.stringify(data?.access_token),
            },
          };
        });
        updateApisActiveData?.(newData);
      }
    } else {
      message.error(t("common.auth.get_access_fail"));
    }
    if (data?.refresh_token) {
      const newOauthRefreshData = cloneDeep(oauthRefreshData);
      setWith(
        newOauthRefreshData,
        [uid, apisActiveData?.request?.auth?.oauth2?.clientId || ""],
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
    connectWebSocket,
    updatePool,
    handelSocketIoResult,
    handleProxyFetchResult,
  };
};

export default useWebsocket2;
