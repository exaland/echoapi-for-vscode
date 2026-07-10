import { FC, memo } from 'react';

import { Editor as ByteMD } from '@/components/business/ByteMd';
import { OpenApiMainObj } from '@/types/apis/api';
import { ChangeFuncType } from '@/types/common';

import { DetailDesContainer } from './style';

interface Props {
  value: string;
  onChange: ChangeFuncType<OpenApiMainObj>;
}

const DetailDes: FC<Props> = memo(({ value, onChange }) => {
  return (
    <DetailDesContainer>
      <ByteMD value={value} onChange={(value) => onChange('description', value)} />
    </DetailDesContainer>
  );
});

export default DetailDes;
