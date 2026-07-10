import i18next from 'i18next';

import { IEnvDataItem } from './components/EnvManage/types';

export enum ENV_MANAGE_ENUM {
  cookie = 'cookie',
  globalParm = 'globalParm',
  globalVariable = 'globalVariable',
}

export enum MENU_ITEMS_KEY {
  all = 'all',
  env = 'env',
}

export const MENU_ITEMS = [
  {
    label: i18next.t('global_setting.global_title'),
    key: MENU_ITEMS_KEY.all,
    children: [
      {
        label: i18next.t('global_setting.cookie'),
        key: ENV_MANAGE_ENUM.cookie,
        icon: 'icon-cookie',
      },
      {
        label: i18next.t('global_setting.global_key'),
        key: ENV_MANAGE_ENUM.globalParm,
        icon: 'icon-global-param',
      },
      {
        label: i18next.t('global_setting.global_variables'),
        key: ENV_MANAGE_ENUM.globalVariable,
        icon: 'icon-global-var',
      },
    ],
    type: 'group',
    disableDraggable: true,
  },
  {
    label: i18next.t('global_setting.environment_list'),
    key: MENU_ITEMS_KEY.env,
    type: 'group',
  },
];

export const DEFAULT_DATA_ITEM: IEnvDataItem = {
  key: '',
  value: '',
  current_value: '',
  description: '',
  static: true,
};

export const ENV_OPTIONS = [
  {
    value: '1',
    label: i18next.t('supplement.priv'),
    tip: i18next.t('supplement.only_own'),
    icon: 'icon-locked',
  },
  {
    value: '-1',
    label: i18next.t('supplement.public'),
    tip: i18next.t('supplement.only_team'),
    icon: 'icon-public',
  },
];

export const ENV_LOCAL_ITEM = {
  env_id: '',
  name: i18next.t('global_setting.create'),
  is_private: -1,
  server_list: [],
  env_var_list: {},
  isLocal: true,
};
