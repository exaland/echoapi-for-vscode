export const WECHAT_TOKEN_STATUS = {
  /** Registered */
  REGISTER: 1,
  /** Not registered */
  UN_REGISTER: -1,
} as const;

export const APIPOST_TOKEN = 'echoapi-token';
export const APIPOST_MACHINE = 'echoapi-machine';
export const APIPOST_TERMINAL = 'echoapi-terminal';
export const APIPOST_VERSION = 'echoapi-version';
export const APIPOST_LANGUAGE = 'echoapi-language';
export const APIPOST_PLATFORM = 'echoapi-platform';
export const APIPOST_CLIENT_ID = 'echoapi-client-id';

export enum AUTHORITY {
  /** Read only */
  READ = 1,
  /** Write */
  WRITE = 2,
  /** Project admin */
  PROJECT = 3,
  /** Team admin */
  TEAM = 4,
}
