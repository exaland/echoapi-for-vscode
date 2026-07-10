import { AnyObject } from '../common';
import { JSONSchemaObject } from '../jsonSchema';
import { ApisBaseData, ApisBaseDataItem } from './base';

export interface Websocket2Config {
  // Max receivable content size in MB, 0 means unlimited
  information_size: number;
  // Max reconnect attempts when connection drops unexpectedly
  reconnect_num: number;
  // Reconnect interval in milliseconds
  reconnect_time: number;
  // Server path to use during handshake
  // Connection timeout in ms, 0 means no timeout
  shake_hands_timeout: number;
  certificate_verification: 1 | -1;
  // Backend event listener list
}
export interface MessageItem {
  param_id: string;
  name: string;
  request: {
    mode: any;
    raw: string;
    raw_parameter: Array<ApisBaseDataItem>;
    raw_schema: any;
  };
  response: {
    mode: any;
    raw: string;
    raw_parameter: Array<ApisBaseDataItem>;
    raw_schema: any;
  };
}
export interface WebSocket2Request {
  // Request header info
  header: { parameter: Array<ApisBaseDataItem> };
  // Request query info
  query: { parameter: Array<ApisBaseDataItem> };
  // API request URL
  // Description
}
export interface Websocket2DetailsData extends ApisBaseData {
  // Request method Raw,Socket.IO
  method: string;
  // Request parameters
  request: WebSocket2Request;
  message: Array<MessageItem>;
  active_id?: string;
  // Socket config info
  config: Websocket2Config;
  description: string;
  // Socket connection URL
  url: string;
  attribute_info: AnyObject;
  tags?: string[];
}

export type Websocket2ComponentType = {
  apisData: Websocket2DetailsData;
  onApisDataChange: (data: Websocket2DetailsData) => void;
};
