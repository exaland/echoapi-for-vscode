import { ApiDetailsData } from '@/types/apis/api';
import { GrpcProtos } from '@/types/apis/grpc';
import { WebsocketConfig } from '@/types/apis/websocket';
import { EnvListItem } from '@/types/envManage';
import {
  ConnectToDatabaseItem,
  CustomAttributeItem,
  DescriptionItem,
  MarkItem,
  MockItem,
  RequestGlobalParams,
} from '@/types/project/index';
import { TestingDetailData } from '@/types/testing';

export type ExportEnvItem = {
  env_id: string;
  name: string;
  is_private: number;
  env_var_list: { [key: string]: any };
};

export type ApiSampleItems = {
  sample_id: string;
  type: string;
} & ApiDetailsData;

type ExportCodesItem = {
  code_number: string;
  code_msg: string;
};

export type ExportServersItem = {
  server_id: string;
  name: string;
};

type ModelsItem = {
  model_id: string;
  model_type: string;
  description: string;
  parent_id: string;
  project_id: string;
  name: string;
  display_name: string;
  schema?: any;
  sort?: number;
};

export type ImportConfig = {
  mode: string; //Import mode: append(default), create=new project, replace=old project (deletes old data)
  folder_id: string; //Import directory, defaults to root if not selected. If deleted, imports to root.
  host?: string; //Pass when adding host to API path. URL comparison excludes host.
  base_path?: string; //Pass when adding base_path to API path. URL comparison excludes base_path.
  api_cover_modal: string; //API overwrite mode: url(same url), url_and_folder(same url+folder, default), unique_url(skip same url), both_url(keep both)
  model_cover_modal: string; //Model overwrite mode: name(same name), name_and_folder(same name+folder, default), unique_name(skip same name)
  env_cover_modal: string; //Env overwrite mode: none(skip, default), both(add new)
};

export type SwaggerProjectImportParams = {
  project_id: string;
  name: string;
  intro: string;
  apis: ApiDetailsData[];
  models: ModelsItem[];
  global: {
    envs: ExportEnvItem[];
  };
  config: ImportConfig;
  team_id?: string;
};

export type GlobalVars = {
  [k: string]: {
    value: string;
    current_value: string;
    description: string;
  };
};

export type ImportApis = ApiDetailsData & {
  config?: WebsocketConfig;
  protos: GrpcProtos[];
  server_id: string;
};

export type ApiProjectImportParams = {
  project_id: string;
  name: string;
  intro: string;
  global: {
    envs: EnvListItem[];
    servers: ExportServersItem[];
    global_vars: GlobalVars;
    global_param: RequestGlobalParams;
    codes: ExportCodesItem[];
    marks: MarkItem;
    attributes: CustomAttributeItem[];
    mock_custom_rules: MockItem[];
    db_link: ConnectToDatabaseItem[];
    describe_library: DescriptionItem[];
  };
  models: ModelsItem[];
  apis: ImportApis[];
  samples: ApiSampleItems[];
  automated_testings: TestingDetailData[];
};

export type ApipostObj = {
  project: any;
  apis: any;
  envs: any[];
  models: any;
  mock_rules: any[];
};
