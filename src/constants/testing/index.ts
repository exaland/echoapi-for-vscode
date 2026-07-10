import i18next from 'i18next';

import { CaseAddMenu } from '@/types/testing';

export const ALL_KEY = 'all';
export const ROOT_PARENT_ID = '0';
export const DEFAULT_ADD_CASE_NAME = i18next.t('common.folder_operate.new_testcase');
export const DEFAULT_ADD_CASE_FOLDER_TITLE = i18next.t('common.folder_operate.new_folder');
export const DEFAULT_ADD_CASE_FOLDER_NAME = i18next.t('common.target_type.folder');

/**
 * Test case type
 */
export enum TESTING_TYPE {
  TESTING = 'testing',
  FOLDER = 'folder',
}

/**
 * Tree creation type
 */
export enum ADD_MODE {
  CASE = 'case',
  FOLDER = 'folder',
}

/**
 * Test case type
 */
export enum CASE_ITEM_TYPE {
  API = 'api',
  IF = 'if',
  LOOP = 'loop',
  WAIT = 'wait',
  SCRIPT = 'script',
  ASSERT = 'assert',
  BEGIN = 'begin',
  SAMPLE = 'sample',
  CASE = 'case',
}

/** Test result type */
export enum ACTION_TYPE {
  /** Execution progress */
  PROCESS = 'process',
  /** Current executing case */
  REQUEST = 'request',
  /** Execution complete */
  COMPLETE = 'complete',
  /** Stop execution */
  STOP = 'stop',
}

export enum PERCENT_DESC_ENUM {
  HTTP,
  ASSERT,
}

export const CASE_ITEM_CONFIG: { [x: string]: CaseAddMenu } = {
  api: {
    icon: 'icon-api',
    name: i18next.t('test.steps_page.add_steps_detail.http'),
    tag: 'API',
    type: CASE_ITEM_TYPE.API,
    value: 1,
    color: '#FA7600',
  },
  if: {
    icon: 'icon-flow-if',
    name: i18next.t('test.steps_page.add_steps_detail.if'),
    tag: 'IF',
    type: CASE_ITEM_TYPE.IF,
    value: 2,
    color: '#3B75FF',
  },
  loop: {
    icon: 'icon-flow-while',
    name: i18next.t('test.steps_page.add_steps_detail.loop'),
    tag: 'Loop',
    type: CASE_ITEM_TYPE.LOOP,
    value: 3,
    color: '#8D56FF',
  },
  wait: {
    icon: 'icon-flow-wait',
    name: i18next.t('test.steps_page.add_steps_detail.wait'),
    tag: i18next.t('common.wait.tag'),
    type: CASE_ITEM_TYPE.WAIT,
    value: 4,
    color: '#FFC01E',
  },
  shell: {
    icon: 'icon-script',
    name: i18next.t('test.steps_page.add_steps_detail.script'),
    tag: i18next.t('test.steps_page.add_steps_detail.script_tag'),
    type: CASE_ITEM_TYPE.SCRIPT,
    value: 5,
    color: '#26CEA4',
  },
} as const;

export const EMPTY_CARD_LIST = [
  {
    key: TESTING_TYPE.TESTING,
    title: DEFAULT_ADD_CASE_NAME,
    icon: 'icon-testing-case',
    gradientColor: ['#3974FF', '#86AAFF'],
  },
];

export const CREATE_MENU = [
  {
    key: TESTING_TYPE.TESTING,
    label: DEFAULT_ADD_CASE_NAME,
    icon: 'icon-testing-case',
  },
  {
    key: TESTING_TYPE.FOLDER,
    label: DEFAULT_ADD_CASE_FOLDER_TITLE,
    icon: 'icon-add-folder',
  },
];

export const DIFF_TESTING_DETAILS_DATA_KEYS = {
  name: 'name',
  settings: 'settings',
  event_list: 'event_list',
};
