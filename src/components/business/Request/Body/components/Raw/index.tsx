import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash';

import RawEditor from '@/components/business/RawEditor';
import { ApiRequest } from '@/types/apis/request';

import { RequestBodyProps } from '../../types';

type Props = Pick<RequestBodyProps, 'value' | 'onChange'> & {
  isParameter?: boolean;
  mode?: string;
};

const RequestBodyRaw = memo(
  (props: Props) => {
    const { isParameter, value, onChange, mode } = props;

    const handleChange = useMemoizedFn((newValue: ApiRequest['body']) => {
      onChange?.('body', newValue);
    });

    return (
      <RawEditor
        mode={mode}
        isParameter={isParameter}
        onMountAutoFormat={false}
        value={value!}
        onChange={handleChange}
        editorOptions={{
          hover: { enabled: true, delay: 500 },
        }}
      />
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestBodyRaw;
