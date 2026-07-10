import { ParametersItem } from '@/types/apis/api';
import { ApisBaseDataItem } from '@/types/apis/base';
import { RequestBodyContentType } from '@/types/apis/request';
import { CustomNumberBooleanType } from '@/types/common';
import { GlobalParamsHeaderItem } from '@/types/project';

export type Item = {
  description: string;
  field_type: string;
  is_checked: -1 | 1;
  key: string;
  value: string;
  not_null: -1 | 1;
  type?: string;
  id: number;
};

export type ItemProps = {
  rowData: ParametersItem;
  rowIndex: number;
  readOnly?: boolean;
  enableNewRow?: boolean;
  tabType?: RequestTableProps['tabType'];
  bodyMode?: RequestTableProps['bodyMode'];
  setSelectedRowKeys?: (keys: string[]) => void;
  onChange?: (rowIndex: number, rowData: ParametersItem) => void;
  onDelete?: (rowIndex: number) => void;
};

export interface RequestTableProps {
  dataSource: ParametersItem[];
  globalParams?: GlobalParamsHeaderItem[];
  folderParams?: ParametersItem[];
  queryAddEqual?: CustomNumberBooleanType;
  paramsType?: 'global' | 'folder' | 'request' | '';
  tabType?: 'header' | 'query' | 'restful' | 'body' | 'cookie' | 'event';
  readOnly?: boolean;
  bodyMode?: RequestBodyContentType;
  isSystem?: boolean;
  showAiDescription?: boolean;
  onChange: (params: ParametersItem[]) => void;
  onChangeQueryAddEqual?: (params: CustomNumberBooleanType) => void;
  columnSwitchConfig?: TableColumnSwitchConfig;
  onColumnSwitchConfig?: (params: TableColumnSwitchConfig) => void;
}

/**Table column configuration items */
export type TableColumnSwitchConfig = {
  /**Parameter description toggle */
  parameter_description: CustomNumberBooleanType;
  /**Parameter type toggle */
  parameter_type: CustomNumberBooleanType;
  /**Content type toggle */
  content_type: CustomNumberBooleanType;
};