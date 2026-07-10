import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import produce from 'immer';
import { isEqual, size } from 'lodash';

import BasicTable from '@/components/business/BasicTable';
import { RowDescription, RowKey, RowValue } from '@/components/business/RequestTable/components';
import { ApisBaseDataItem } from '@/types/apis/base';
import { ApiRequest } from '@/types/apis/request';
import { ChangeFuncType } from '@/types/common';

import { RequestTabsItemProps } from '../types';

import { RestfulQueryContainer } from './style';

type Props = RequestTabsItemProps & {
  readOnly?: boolean;
  value: ApiRequest['restful'];
  onChange: ChangeFuncType<ApiRequest>;
};

const RestfulQuery: FC<Props> = memo(
  ({ value, readOnly, onChange }) => {
    const { t } = useTranslation();
    const tableColumns = useMemo(() => {
      const columns = [
        {
          key: 'key',
          dataIndex: 'key',
          title: t('common.request_table.param_name'),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
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
          key: 'value',
          dataIndex: 'value',
          title: t('common.request_table.param_value'),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
            <RowValue
              readOnly={readOnly}
              onChange={handleItemOnChange}
              enableNewRow
              rowData={record}
              rowIndex={index}
              valueSuffix
            />
          ),
        },
        {
          key: 'description',
          dataIndex: 'description',
          title: t('common.request_table.param_desc'),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
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

    const handleItemOnChange = useMemoizedFn((rowIndex: number, rowData: ApisBaseDataItem) => {
      const newDataSource = produce(value, (draft) => {
        draft!.parameter[rowIndex] = rowData;
      });

      onChange?.('restful', newDataSource);
    });

    return (
      <RestfulQueryContainer>
        <BasicTable
          className={cn({ 'table-custom-empty-wrap': size(value?.parameter) <= 0 })}
          rowKey="param_id"
          cellPadding={0}
          columns={tableColumns}
          dataSource={value?.parameter || []}
        />
      </RestfulQueryContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RestfulQuery;
