import { FC } from 'react';

import CustomScript from '@/components/business/CustomScript';
import { SCRIPT_TYPE } from '@/components/business/CustomScript/constants';
import { TaskBaseItem } from '@/types/apis/request';

interface Props {
  mode: SCRIPT_TYPE;
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const CustomScriptContent: FC<Props> = ({ value, onChange, mode }) => {
  const handleChange = (newValue: string) => {
    onChange({
      ...value,
      data: newValue,
    });
  };

  return <CustomScript value={value?.data} onChange={handleChange} mode={mode} />;
};

export default CustomScriptContent;
