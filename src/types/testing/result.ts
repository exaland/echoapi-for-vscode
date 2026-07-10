import { ACTION_TYPE } from '@/constants/testing';

export type ActionDataMap = {
  [ACTION_TYPE.PROCESS]: ProcessItem;
  [ACTION_TYPE.REQUEST]: RequestItem;
  [ACTION_TYPE.COMPLETE]: CompleteItem;
};

export type TestingResultItem<T extends ACTION_TYPE> = {
  action: T;
  data: TestingResultCommonItem & ActionDataMap[T];
  msg: string;
  error: string | null;
};

export type TestingResultCommonItem = {
  /**Step id */
  event_id: string;
  /**Project id */
  project_id: string;
  /**Test case */
  test_id: string;
};

/**
 * Runner request
 */
export type RequestItem = {
  /**Test data id */
  iteration_id: string;
  /**Type */
  type: string;
  /**Error message */
  error: string | null;
  /**Interface id */
  target_id: string;
  data: any;
};

/**
 * Runner progress
 */
export type ProcessItem = {
  /**Total execution count */
  processTotalCount: number;
  /**Current execution count */
  processCurrentCount: number;
  /**Iteration count */
  iterationCount: number;
};

/**
 * Runner result
 */
export type CompleteItem = {
  start_at: number;
  end_at: number;
  total_time: number;
  total_response_time: number;
  total_response_size: number;
  total_request_count: number;
  avg_response_time: number;
  iteration_count: number;
  http: {
    total: number;
    success: number;
    error: number;
  };
  assert: {
    total: number;
    success: number;
    error: number;
  };
  list: TestingResultEventItem[];
};

export type TestingResultEventItem = {
  iteration_id: string;
  target_id: string;
  type: string;
  name: string;
  method: string;
  url: string;
  code: number;
  status: {
    assert: string;
    http: string;
  };
  response_time: number;
  timings: Timings;
  response_size: number;
};

export type Timings = {
  request: number;
  socket: number;
  response: number;
  end: number;
  lookup: number;
  connect: number;
  secureConnect: number;
  done: number;
};
