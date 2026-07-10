import { TESTING_TYPE } from '@/constants/testing';
import { CommonCallback } from '@/utils/sse/types';

import { CaseItem, Settings } from '../common';

/**
 * Add folder input parameters
 */
export type SaveFolderReq = {
  testing_id: string;
  parent_id: string;
  project_id: string;
  name: string;
  testing_type: TESTING_TYPE;
};

/**
 * Delete folder input parameters
 */
export type DeleteReq = {
  project_id: string;
  testing_ids: string[];
};

/**
 * Add test case input parameters
 */
export type SaveCaseReq = {
  /**Project ID */
  project_id: string;
  /**Parent ID */
  parent_id: string;
  /**Project settings */
  settings: Settings;
  /**Test cases */
  event_list: CaseItem[];
};

/**
 * Move test case input parameters
 */
export type MoveCaseReq = {
  /**Project ID */
  project_id: string;
  /**Parent ID */
  parent_id: string;
  /**Test case IDs */
  testing_ids: string[];
  /**Move after target */
  after_testing_id: string;
  /**Move before target */
  before_testing_id: string;
};

/**
 * Batch get details
 */
export type TestingDetailReq = {
  project_id: string;
  testing_ids: string[];
};

/**
 * Execute test case input parameters
 */
export type RunnerTestingReq = {
  [key: string]: any;
} & CommonCallback;

/**
 * Get test data list
 */
export type GetTestingDataListReq = {
  project_id: string;
  testing_id: string;
};

/**
 * Delete test data
 */
export type DeleteTestingDataReq = {
  project_id: string;
  iterates_id: string;
  testing_id: string;
};

/**
 * CI/CD list
 */
export type GetTestingCicdReq = {
  project_id: string;
  testing_id: string;
};

/**
 * CI/CD list delete
 */
export type DeleteTestingCicdReq = {
  project_id: string;
  testing_id: string;
  ci_id: string;
};

/**
 * CI/CD list details
 */
export type GetTestingCicdDetailsReq = {
  project_id: string;
  testing_id: string;
  ci_id: string;
};

/**
 * Get test report list
 */
export type TestingReportListReq = {
  project_id: string;
  testing_id: string;
};

/**
 * Delete test report
 */
export type DeleteTestingReportReq = {
  project_id: string;
  report_id: string;
};

/**
 * Test report details
 */
export type TestingReportDetailReq = {
  project_id: string;
  report_id: string;
  testing_id: string;
};
