import { ApisBaseData, ApisBaseDataItem, WebsocketMethod } from './base';
import { WebSocketRequest } from './request';

export interface WebsocketConfig {
  // Max receivable content size in MB, 0 means unlimited
  information_size: number;
  // Max reconnect attempts when connection drops unexpectedly
  reconnect_num: number;
  // Reconnect interval in milliseconds
  reconnect_time: number;
  // Server path to use during handshake
  shake_hands_path: string;
  // Connection timeout in ms, 0 means no timeout
  shake_hands_timeout: number;
  // Send event name
  socketEventName?: string;
  // Backend event listener list
  socketIoEventListeners?: Array<ApisBaseDataItem>;
  // Client version used when method is Socket.IO
  socket_version: string;
}

export interface WebsocketDetailsData extends ApisBaseData {
  // Request method Raw,Socket.IO
  method: WebsocketMethod;
  // Request parameters
  request: WebSocketRequest;
  // Socket config info
  config: WebsocketConfig;
  description?: string;
  // Socket connection URL
  url?: string;
}

export type WebsocketComponentType = {
  apisData: WebsocketDetailsData;
  onApisDataChange: (data: WebsocketDetailsData) => void;
};
