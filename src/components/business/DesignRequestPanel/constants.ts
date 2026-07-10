import i18next from 'i18next';

import { SOCKET_ASSERT_TYPES } from '@/components/business/Assert/constants';
import { SOCKET_PICK_VARS_TYPES } from '@/components/business/PickVars/constants';
import { APIS_TASK_TYPES_ENUM } from '@/constants/apis';
import { CustomNumberBooleanType } from '@/types/common';

export const PRE_TASK_NAME_MAP = {
  [APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT]: i18next.t('supplement.custom_script'),
  [APIS_TASK_TYPES_ENUM.DATABASE]: i18next.t('supplement.database_name'),
  [APIS_TASK_TYPES_ENUM.ASSERT]: i18next.t('supplement.assert'),
  [APIS_TASK_TYPES_ENUM.PICK_VARS]: i18next.t('supplement.var_pick'),
  [APIS_TASK_TYPES_ENUM.WAIT]: i18next.t('supplement.wait'),
};

export const PRE_TASK_ADD_MENUS_LIST = [
  {
    key: APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT,
    name: i18next.t('common.script.default_title'),
    color: '#26CEA4',
    icon: 'icon-script',
    tips: 'You can add dynamic behavior to your API requests with built-in JavaScript runtime, learn more.',
    link: 'https://wiki.echoapi.com/docs/http_debug/script',
  },
  // {
  //   key: APIS_TASK_TYPES_ENUM.DATABASE,
  //   name: i18next.t('common.database.default_title'),
  //   color: '#3B75FF',
  //   icon: 'icon-database',
  //   tips: 'You can connect to the database and retrieve data from it, learn more.',
  //   link: 'https://wiki.echoapi.com/docs/http_debug/database',
  // },
  {
    key: APIS_TASK_TYPES_ENUM.WAIT,
    name: i18next.t('common.wait.tag'),
    color: '#FFC01E',
    icon: 'icon-flow-wait',
  },
];

export const POST_TASK_ADD_MENUS_LIST = [
  {
    key: APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT,
    name: i18next.t('common.script.default_title'),
    color: '#26CEA4',
    icon: 'icon-script',
    tips: 'You can add dynamic behavior to your API requests with built-in JavaScript runtime, learn more.',
    link: 'https://wiki.echoapi.com/docs/http_debug/script',
  },
  // {
  //   key: APIS_TASK_TYPES_ENUM.DATABASE,
  //   name: i18next.t('common.database.default_title'),
  //   color: '#3B75FF',
  //   icon: 'icon-database',
  //   tips: 'You can connect to the database and retrieve data from it, learn more.',
  //   link: 'https://wiki.echoapi.com/docs/http_debug/database',
  // },
  {
    key: APIS_TASK_TYPES_ENUM.ASSERT,
    name: i18next.t('common.assertion.default_title'),
    color: '#FF583E',
    icon: 'icon-assert',
    tips: 'You can test the response results through simple settings, learn more.',
    link: 'https://wiki.echoapi.com/docs/http_debug/assertion',
  },
  {
    key: APIS_TASK_TYPES_ENUM.PICK_VARS,
    name: i18next.t('common.set_variables.default_title'),
    color: '#8D56FF',
    icon: 'icon-extract-var',
    tips: 'You can set variables with simple operations, learn more.',
    link: 'https://wiki.echoapi.com/docs/http_debug/set-valuable',
  },
  {
    key: APIS_TASK_TYPES_ENUM.WAIT,
    name: i18next.t('common.wait.tag'),
    color: '#FFC01E',
    icon: 'icon-flow-wait',
  },
];

const defaultEnabled = 1 as CustomNumberBooleanType;

export const DEFAULT_DATA = {
  [APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT]: {
    type: APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT,
    id: '',
    name: i18next.t('common.script.default_title'),
    enabled: defaultEnabled,
    data: '',
  },
  [APIS_TASK_TYPES_ENUM.DATABASE]: {
    type: APIS_TASK_TYPES_ENUM.DATABASE,
    id: '',
    name: i18next.t('common.database.default_title'),
    enabled: defaultEnabled,
    data: {
      connectionId: '',
      query: '',
      isConsoleOutput: -1,
      variables: [],
    },
  },
  [APIS_TASK_TYPES_ENUM.ASSERT]: {
    type: APIS_TASK_TYPES_ENUM.ASSERT,
    id: '',
    name: i18next.t('common.assertion.default_title'),
    enabled: defaultEnabled,
    data: {
      type: SOCKET_ASSERT_TYPES[0].value,
      expression: {
        compareType: undefined,
        compareValue: '',
        path: '',
      },
    },
  },
  [APIS_TASK_TYPES_ENUM.PICK_VARS]: {
    type: APIS_TASK_TYPES_ENUM.PICK_VARS,
    id: '',
    name: i18next.t('common.set_variables.default_title'),
    enabled: defaultEnabled,
    data: {
      source: SOCKET_PICK_VARS_TYPES[0].value,
      variables: [],
    },
  },
  [APIS_TASK_TYPES_ENUM.WAIT]: {
    type: APIS_TASK_TYPES_ENUM.WAIT,
    id: '',
    name: i18next.t('common.wait.tag'),
    enabled: defaultEnabled,
    data: 1000,
  },
};
