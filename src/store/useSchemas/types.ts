export type DATA_MODEL_TYPE = 'model' | 'folder';

export interface SchemaObj {
  type?: string;
  properties?: any;
  $schema?: any;
  ECHOAPI_ORDERS?: string[];
}

export interface IDataModel {
  // unique identifier ID
  model_id: string;

  // parent directory ID
  parent_id: string;

  // project ID
  project_id: string;

  // data type: model for model, folder for directory
  model_type: DATA_MODEL_TYPE;

  // model name
  name: string;

  // display name
  display_name: string;

  // model description
  description: string;

  // model data info
  schema: any;

  // sort order in left sidebar, higher value means later position, starts from 0
  sort: number;

  // version number, backend returns latest version when modifying directory/interface, need to update local indexDB; when saving backend returns code 10100 for version conflict, frontend needs to resolve conflict then set local version to backend's latest version, then save
  version: number;

  // 1.normal -1 deleted -99 permanently deleted
  status: 1 | -1 | -99;

  // last editor UUID
  updated_id: string;

  // last modified timestamp
  updated_time: number;

  // created timestamp
  created_time: number;

  // whether modified: 1 changed -1 changing
  is_changed?: 1 | -1;

  // created time
  created_at?: string | number | Date;

  // updated time
  updated_at?: string | number | Date;

  // whether newly created: true new / false editing
  isLocalCreate: boolean;

  // creator info
  created_user_info: {
    portrait: string;
    nick_name: string;
  };

  // editor info
  updated_user_info: {
    portrait: string;
    nick_name: string;
  };

  // conflict field
  is_conflicted: 1 | -1;

  // deletion field
  is_deleted: 1 | -1;

  // force update field
  is_force: 1 | -1;
}
