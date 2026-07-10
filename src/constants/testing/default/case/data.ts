import i18next from 'i18next';

export const CASE_DATA_IF = {
  var: '',
  compare: '',
  value: '',
};

export const CASE_DATA_WAIT = {
  sleep: 1000,
};

export const CASE_DATA_FOR = {
  limit: 1,
  sleep: 0,
  enable_data: -1,
  iterationData: [],
};

export const CASE_DATABASE = {
  limit: 1,
  sleep: 0,
  enable_data: -1,
  iterationData: [],
  databaseConfigs: {
    database: '',
    SQLCommand: '',
  },
};

export const CASE_DATA_BEGIN = {
  name: i18next.t('test.steps_page.add_steps_detail.event_tag'),
  enable_data: -1,
  iterationData: [],
  iterates_data_id: '0',
};

export const CASE_DATA_CASE = {};

export const CASE_DATA_ASSERT = {
  name: '',
  content: '',
};

export const CASE_DATA_SCRIPT = {
  name: '',
  content: '',
};

export const CASE_DATA_FOREACH = {
  name: '',
  enable_data: -1,
  iterationData: [],
};

export const CASE_DATA_LOOP = {
  name: i18next.t('supplement.loop_name'),
  /**
   * Loop type
   * 1: Full traversal
   * 2: Fixed count
   * 3: Conditional
   */
  loop_type: 1,
  /**
   * Loop count
   */
  limit: 1,
  /**
   * Loop interval (ms)
   */
  sleep: 0,
  /**
   * timeout
   */
  loop_timeout: 0,
  /**
   * Whether to use test data
   */
  enable_data: -1,
  /**
   * Condition
   */
  loop_condition: {
    var: '',
    compare: '',
    value: '',
  },
  /**
   * Data type
   * 1: Test data
   * 2: Previous step result
   * 3: Variable
   * 4: Fixed value
   */
  loop_data_type: 1,
  /**
   * Data source
   */
  loop_iteration_data: '',
  /**
   * Extract
   */
  loop_extract: {
    var: '',
    value: '',
  },
  /**
   * Loop traversal data
   */
  loop_traverse_data: {
    /**
     * Data type
     * 1: Loop element content
     * 2: Loop index
     */
    type: 1,
    /**
     * Test data
     */
    iterationData: [],
    /**
     * Variable name
     */
    name: '',
  },
  /**
   * Variable
   */
  loop_variable: '',
  /**
   * Fixed value
   */
  loop_fixed_value: '',
};

export const TESTING_CASE_DATA = {
  if: CASE_DATA_IF,
  wait: CASE_DATA_WAIT,
  for: CASE_DATA_FOR,
  begin: CASE_DATA_BEGIN,
  loop: CASE_DATA_LOOP,
  assert: CASE_DATA_ASSERT,
  script: CASE_DATA_SCRIPT,
  forEach: CASE_DATA_FOREACH,
  case: CASE_DATA_CASE,
  api: {},
  request: {
    url: '',
    request: {
      url: '',
      description: '',
      auth: {
        type: 'noauth',
      },
      body: { mode: 'none', parameter: [], raw: '', raw_parameter: [] },
      event: { pre_script: '', test: '' },
      header: { parameter: [] },
      query: { parameter: [] },
      cookie: { parameter: [] },
      restful: { parameter: [] },
    },
  },
  database: CASE_DATABASE,
};
