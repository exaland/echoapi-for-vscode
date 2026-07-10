import { FC, lazy, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TabPaneProps, TabsProps } from "antd";

import { useMemoizedFn, useSafeState, useUpdateEffect } from "ahooks";
import produce from "immer";
import {
  includes as _includes,
  compact,
  concat,
  forEach,
  isEmpty,
  isEqual,
  map,
  size,
} from "lodash";
import ErrorContext from './ErrorContext';

import {
  LineTabs,
  ResponseSize,
  Sending,
  SuspenseContent,
} from "@/components/business";
import { STATUS_CODE } from "@/constants/common";
import { useGlobal, useSystemConfig } from "@/store";
import { BaseResponse } from "@/types/apis/response";
import { ApiSendingData, ApiSendingDataSSE } from "@/types/apis/send";

import { Empty, Error } from "./components";

import { ResponseContainer } from "./style";

const Console = lazy(() => import("./components/Console"));
const Cookie = lazy(() => import("./components/Cookie"));
const RealRequest = lazy(() => import("./components/RealRequest"));
const Realtime = lazy(() => import("./components/Realtime"));
const ResponseHeader = lazy(() => import("./components/ResponseHeader"));

interface Props {
  responseData: BaseResponse;
  sendingData?: Partial<ApiSendingData & ApiSendingDataSSE>;
  resultIncludesTabs?: string[];
  tabsDefaultActiveKey?: string;
  includesTabs?: string[];
  extra?: TabsProps["items"];
  showDownload?: boolean;
  showProxy?: boolean;
  showExampleImport?: boolean;
  showSending?: boolean;
  onlySendingLoadingBar?: boolean;
  showResponseSize?: boolean;
  sendAfterResponseToTabDisabled?: boolean;
  onResponseDataChange: (value: BaseResponse) => void;
}

const Response: FC<Props> = memo(
  ({
    responseData,
    sendingData,
    resultIncludesTabs,
    tabsDefaultActiveKey,
    includesTabs,
    extra,
    showDownload,
    // showExampleImport,
    showProxy,
    showSending = true,
    onlySendingLoadingBar,
    showResponseSize = true,
    sendAfterResponseToTabDisabled = false,
    onResponseDataChange = () => {},
  }) => {
    const { t } = useTranslation();
    const cancelToken = useGlobal((state) => state.cancelToken);

    const [showError, setShowError] = useSafeState(false);
    const [activeKey, setActiveKey] = useSafeState(
      tabsDefaultActiveKey || "realtime"
    );

    const isSendDone = useMemo(
      () =>
        !isEmpty(sendingData?.response) &&
        isEqual(sendingData?.sendStatus, "initial"),
      [sendingData]
    );

    const isNotEmpty = useMemo(
      () =>
        isSendDone ||
        isEqual(sendingData?.sendStatus, "sending") ||
        size(sendingData?.streamResponse) > 0 ||
        !_includes(['realtime'], activeKey),
      [isSendDone, sendingData?.sendStatus, activeKey]
    );

    useUpdateEffect(() => {
      if (
        sendingData?.sendStatus === "sendError" &&
        !isEmpty(sendingData?.message)
      ) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }, [sendingData]);

    useUpdateEffect(() => {
      const { systemConfig } = useSystemConfig.getState();

      if (!isSendDone) {
        return;
      }

      // auto jump to realtime response tab
      if (
        isEqual(systemConfig.send_after_response_to_tab, STATUS_CODE.ENABLE) &&
        !sendAfterResponseToTabDisabled
      ) {
        setActiveKey("realtime");
      }

      // according to system config, whether to save result to response example after sending
      if (isEqual(systemConfig.send_after_save_example, 2)) {
        handleAutoSaveExampleRaw("1");
      } else if (isEqual(systemConfig.send_after_save_example, 3)) {
        handleAutoSaveExampleRaw("2");
      }
    }, [isSendDone, sendAfterResponseToTabDisabled]);

    const handleAutoSaveExampleRaw = (key: string) => {
      const newExample = produce(responseData?.example, (draft: any[]) => {
        forEach(draft, (item) => {
          if (isEqual(item.example_id, key)) {
            item.raw = sendingData?.response?.raw_body;
          }
        });
      });

      handleMemoizedChange({
        ...responseData,
        example: newExample,
      });
    };
    
    const originItems: Array<
      TabPaneProps & { countParams?: any; key: string; label: React.ReactNode }
    > = [
      {
        key: "realtime",
        label: t("api.run.response_tab"),
        children: (
          <Realtime
            resultIncludesTabs={resultIncludesTabs}
            sendingData={sendingData}
            responseData={responseData}
            onResponseDataChange={onResponseDataChange}
          />
        ),
      },
      {
        key: "responseHeader",
        label: t("api.run.response_header"),
        children: <ResponseHeader value={sendingData?.responseHeaders} />,
        countParams: {
          dataSource: sendingData?.responseHeaders,
        },
      },
      {
        key: "cookie",
        label: "Cookie",
        children: <Cookie value={sendingData?.cookies} />,
        countParams: {
          dataSource: sendingData?.cookies,
        },
      },
      {
        key: "realRequest",
        label: t("api.run.real_request"),
        children: <RealRequest sendingData={sendingData} />,
        countParams: {
          showDot: !isEmpty(sendingData?.request),
        },
      },
      {
        key: "console",
        label: t("api.run.console"),
        children: <Console sendingData={sendingData} />,
        countParams: {
          dataSource: sendingData?.consoleList,
        },
      },
    ];

    const tabsItems = useMemoizedFn(() => {
      const _originItems = map(originItems, (item) => ({
        ...item,
        children: (
          <SuspenseContent key={item.key}>{item.children}</SuspenseContent>
        ) as React.ReactNode,
      }));

      const mergeItems = concat([], _originItems, extra);
      const finalItems =
        size(includesTabs) > 0
          ? compact(
              map(includesTabs, (key: string) =>
                mergeItems?.find((item) => item?.key === key)
              )
            )
          : _originItems;

      return finalItems;
    });

    const handleMemoizedChange = useMemoizedFn((data) =>
      onResponseDataChange(data)
    );

    return (
      <ErrorContext.Provider value={{ showError, errorMsg: sendingData?.message || '' }}>
      <ResponseContainer>
        {sendingData?.sendStatus === "sending" && showSending && (
          <Sending
            onCancel={cancelToken}
            onlySendingLoadingBar={onlySendingLoadingBar}
          />
        )}


        {!isNotEmpty && (
          <Empty
            wrapClassName={showError ? "mask-error-mode" : undefined}
            maskMode
          />
        )}

        <LineTabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabsItems()}
          tabBarExtraContent={
            !isEmpty(sendingData) &&
            showResponseSize && (
              <ResponseSize
                showProxy={showProxy}
                showDownload={showDownload && isSendDone}
                response={sendingData?.response}
                request={sendingData?.request}
              />
            )
          }
        />
      </ResponseContainer>
      </ErrorContext.Provider>
    );
  }
);

export default Response;
