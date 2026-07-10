import { STATUS_CODE } from '@/constants/common';
import { CASE_ITEM_TYPE } from '@/constants/testing';

import { TESTING_CASE_DATA } from './data';

export const DEFAULT_CASE_COMMON = {
  parent_event_id: '0',
  enabled: STATUS_CODE.ENABLE,
};

export const DEFAULT_CASE_MAP: Record<string, any> = {
  [CASE_ITEM_TYPE.IF]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.IF,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.IF],
  },
  [CASE_ITEM_TYPE.API]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.API,
  },
  [CASE_ITEM_TYPE.WAIT]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.WAIT,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.WAIT],
  },
  [CASE_ITEM_TYPE.SCRIPT]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.SCRIPT,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.SCRIPT],
  },
  [CASE_ITEM_TYPE.ASSERT]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.ASSERT,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.ASSERT],
  },
  [CASE_ITEM_TYPE.BEGIN]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.BEGIN,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.BEGIN],
  },
  [CASE_ITEM_TYPE.LOOP]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.LOOP,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.LOOP],
  },
  [CASE_ITEM_TYPE.SAMPLE]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.SAMPLE,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.API], // API case data is the same as api, so use api data directly
  },
  [CASE_ITEM_TYPE.CASE]: {
    ...DEFAULT_CASE_COMMON,
    type: CASE_ITEM_TYPE.CASE,
    data: TESTING_CASE_DATA[CASE_ITEM_TYPE.CASE],
  },
};
