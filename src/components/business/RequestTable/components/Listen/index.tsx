import { FC, memo } from 'react';

import { Flex, Switch } from 'antd';

import { isEqual } from 'lodash';

import { ItemProps } from '../../types';

import { RowItemWrap } from '../../style';

type Props = ItemProps;

export const RowDescription: FC<Props> = memo((props) => {
  const { rowData, rowIndex, onChange, readOnly } = props;

  const handleChange = (key: string, newVal: string | number) => {
    const newRowData = {
      ...rowData,
      [key]: newVal,
    };
    onChange?.(rowIndex, newRowData);
  };

  return (
    <RowItemWrap>
      <Flex align="center" className="row-listen">
        <Switch
          checked={isEqual(rowData?.value, '1')}
          onChange={(checked) => handleChange?.('value', checked ? '1' : '-1')}
          disabled={readOnly}
        />
      </Flex>
    </RowItemWrap>
  );
});

export default RowDescription;
