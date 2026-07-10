import { FC } from 'react';

import { InputNumberProps } from 'antd';

import InputNumber from '@/components/ui/InputNumber';
import { TaskBaseItem } from '@/types/apis/request';

interface Props {
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const Wait: FC<Props> = ({ value, onChange }) => {
  const handleChange: InputNumberProps['onChange'] = (changeValue) => {
    onChange({
      ...value,
      data: changeValue || 0,
    });
  };

  return (
    <InputNumber
      addonAfter="ms"
      value={value.data}
      onChange={handleChange}
      style={{ height: 32 }}
    />
  );
};

export default Wait;
