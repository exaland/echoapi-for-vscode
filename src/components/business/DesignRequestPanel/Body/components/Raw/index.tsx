import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash';

import OpenApiRawEditor from '@/components/business/OpenApiRawEditor';
import { ApiRequest } from '@/types/apis/request';

import { RequestBodyProps } from '../../types';
import produce from 'immer';

type Props = Pick<RequestBodyProps, 'value' | 'onChange'> & {
  isParameter?: boolean;
  mode?: string;
};

const RequestBodyRaw = memo(
  (props: Props) => {
    const { isParameter, value, onChange, mode } = props;

    const handleChange = useMemoizedFn((key:string,newValue:any) => {
      const newRequestData = produce(value, (draft) => {
        draft[key] = newValue;
      });
      onChange?.(newRequestData);
    });

    return (
      <OpenApiRawEditor
        mode={mode}
        isParameter={isParameter}
        onMountAutoFormat={false}
        value={value}
        onChange={handleChange}
      />
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestBodyRaw;
