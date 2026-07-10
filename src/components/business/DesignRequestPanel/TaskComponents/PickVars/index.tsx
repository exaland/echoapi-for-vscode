import { FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import PickVars from '@/components/business/PickVars';
import { TaskBaseItem } from '@/types/apis/request';

interface Props {
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const PickVarsContent: FC<Props> = ({ value, onChange }) => {
  const handleChange = useMemoizedFn((newValue) => {
    const newData = produce(value, (draft) => {
      draft.data = newValue;
    });

    onChange(newData);
  });

  return <PickVars value={value?.data} onChange={handleChange} />;
};

export default PickVarsContent;
