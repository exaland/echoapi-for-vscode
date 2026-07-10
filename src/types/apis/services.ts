export type moveApisRequestType = {
  project_id: string;
  parent_id: string;
  target_ids: string[];
  after_target_id: string;
  before_target_id: string;
};
