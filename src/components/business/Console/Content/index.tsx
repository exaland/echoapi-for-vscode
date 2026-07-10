import ReactJson from "react-json-view";

import { Flex } from "antd";

import aptTools from "apipost-tools";
import {
  includes,
  isArray,
  isEqual,
  isNumber,
  isPlainObject,
  map,
} from "lodash";

import IconFont from "@/components/ui/IconFont";
import { useSystemConfig } from "@/store";
import { ApiSendResponseDataConsoleItem } from "@/types/apis/send";

import { ConsoleContentProps } from "../types";

import { ConsoleContentWrapper, ConsoleItemWrap } from "./style";
import { formatTime, TIME_FORMAT } from "@/utils/time";

const CONSOLE_LEVEL_ICON_MAP: Partial<{ [x in keyof Console]: string }> = {
  error: "icon-hollow-warn",
  warn: "icon-attention",
} as const;

const ConsoleContent = (props: ConsoleContentProps) => {
  const { consoleList } = props;
  const { bg_color } = useSystemConfig((state) => state?.systemConfig);

  const computedContent = (
    argsItem: any,
    level: ApiSendResponseDataConsoleItem["level"]
  ) => {
    if (isEqual(level, "error") && isPlainObject(argsItem)) {
      return String(argsItem?.errorMessage);
    }

    if (
      isPlainObject(argsItem) ||
      aptTools.isJson(argsItem) ||
      isArray(argsItem)
    ) {
      try {
        const result = aptTools.isJson(argsItem)
          ? JSON.parse(argsItem)
          : argsItem;

        return (
          <ReactJson
            src={result}
            theme={
              ["white", "orange"].includes(bg_color)
                ? "rjv-default"
                : "eighties"
            }
            style={{ backgroundColor: "transparent", fontFamily: "inherit" }}
            indentWidth={2}
            name={false}
            collapsed
            displayObjectSize={false}
            displayDataTypes={false}
            enableClipboard={false}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            displayArrayKey={false}
          />
        );
      } catch {
        return String(argsItem);
      }
    }

    return String(argsItem);
  };

  return (
    <ConsoleContentWrapper>
      {map(consoleList, (consoleItem, consoleIndex) => (
        <ConsoleItemWrap
          key={`${consoleItem.level}-${consoleIndex}`}
          className={consoleItem.level}
        >
          <div className="time">
            {isNumber(consoleItem.time)
              ? formatTime(consoleItem.time, TIME_FORMAT.TIME_L)
              : consoleItem.time}
          </div>
          {includes(["warn", "error"], consoleItem.level) && (
            <IconFont type={CONSOLE_LEVEL_ICON_MAP[consoleItem.level] || ""} />
          )}
          <Flex>
            {map(consoleItem.args, (argsItem, argsIndex) => {
              return (
                <div className="console-item-content" key={argsIndex}>
                  {computedContent(argsItem, consoleItem.level)}
                </div>
              );
            })}
          </Flex>
        </ConsoleItemWrap>
      ))}
    </ConsoleContentWrapper>
  );
};

export default ConsoleContent;
