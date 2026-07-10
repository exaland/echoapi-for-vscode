import { FC, memo } from 'react';

import { isArray, isEqual, isPlainObject } from 'lodash';

import BasicTable from '@/components/business/BasicTable';

import { ResponseHeaderContainer } from './style';

interface Props {
  value: any;
}

const ResponseHeader: FC<Props> = memo(
  ({ value }) => {
    const dataList = () => {
      const list: any[] = [];
      if (isArray(value)) {
        return value;
      }

      if (isPlainObject(value)) {
        Object.entries(value || {}).forEach(([_key, _value]: [string, any]) => {
          list.push({ key: _key, value: `${_value}` });
        });
      }

      return list;
    };

    const columns = [
      {
        width: '25%',
        title: 'name',
        dataIndex: 'key',
        render: (_text: any, rowData: any, _rowIndex: number) => (
          <span className="table-cell-span">{rowData.key || rowData.name}</span>
        ),
      },
      {
        width: '75%',
        title: 'value',
        dataIndex: 'value',
        render: (text: any, _rowData: any, _rowIndex: number) => (
          <span className="table-cell-span">{text || '-'}</span>
        ),
      },
    ];
    return (
      <ResponseHeaderContainer>
        <BasicTable bordered showHeader={false} columns={columns} dataSource={dataList()} />
      </ResponseHeaderContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default ResponseHeader;
