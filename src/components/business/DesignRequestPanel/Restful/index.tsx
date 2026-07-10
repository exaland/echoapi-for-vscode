import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import produce from 'immer';
import { isEqual, size } from 'lodash';

import BasicTable from '@/components/business/BasicTable';
import { RowKey, RowValue, RowDescription } from '@/components/business/OpenApiRequestTable/components';
import { RequestTabsItemProps } from '../types';

import { RestfulQueryContainer } from './style';
import { ParametersItem } from '@/types/apis/api';

type Props = RequestTabsItemProps & {
  readOnly?: boolean;
  value: ParametersItem[];
  onChange: (val:ParametersItem[])=>void;
};

const RestfulQuery: FC<Props> = memo(
  ({ value, readOnly, onChange }) => {
    const { t } = useTranslation();
    const tableColumns = useMemo(() => {
      const columns = [
        {
          key: 'name',
          dataIndex: 'name',
          title: t('common.request_table.param_name'),
          render: (_: string, record: ParametersItem, index: number) => (
            <RowKey
              onChange={handleItemOnChange}
              rowData={record}
              rowIndex={index}
              readOnly={readOnly}
              showCheckbox={false}
              inputDisabled
            />
          ),
        },
        {
          key: 'example',
          dataIndex: 'example',
          title: t('common.request_table.param_value'),
          render: (_: string, record: ParametersItem, index: number) => (
            <RowValue
              readOnly={readOnly}
              onChange={handleItemOnChange}
              enableNewRow
              rowData={record}
              rowIndex={index}
            />
          ),
        },
        {
          key: 'description',
          dataIndex: 'description',
          title: t('common.request_table.param_desc'),
          render: (_: string, record: ParametersItem, index: number) => (
            <RowDescription
              readOnly={readOnly}
              onChange={handleItemOnChange}
              rowData={record}
              rowIndex={index}
              showDelete={false}
              showAiDescription
            />
          ),
        },
      ];

      return columns?.map((it) => ({ ...it, width: `${100 / columns.length}%` }));
    }, [readOnly]);

    const handleItemOnChange = useMemoizedFn((rowIndex: number, rowData: ParametersItem) => {
      const newDataSource = produce(value, (draft) => {
        draft![rowIndex] = rowData;
      });

      onChange?.(newDataSource);
    });

    return (
      <RestfulQueryContainer>
        <BasicTable
          className={cn({ 'table-custom-empty-wrap': size(value) <= 0 })}
          rowKey="param_id"
          cellPadding={0}
          columns={tableColumns}
          dataSource={value || []}
        />
      </RestfulQueryContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RestfulQuery;
