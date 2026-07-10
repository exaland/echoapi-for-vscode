import { useHotkeys } from "react-hotkeys-hook";
import { HotkeysEvent } from "react-hotkeys-hook/dist/types";

import { useMemoizedFn } from "ahooks";
import { assign, concat, debounce, isEqual, reduce, values } from "lodash";

import {
  APIS_HOT_KEYS_ENUM,
  COMMON_HOT_KEYS_ENUM,
  DEFAULT_APIS_HOT_KEYS_MAP,
  DEFAULT_HOT_KEYS_OPTIONS,
  SYSTEM_HOT_KEYS_SCOPES_ENUM,
} from "@/constants/hotkeys";

import { useApis } from "@/store";
import { handleHotKeysEventAction } from "@/utils/hotkeys";

const useApisHotkeys = () => {
  const mergedHotkeys = assign({}, DEFAULT_APIS_HOT_KEYS_MAP);

  const monitorHotkeys = reduce(
    values(mergedHotkeys),
    (acc: string[], prev) => {
      return concat(acc, prev);
    },
    [],
  );

  useHotkeys(
    monitorHotkeys,
    (keyboardEvent, hotkeysEvent) => {
      execFunc(hotkeysEvent);
    },
    {
      ...DEFAULT_HOT_KEYS_OPTIONS,
      scopes: [SYSTEM_HOT_KEYS_SCOPES_ENUM.APIS],
    },
  );

  const execFunc = useMemoizedFn(
    debounce((hotkeysEvent: HotkeysEvent) => {
      try {
        const action = handleHotKeysEventAction(hotkeysEvent, mergedHotkeys);

        switch (action) {
          case COMMON_HOT_KEYS_ENUM.SAVE:
            handleSave();
            break;
          case APIS_HOT_KEYS_ENUM.SEND:
            handleSend();
            break;
          default:
            break;
        }
      } catch (error) {}
    }, 200),
  );

  const handleSave = async () => {
    const { apisActiveData } = useApis.getState();

    window?.vscode.postMessage({
      action: "saveApiData",
      data: apisActiveData,
    });
  };

  const handleClose = () => {
    window?.vscode.postMessage({
      action: "closeOpenTag",
    });
  };

  const handleSend = () => {
    const { apisActiveData, updateCurrentSendingData } = useApis.getState();

    updateCurrentSendingData({ sendStatus: "sending" });
    window?.vscode.postMessage({
      action: "sendApi",
      data: apisActiveData,
    });
  };
};

export default useApisHotkeys;
