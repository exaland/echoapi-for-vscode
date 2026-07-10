import i18next from "i18next";
import { concat, map, omit } from "lodash";
import {
  APIS_CREATE_ITEM_OTHER_ENUM,
  APIS_MORE_OPERATE_ENUM,
  APIS_TARGET_TYPE_ENUM,
} from "@/constants/apis";

import { ApisCreateList, ApisCreateListItem } from "@/types/apis/api";
import { MenuProps } from "antd";

const TREE_TITLE = [
  i18next.t("common.folder_operate.new_http_request"),
  i18next.t("common.folder_operate.new_sse_request"),
  i18next.t("common.folder_operate.new_graphql"),
  i18next.t("common.folder_operate.new_websocket"),
  i18next.t("common.folder_operate.new_socketio"),
];

const APIS_CREATE_LIST: ApisCreateList = [
  {
    key: APIS_TARGET_TYPE_ENUM.API,
    icon: "icon-api",
    gradientColor: ["#F6504B", "#F98E8B"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.SSE,
    icon: "icon-label-sse",
    gradientColor: ["#65e0ff", "#50cfea"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.GRAPHQL,
    icon: "icon-GraphQL",
    gradientColor: ["#F6009B", "#FF64C6"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
    icon: "icon-label-ws",
    gradientColor: ["#FFC70E", "#FFDC69"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.SOCKETIO,
    icon: "icon-label-socketio",
    gradientColor: ["#25C2A0", "#50CEB3"],
  },
];

const OTHER_CREATE_ITEM: ApisCreateList = [
  {
    type: "divider",
  },
  {
    key: APIS_TARGET_TYPE_ENUM.FOLDER,
    icon: "icon-add-folder",
    label: i18next.t("common.folder_operate.new_folder"),
  },
  {
    key: APIS_CREATE_ITEM_OTHER_ENUM.IMPORT_DATA,
    label: i18next.t("settings.import_project.title"),
    icon: "icon-import",
  },
  {
    key: APIS_CREATE_ITEM_OTHER_ENUM.EXPORT_DATA,
    label: i18next.t("settings.export_project.title"),
    icon: "icon-export",
  },
];

export const TREE_CREATE_LIST = concat(
  map(TREE_TITLE, (item, index) => ({
    ...APIS_CREATE_LIST[index],
    label: item,
    className: "beautify-tree-create-title",
    icon: APIS_CREATE_LIST[index]?.icon as string,
    gradientColor:
      (APIS_CREATE_LIST[index] as ApisCreateListItem)?.gradientColor || [],
  })),
  OTHER_CREATE_ITEM,
);

export const API_TYPE_INCLUDES: string[] = [
  APIS_TARGET_TYPE_ENUM.FOLDER,
  APIS_TARGET_TYPE_ENUM.API,
  APIS_TARGET_TYPE_ENUM.SSE,
  APIS_TARGET_TYPE_ENUM.DOC,
  APIS_TARGET_TYPE_ENUM.WEBSOCKET,
  APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
  APIS_TARGET_TYPE_ENUM.SOCKETIO,
  APIS_TARGET_TYPE_ENUM.GRPC,
  APIS_TARGET_TYPE_ENUM.SOCKET,
  APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
  APIS_TARGET_TYPE_ENUM.GRAPHQL,
  "model",
];

export const FOLDER_TYPE_INCLUDES: string[] = [
  APIS_TARGET_TYPE_ENUM.FOLDER,
  APIS_TARGET_TYPE_ENUM.SOCKET,
];

export const APIS_FOLDER_ADD_LIST = concat(
  [],
  map(TREE_TITLE, (item, index) => ({
    ...omit(APIS_CREATE_LIST[index], ["gradientColor", "icon"]),
    label: item,
    icon: APIS_CREATE_LIST[index]?.icon as string,
    gradientColor:
      (APIS_CREATE_LIST[index] as ApisCreateListItem)?.gradientColor || [],
  })),
  [
    {
      key: APIS_TARGET_TYPE_ENUM.FOLDER,
      label: i18next.t("common.folder_operate.new_subfolder"),
      icon: "icon-add-folder",
    },
  ] as any,
) as MenuProps["items"];

export const DESIGN_APIS_FOLDER_ADD_LIST = concat(
  [],
  map([TREE_TITLE[0]], (item, index) => ({
    ...omit(APIS_CREATE_LIST[index], ["gradientColor", "icon"]),
    label: item,
    icon: APIS_CREATE_LIST[index]?.icon as string,
    gradientColor:
      (APIS_CREATE_LIST[index] as ApisCreateListItem)?.gradientColor || [],
  })),
  [
    {
      key: APIS_TARGET_TYPE_ENUM.FOLDER,
      label: i18next.t("common.folder_operate.new_subfolder"),
      icon: "icon-add-folder",
    },
  ] as any,
) as MenuProps["items"];

export const APIS_FOLDER_OPERATE_LIST = [
  {
    key: APIS_TARGET_TYPE_ENUM.API,
    label: i18next.t("common.folder_operate.new_http_request"),
    icon: "icon-api",
    gradientColor: ["#F6504B", "#F98E8B"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.SSE,
    label: i18next.t("common.folder_operate.new_sse_request"),
    icon: "icon-label-sse",
    gradientColor: ["#65e0ff", "#50cfea"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.GRAPHQL,
    label: i18next.t("common.folder_operate.new_graphql"),
    icon: "icon-GraphQL",
    gradientColor: ["#F6009B", "#FF64C6"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
    label: i18next.t("common.folder_operate.new_websocket"),
    icon: "icon-label-ws",
    gradientColor: ["#FFC70E", "#FFDC69"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.SOCKETIO,
    label: i18next.t("common.folder_operate.new_socketio"),
    icon: "icon-label-socketio",
    gradientColor: ["#25C2A0", "#50CEB3"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.FOLDER,
    label: i18next.t("common.folder_operate.new_subfolder"),
    icon: "icon-add-folder",
  },
  {
    type: "divider",
  },

  {
    key: APIS_MORE_OPERATE_ENUM.RUN,
    icon: "icon-tests",
    label: i18next.t("common.folder_operate.run_all"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.REPORT,
    icon: "icon-history",
    label: i18next.t("common.folder_operate.history_report"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },

  {
    key: APIS_MORE_OPERATE_ENUM.EDITDATA,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.settings"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },

  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    icon: "icon-trash",
    label: i18next.t("common.folder_operate.delete"),
  },
];

export const DESIGN_APIS_FOLDER_OPERATE_LIST = [
  {
    key: APIS_TARGET_TYPE_ENUM.API,
    label: i18next.t("common.folder_operate.new_http_request"),
    icon: "icon-api",
    gradientColor: ["#F6504B", "#F98E8B"],
  },
  {
    key: APIS_TARGET_TYPE_ENUM.FOLDER,
    label: i18next.t("common.folder_operate.new_subfolder"),
    icon: "icon-add-folder",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },

  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },

  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    icon: "icon-trash",
    label: i18next.t("common.folder_operate.delete"),
  },
];

export const SOCKET_SERVICE_FOLDER_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.ADD,
    label: i18next.t("common.folder_operate.new_TCPMethod"),
    icon: "icon-add-folder",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.COPY,
    label: i18next.t("common.folder_operate.copy"),
    icon: "icon-copy",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const SOCKET_METHOD_FOLDER_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const SSE_METHOD_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const WEBSOCKET2_METHOD_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const SOCKETIO_METHOD_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const DESIGN_APIS_MORE_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.COPYOPENAPIURL,
    label: i18next.t("common.folder_operate.copy_openapi"),
    icon: "icon-copy",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const APIS_MORE_OPERATE_LIST = [
  {
    key: APIS_MORE_OPERATE_ENUM.CLONE,
    label: i18next.t("common.folder_operate.clone"),
    icon: "icon-clone",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.COPYASCURL,
    label: i18next.t("common.folder_operate.copy_curl"),
    icon: "icon-copy",
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DISPLAYFINDER,
    icon: "icon-dakaiwenjianziyuanguanliqi",
    label: window?.isMac
      ? i18next.t("common.folder_operate.reveal_finder")
      : i18next.t("common.folder_operate.reveal_folder"),
  },
  {
    type: "divider",
  },
  {
    key: APIS_MORE_OPERATE_ENUM.EDIT,
    icon: "icon-edit",
    label: i18next.t("common.folder_operate.rename"),
  },
  {
    key: APIS_MORE_OPERATE_ENUM.DELETE,
    label: i18next.t("common.folder_operate.delete"),
    icon: "icon-trash",
  },
];

export const DEFAULT_NO_DRAG_INCLUDES_KEYS = [
  "tree-top-node-wrap",
  "tree-bottom-node-key",
] as const;

export enum DROP_POSITION_ENUM {
  INSIDE = 0,
  TOP = -1,
  BOTTOM = 1,
}

export const DEFAULT_CALC_CHILDREN_COUNT_TYPES = [
  APIS_TARGET_TYPE_ENUM.FOLDER,
  APIS_TARGET_TYPE_ENUM.SOCKET,
  APIS_TARGET_TYPE_ENUM.API_SAMPLE_GROUP,
];
