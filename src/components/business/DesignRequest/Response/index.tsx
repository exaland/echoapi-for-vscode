import { FC, memo } from 'react';

import PredefinedResponse from './PredefinedResponse';

import { ResponseContainer } from './style';

interface Props {
  value: any;
  onChange: (val:any)=>void;
}

const Response: FC<Props> = memo(({ value, onChange }) => {
  return (
    <ResponseContainer>
      <PredefinedResponse value={value} onChange={(val)=>onChange(val)} />
    </ResponseContainer>
  );
});

export default Response;
