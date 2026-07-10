import { Table as AntdTable } from 'antd';

import ResizableTable from '../ResizableTable';
import { AnyObject, TableProps } from '../types';

import { TableContainer, TableWrapper } from './style';

const Table = <DataSource extends AnyObject>(props: TableProps<DataSource>) => {
  const { resizableColEnable } = props;

  let RenderTable = AntdTable;

  if (resizableColEnable) {
    RenderTable = ResizableTable as any;
  }

  return (
    <TableWrapper>
      <TableContainer>
        <RenderTable {...props} />
      </TableContainer>
    </TableWrapper>
  );
};

export default Table;
