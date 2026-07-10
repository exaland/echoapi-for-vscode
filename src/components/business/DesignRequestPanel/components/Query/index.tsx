import { FC, memo } from 'react';

import { isEqual } from 'lodash';

import RequestTable from '@/components/business/OpenApiRequestTable';
import { useTableColumnSwitchConfig } from '@/hooks';
import { ApisBaseDataItem } from '@/types/apis/base';

import { RequestTabsItemProps } from '../../types';
import { ParametersItem } from '@/types/apis/api';


type Props = RequestTabsItemProps & {
  dataSource: ParametersItem[];
  onChange: (params: ParametersItem[]) => void;
  isSystem?: boolean;
};

const RequestHeader: FC<Props> = memo(
  (props) => {
    const { dataSource, onChange, ...otherProps } = props;

    const { columnSwitchConfig, onColumnSwitchConfig } = useTableColumnSwitchConfig(
      'request_query_column_switch'
    );

    return (
      <RequestTable
        dataSource={dataSource}
        onChange={onChange}
        {...otherProps}
        columnSwitchConfig={columnSwitchConfig}
        onColumnSwitchConfig={onColumnSwitchConfig} />
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestHeader;
