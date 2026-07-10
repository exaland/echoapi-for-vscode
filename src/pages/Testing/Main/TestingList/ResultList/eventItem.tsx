import { ResponseSize } from "@/components/business";
import HttpExecDetail from "@/components/business/HttpExecDetail";
import { IconFont } from "@/components/ui";
import PrefixIcon from "@/components/ui/PrefixIcon";
import useTheme from "@/hooks/useTheme";
import { RuntimeResponse } from "@/types/testing";
import CustomPopover from "@/components/ui/Popover";
import { Checkbox, Drawer, Flex, Tooltip, Typography } from "antd";
import { isArray, isEmpty, isString, toUpper } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomPopoverWrap } from "./style";
import { isAssertPass } from "@/utils/common";

type EventItemProps = {
  value: {
    request: any;
    response: any;
    console: any;
    assertions: any;
    status: any;
  };
  errorMessage?: string;
  iterationText?: string;
};

const EventItem = (props: EventItemProps) => {
  const { value, errorMessage, iterationText } = props;

  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { request, response, status } = value;
  const [isOpenHttpExecDetail, setIsOpenHttpExecDetail] = useState(false);
  const [httpExecDetail, setHttpExecDetail] =
    useState<RuntimeResponse | null>();

  const handleViewDetail = (item: RuntimeResponse) => {
    const detail = {
      request: item?.request,
      response: item?.response,
      console: item?.console,
      assertions: item?.assertions,
    };
    setHttpExecDetail(detail);
    setIsOpenHttpExecDetail(true);
  };

  const errorContent = (
    <CustomPopoverWrap style={{ width: 240 }}>
      {toUpper(status.http) !== "OK" && (
        <Flex vertical gap={8}>
          <Typography.Text className="error-title">
            {t("common.request_error")}
          </Typography.Text>
          <Typography.Text className="error-text">
            {status.http}
          </Typography.Text>
        </Flex>
      )}

      {isArray(status.assert) && !isEmpty(status.assert) && (
        <Flex style={{ marginTop: 8 }} vertical gap={8}>
          <Typography.Text className="error-title">
            Assertion Error
          </Typography.Text>
          {status.assert.map((i: any) => (
            <Typography.Text className="error-text">
              {i?.error?.message}
            </Typography.Text>
          ))}
        </Flex>
      )}
    </CustomPopoverWrap>
  );

  return (
    <>
      <Flex
        onClick={() => {
          handleViewDetail(value);
        }}
        justify="space-between"
        className="item-container"
      >
        <Flex style={{ marginRight: 16 }} gap={16}>
          <Checkbox
            disabled={true}
            checked={true}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <Flex gap={16}>
            <PrefixIcon type="api" method={request.method} />
          </Flex>
        </Flex>

        {request?.url && (
          <Tooltip placement="topLeft" title={request.url}>
            <Typography.Text ellipsis style={{ flex: 1 }}>
              {request.url}
            </Typography.Text>
          </Tooltip>
        )}

        <Flex gap={20} justify="flex-end" flex={1}>
          {toUpper(status.http) !== "OK" || !isAssertPass(status.assert) ? (
            <CustomPopover content={errorContent}>
              <Typography.Text
                onClick={(e) => {
                  e.stopPropagation();
                }}
                ellipsis
                style={{ color: "var(--color-error)", cursor: "pointer" }}
              >
                error
              </Typography.Text>
            </CustomPopover>
          ) : (
            <ResponseSize
              response={response}
              showIcon={false}
              showProxy={true}
              showLebelText={false}
            />
          )}
          <Typography.Text style={{ color: themeToken.fontContentColor }}>
            {iterationText}
          </Typography.Text>
          <IconFont
            type="icon-open-new-window"
            onClick={() => handleViewDetail(value)}
          />
        </Flex>
      </Flex>
      <Drawer
        maskClosable
        destroyOnClose
        title={t("supplement.api_detail")}
        width={600}
        open={isOpenHttpExecDetail}
        onClose={() => {
          setIsOpenHttpExecDetail(false);
        }}
      >
        {httpExecDetail && <HttpExecDetail httpExecDetail={httpExecDetail} />}
      </Drawer>
    </>
  );
};

export default EventItem;
