import { memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Flex, Switch, SwitchProps } from "antd";

import { useMount, useSafeState } from "ahooks";
import {
  find,
  head,
  isEqual,
  isNull,
  isPlainObject,
  isUndefined,
  map,
} from "lodash";

import Dot from "@/components/ui/Dot";
import useTheme from "@/hooks/useTheme";
import { BaseResponse } from "@/types/apis/response";
import { ApiSendingData } from "@/types/apis/send";
import { ChangeFuncType } from "@/types/common";
import { parseStreamToRaw } from "@/utils/parse";

import AssertList from "./components/AssertList";
import BodyList from "./components/BodyList";
import ScriptError from "./components/ScriptError";
import { getTestAssertResult } from "./utils";

import { ResponseAssertionContainer } from "./style";

type AssertResult = {
  result: boolean;
  assertList: Array<{
    result: boolean;
    expect: string;
  }>;
};

interface Props {
  showAssertTitle?: boolean;
  sendingData?: Partial<ApiSendingData>;
  responseDataExample?: BaseResponse["example"];
  responseDataIsCheckResult?: BaseResponse["is_check_result"];
  onChange?: ChangeFuncType<BaseResponse>;
}

const Assert: React.FC<Props> = memo(
  ({
    showAssertTitle = true,
    sendingData = {},
    responseDataExample,
    responseDataIsCheckResult,
    onChange,
  }) => {
    const { t } = useTranslation();

    const [selectExpect, setSelectExpect] = useSafeState("1");
    const [assertResult, setAssertResult] = useSafeState<AssertResult>({
      result: true,
      assertList: [],
    });

    const rawBody = useMemo(() => {
      return !isUndefined(sendingData?.response?.stream?.data) &&
        isPlainObject(sendingData?.response?.mime_type)
        ? parseStreamToRaw(
            sendingData?.response?.stream?.data,
            sendingData?.response?.mime_type,
            "utf8",
          )
        : sendingData?.response?.raw_body;
    }, [sendingData]);

    const tempResponse = useMemo(() => {
      const result = sendingData?.response;

      if (result && isPlainObject(result)) {
        result.raw_body = rawBody;
      }

      return result;
    }, [sendingData?.response]);

    const expectData = useMemo(
      () =>
        find(responseDataExample, (item) => item.example_id === selectExpect)
          ?.expect,
      [responseDataExample, selectExpect],
    );

    useEffect(() => {
      if (expectData && tempResponse) {
        getTestAssertResult(expectData, tempResponse).then((assertData) => {
          setAssertResult(assertData);
        });
      }
    }, [expectData, tempResponse]);

    const isSuccess = isNull(assertResult?.result)
      ? true
      : assertResult?.result;

    const expectOptions = useMemo(
      () =>
        map(responseDataExample, (item) => ({
          label: t("common.test_component.verify", {
            name: item?.expect?.name,
          }),
          value: item?.example_id,
        })),
      [responseDataExample],
    );

    useMount(() => {
      const firstExampleId = head(expectOptions)?.value;

      if (firstExampleId && !isEqual(firstExampleId, "1")) {
        setSelectExpect(firstExampleId);
      }
    });

    const handleSwitchChange: SwitchProps["onChange"] = (checked) => {
      onChange?.("is_check_result", checked ? 1 : -1);
    };

    return (
      <ResponseAssertionContainer>
        {showAssertTitle && (
          <div className="assert-title">
            <Flex
              style={{ color: "var(--font-content-color)" }}
              align="center"
              gap={8}
            >
              <Dot type={isSuccess ? "success" : "error"} />
              {t("common.test_component.title")}
              <Switch
                size="small"
                checked={isEqual(responseDataIsCheckResult, 1)}
                onChange={handleSwitchChange}
              />
            </Flex>
          </div>
        )}
        <div className="assert-pot">
          {responseDataIsCheckResult && responseDataIsCheckResult > 0 && (
            <>
              <div className="assert-content">
                <ScriptError sendingData={sendingData} />
              </div>
              <div className="assert-content">
                <BodyList
                  {...{
                    isSuccess,
                    errList: assertResult?.assertList || [],
                  }}
                />
              </div>
              <div className="assert-content">
                <AssertList asserts={sendingData?.asserts} />
              </div>
            </>
          )}
        </div>
      </ResponseAssertionContainer>
    );
  },
);

export default Assert;
