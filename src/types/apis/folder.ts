import { ApisBaseData } from './base';
import { FolderRequest } from './request';

export interface FolderDetailsData extends ApisBaseData {
  // Description
  description: string;
  // Request object
  request: FolderRequest;
  //  Referenced service ID
  server_id: string;
}

export type FolderComponentType = {
  apisData: FolderDetailsData;
  onApisDataChange: (data: FolderDetailsData) => void;
};
