import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { AutoComplete } from 'antd';

import { map } from 'lodash';

import { REQUEST_CONTENT_TYPE } from '@/constants/apis';

import { ItemProps } from '../../types';

import { RowItemWrap } from '../../style';

const RowContentType = memo((props: ItemProps) => {
  const { t } = useTranslation();
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
      <AutoComplete
        filterOption
        placeholder={t('common.request_table.content_type_tip')}
        disabled={readOnly}
        value={rowData?.content_type || ''}
        onChange={(value) => handleChange('content_type', value)}
        options={map(REQUEST_CONTENT_TYPE, (item) => ({
          label: item,
          value: item,
        }))}
      />
    </RowItemWrap>
  );
});

export default RowContentType;
