import i18next from "i18next";
import { omit } from "lodash";

import { ApiDetailsData } from "@/types/apis/api";
import { SampleGroupsDetailsData } from "@/types/apis/apiSample";
import { ApisBaseData } from "@/types/apis/base";
import { DocDetailsData } from "@/types/apis/doc";
import { FolderDetailsData } from "@/types/apis/folder";
import { GrpcDetailsData } from "@/types/apis/grpc";
import { SocketDetailsData } from "@/types/apis/socket";
import { SocketServiceDetailsData } from "@/types/apis/socketService";
import { SSEDetailsData } from "@/types/apis/sse";
import { WebsocketDetailsData } from "@/types/apis/websocket";

import {
  APIS_PRESSURE_MODE,
  APIS_TARGET_TYPE_ENUM,
  DEFAULT_API_MARK_ENUM,
} from "./index";
import {
  DEFAULT_API_REQUEST,
  DEFAULT_FOLDER_REQUEST,
  DEFAULT_WEBSOCKET_REQUEST,
  DEFAULT_WEBSOCKET2_REQUEST,
  DEFAULT_WEBSOCKET2_MESSAGE,
  DEFAULT_GRAPHQL_REQUEST,
} from "./request";
import { DEFAULT_API_RESPONSE } from "./response";
import { RequestBodyContentType } from "@/types/apis/request";
import { snowflakeId } from "apipost-tools";
import { Websocket2DetailsData } from "@/types/apis/websocket2";
import { SocketIoDetailsData } from "@/types/apis/socketio";
import { GraphQLDetailsData } from "@/types/apis/graphql";

// apis base parameters
export const DEFAULT_APIS_BASE_DATA: ApisBaseData = {
  project_id: "-1",
  target_id: "",
  parent_id: "0",
  target_type: APIS_TARGET_TYPE_ENUM.API,
  name: i18next.t("common.folder_operate.new_http") || "HTTP Request",
  sort: 0,
  version: 0,
  mark_id: DEFAULT_API_MARK_ENUM.DEVELOPING,
  status: 1,
  is_changed: -1,
  is_create: 1,
};

// api default parameters
export const DEFAULT_API_DATA: ApiDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  target_type: APIS_TARGET_TYPE_ENUM.API,
  method: "GET",
  url: "",
  request: DEFAULT_API_REQUEST,
  response: DEFAULT_API_RESPONSE,
  description: "",
  tags: [],
  ai_expect_enable: -1,
  is_check_result: 1,
  is_socket: 1,
  is_locked: -1,
  is_force: -1,
  attribute_info: {},
  protocol: "http/1.1",
  ai_expect: {
    list: [],
    none_math_expect_id: "",
  },
};

// sse default parameters
export const DEFAULT_SSE_DATA: SSEDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  target_type: APIS_TARGET_TYPE_ENUM.SSE,
  method: "POST",
  url: "",
  name: i18next.t("common.folder_operate.new_sse") || "SSE Request",
  request: DEFAULT_API_REQUEST,
  response: DEFAULT_API_RESPONSE,
  description: "",
  tags: [],
  is_socket: 1,
  is_locked: -1,
  is_force: -1,
  attribute_info: {},
};

// folder default parameters
export const DEFAULT_FOLDER_DATA: FolderDetailsData = {
  ...omit(DEFAULT_APIS_BASE_DATA, ["mark_id"]),
  name: i18next.t("supplement.folder") || "Folder",
  description: "",
  server_id: "0",
  target_type: APIS_TARGET_TYPE_ENUM.FOLDER,
  request: DEFAULT_FOLDER_REQUEST,
};

// doc default parameters
export const DEFAULT_DOC_DATA: DocDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_md"),
  target_type: APIS_TARGET_TYPE_ENUM.DOC,
  tags: [],
  attribute_info: {},
  description: "",
};

// websocket default request parameters
export const DEFAULT_WEBSOCKET_DATA: WebsocketDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_websocket"),
  target_type: APIS_TARGET_TYPE_ENUM.WEBSOCKET,
  method: "Raw",
  request: DEFAULT_WEBSOCKET_REQUEST,
  url: "",
  config: {
    information_size: 5,
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_path: "",
    shake_hands_timeout: 0,
    socket_version: "v4",
  },
};

// websocket2 default request parameters
export const DEFAULT_WEBSOCKET2_DATA: Websocket2DetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_websocket"),
  target_type: APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
  method: "",
  request: DEFAULT_WEBSOCKET2_REQUEST,
  message: [DEFAULT_WEBSOCKET2_MESSAGE],
  url: "",
  description: "",
  attribute_info: {},
  tags: [],
  config: {
    certificate_verification: -1,
    information_size: 5,
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_timeout: 0,
  },
};

// grpc default request parameters
export const DEFAULT_GRPC_DATA: GrpcDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("grpc.new_grpc.title"),
  target_type: APIS_TARGET_TYPE_ENUM.GRPC,
  description: "",
  protos: [],
  request: {
    description: "",
  },
};

// api sample default parameters
export const DEFAULT_API_SAMPLE_DATA: Omit<
  ApiDetailsData,
  "description" | "attribute_info"
> = {
  ...DEFAULT_APIS_BASE_DATA,
  ai_expect_enable: -1,
  name: i18next.t("common.folder_operate.new_testcase"),
  target_type: APIS_TARGET_TYPE_ENUM.API_SAMPLE,
  method: "GET",
  url: "",
  request: DEFAULT_API_REQUEST,
  response: DEFAULT_API_RESPONSE,
  is_check_result: 1,
  is_force: -1,
  is_socket: 1,
  is_locked: -1,
  protocol: "http/1.1",
  ai_expect: {
    list: [],
    none_math_expect_id: "",
  },
};

// api sample group default parameters
export const DEFAULT_API_SAMPLE_GROUP_DATA: SampleGroupsDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_group"),
  group_id: "",
  target_type: APIS_TARGET_TYPE_ENUM.API_SAMPLE_GROUP,
};

// tcp service default parameters
export const DEFAULT_SOCKET_SERVICE_DATA: SocketServiceDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_tcp_client"),
  method: "TCP",
  target_type: APIS_TARGET_TYPE_ENUM.SOCKET,
  description: "",
  url: "",
  request: {
    timeout: 10,
    end_func: {
      name: "none",
      option: "",
    },
  },
};

// tcp default parameters
export const DEFAULT_SOCKET_DATA: SocketDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_tcp_method"),
  method: "TCP",
  target_type: APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
  description: "",
  request: {
    body: {
      mode: "xml",
      parameter: [],
      raw: "",
      raw_parameter: [],
      raw_schema: {
        type: "object",
      },
    },
    post_tasks: [],
    configs: {
      charset: "utf8",
      func: {
        request: [],
        response: [],
      },
    },
  },
  response: DEFAULT_API_RESPONSE,
  is_exampled: -1,
  is_locked: -1,
  tags: [],
};

// One-click stress test default parameters
export const DEFAULT_PRESSURE_DATA = {
  use_pressure_data: false,
  test_data_path: "",
  concurrency: 1,
  mode: APIS_PRESSURE_MODE.COUNT,
  count: 1,
  duration: 100,
  log_type: 0,
};

export const INIT_DEFAULT_API_DATAS = [
  { ...DEFAULT_FOLDER_DATA, name: "Samples" },
  {
    ...DEFAULT_API_DATA,
    name: "Create a new user",
    method: "POST",
    url: "https://rest.echoapi.com/users",
    request: {
      ...DEFAULT_API_REQUEST,
      body: {
        ...DEFAULT_API_REQUEST.body,
        mode: "json" as RequestBodyContentType,
        raw: `{
	"id": 0,
	"username": "echo api",
	"firstName": "Echo",
	"lastName": "Api",
	"email": "support@echoapi.com",
	"password": "12345",
	"phone": "",
	"userStatus": 0
}`,
      },
    },
  },
  {
    ...DEFAULT_API_DATA,
    name: "Get user info",
    method: "GET",
    url: "https://rest.echoapi.com/users/{username}",
    request: {
      ...DEFAULT_API_REQUEST,
      restful: {
        parameter: [
          {
            param_id: snowflakeId(),
            field_type: "String",
            is_checked: 1,
            key: "username",
            not_null: 1,
            value: "echo api",
            description: "",
          },
        ],
      },
    },
  },
  {
    ...DEFAULT_API_DATA,
    name: "Update user info",
    method: "PUT",
    url: "https://rest.echoapi.com/users/{username}",
    request: {
      ...DEFAULT_API_REQUEST,
      restful: {
        parameter: [
          {
            param_id: snowflakeId(),
            field_type: "String",
            is_checked: 1,
            key: "username",
            not_null: 1,
            value: "echo api",
            description: "",
          },
        ],
      },
      body: {
        ...DEFAULT_API_REQUEST.body,
        mode: "json" as RequestBodyContentType,
        raw: `{
	"id": 0,
	"username": "",
	"firstName": "Tom",
	"lastName": "",
	"email": "",
	"password": "",
	"phone": "",
	"userStatus": 0
}`,
      },
    },
  },
  {
    ...DEFAULT_API_DATA,
    name: "Delete user",
    method: "DELETE",
    url: "https://rest.echoapi.com/users/{username}",
    request: {
      ...DEFAULT_API_REQUEST,
      restful: {
        parameter: [
          {
            param_id: snowflakeId(),
            field_type: "String",
            is_checked: 1,
            key: "username",
            not_null: 1,
            value: "echo api",
            description: "",
          },
        ],
      },
    },
  },
  {
    ...DEFAULT_SSE_DATA,
    name: "SSE",
    url: "https://rest.echoapi.com/sse",
    method: "POST",
  },
];

export const DEFAULT_SOCKETIO_REQUEST = {
  cookie: {
    parameter: [],
  },
  header: {
    parameter: [],
  },
  query: {
    parameter: [],
  },
  event: {
    parameter: [],
  },
};
export const DEFAULT_SOCKETIO_MESSAGE = {
  name: i18next.t("supplement.msg"),
  param_id: snowflakeId(),
  request: {
    mode: "text",
    raw: "",
    raw_parameter: [],
    raw_schema: { type: "object" },
  },
  response: {
    mode: "text",
    raw: "",
    raw_parameter: [],
    raw_schema: { type: "object" },
  },
};

// socketio default request parameters
export const DEFAULT_SOCKETIO_DATA: SocketIoDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  name: i18next.t("supplement.new_socketio"),
  target_type: APIS_TARGET_TYPE_ENUM.SOCKETIO,
  method: "",
  request: DEFAULT_SOCKETIO_REQUEST,
  message: [DEFAULT_SOCKETIO_MESSAGE],
  url: "",
  description: "",
  attribute_info: {},
  tags: [],
  config: {
    reconnect_num: 5,
    reconnect_time: 5000,
    shake_hands_path: "/socket.io",
    shake_hands_timeout: 0,
    socket_version: "v4",
    certificate_verification: -1,
  },
};

export const DEFAULT_GRAPHQL_DATA: GraphQLDetailsData = {
  ...DEFAULT_APIS_BASE_DATA,
  target_type: APIS_TARGET_TYPE_ENUM.GRAPHQL,
  name: i18next.t("common.folder_operate.new_graphql"),
  request: DEFAULT_GRAPHQL_REQUEST,
  response: DEFAULT_API_RESPONSE,
  description: "",
  tags: [],
  is_socket: 1,
  is_locked: -1,
  attribute_info: {},
  is_force: -1,
  url: "",
  is_check_result: 1,
};
