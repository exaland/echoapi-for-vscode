import { FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import Assert from '@/components/business/Assert';
import { useApis } from '@/store';
import { TaskBaseItem } from '@/types/apis/request';
import { ApiDetailsData } from '@/types/apis/api';

interface Props {
  apiData?: ApiDetailsData;
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const AssertContent: FC<Props> = ({ apiData, value, onChange }) => {

  const responseExample = apiData?.response?.example?.find((e) => e?.expect?.is_default === 1);

  const handleChange = useMemoizedFn((newValue) => {
    const newData = produce(value, (draft) => {
      draft.data = newValue;
    });

    onChange(newData);
  });

  return (
    <Assert rawData={responseExample?.raw || ''} value={value?.data} onChange={handleChange} />
  );
};

export default AssertContent;
