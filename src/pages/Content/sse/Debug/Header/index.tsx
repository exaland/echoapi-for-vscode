import { API_METHODS } from "@/constants/common";
import { ApiComponentType } from "@/types/apis/api";
import { AnyObject } from "@/types/common";
import { Button, Flex } from "antd";
import produce from "immer";
import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { isArray, isEqual } from "lodash";
import { genQueryByUrl, genRestfulByUrl } from "@/utils/apis";
import UrlGroup from "@/components/business/UrlGroup";
import { useApis } from "@/store";
import { HeaderContainer } from "./style";
import { snowflakeId } from "apipost-tools";

const Header: FC<ApiComponentType> = ({ apisData, onApisDataChange, type }) => {
  const { t } = useTranslation();
  const currentSendingData = useApis((state) => state.currentSseSendingData);
  const updateCurrentSendingData = useApis(
    (store) => store.updateCurrentSseSendingData
  );

  const [curServerId, SetCurServerId] = useState("");

  const handleChange = (key: string, value: string) => {
    onApisDataChange(
      produce(apisData, (draft: AnyObject) => {
        draft[key] = value;
        if (key === "url") {
          if (isArray(draft?.request?.query?.parameter)) {
            draft.request.query.parameter = genQueryByUrl(
              `${value}`,
              draft?.request?.query?.parameter || []
            );
          }

          if (isArray(draft?.request?.restful?.parameter)) {
            draft.request.restful.parameter = genRestfulByUrl(
              `${value}`,
              draft?.request?.restful?.parameter || []
            );
          }
        }
      })
    );
  };
  const isSending = isEqual(currentSendingData?.sendStatus, "sending");

  const handleSend = (option?: { server_id: string }) => {
    // Reset before sending

    updateCurrentSendingData({
      target_id: apisData?.target_id,
      sendStatus: "sending",
      streamResponse: [
        {
          action: "connect",
          id: snowflakeId(),
          data: apisData.url,
          error: null,
          msg: "success",
        },
      ],
    });

    window?.vscode.postMessage({
      action: "sendSse",
      data: apisData,
      option: {
        server_id: curServerId,
        ...option,
      },
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Disable Enter key send when using modifier shortcuts
    const ctrlDown = event.metaKey || event.ctrlKey;
    if (event?.keyCode === 13 && !ctrlDown) {
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const urlGroupData = useMemo(
    () => ({
      url: apisData.url,
      method: apisData.method,
      protocol: apisData.protocol,
    }),
    [apisData]
  );

  const handleStop = () => {
    // Terminate send thread
    window?.vscode.postMessage({
      action: "stopSendApi",
    });

    const newCurApiSendingDataSSE = produce(currentSendingData, (draft) => {
      draft.target_id = apisData.target_id;
      draft.sendStatus = "initial";
      draft.streamResponse?.push({
        action: "disconnect",
        data: apisData.url,
        error: null,
        msg: "success",
        id: snowflakeId(),
      });
    });

    updateCurrentSendingData(newCurApiSendingDataSSE);
  };

  return (
    <HeaderContainer>
      <UrlGroup
        className="url-group-wrap"
        type={type || "sse"}
        maxLength={10240}
        data={urlGroupData}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        curServerId={curServerId}
        SetCurServerId={SetCurServerId}
        style={{
          paddingRight: "0",
        }}
        urlGroupExtraContent={
          <Button
            type="primary"
            size="middle"
            onClick={() => (isSending ? handleStop() : handleSend())}
            style={{ padding: 0, fontSize: "13px", borderRadius: "0 4px 4px 0",marginLeft:'4px' }}
          >
            {isSending ? `${t("api.run.close_connection")}` : t("api.run.send")}
          </Button>
        }
      />
      <Flex gap={4} align="center">
        <Button
          type="default"
          size="middle"
          onClick={() => {
            window?.vscode.postMessage({
              action: "saveApiData",
              data: apisData,
            });
          }}
          style={{ padding: 0, fontSize: "13px" }}
        >
          {t("api.run.save")}
        </Button>
      </Flex>
    </HeaderContainer>
  );
};

export default Header;
