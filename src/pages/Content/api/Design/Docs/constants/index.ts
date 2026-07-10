import i18next from 'i18next';

import { Tab } from '../types';

export const DOCS_TAB_LIST: Array<Tab> = [
  {
    label: i18next.t('common.docs'),
    key: 'docs',
  },
  // {
  //   label: i18next.t('docs.document.custom_share'),
  //   key: 'diy',
  // },
  // {
  //   label: i18next.t('common.target_type.project'),
  //   key: 'project',
  // },
  // {
  //   label: i18next.t('common.target_type.folder'),
  //   key: 'folder',
  // },
  // {
  //   label: 'HTTP',
  //   key: 'api',
  // },
  // {
  //   label: 'SSE',
  //   key: 'sse',
  // },
  // {
  //   label: i18next.t('common.target_type.doc'),
  //   key: 'doc',
  // },
  // {
  //   label: 'gRPC',
  //   key: 'grpc',
  // },
  // {
  //   label: 'websocket',
  //   key: 'websocket',
  // },
  // {
  //   label: 'TCP',
  //   key: ['socket_method', 'socket'],
  // },
];
