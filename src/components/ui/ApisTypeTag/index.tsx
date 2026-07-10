import React from 'react';

import { TagProps } from 'antd';

import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { ColorMap } from '@/constants/apis/common';
import { ApiTypeMethod } from '@/types/apis/base';

import { ApisTypeTag as Tag } from './style';

type Props = TagProps & {
  targetType: APIS_TARGET_TYPE_ENUM;
  method: ApiTypeMethod;
};

/** Tag containing apis target_type and api method */
const ApisTypeTag: React.FC<Props> = ({ targetType, method, ...resetProps }) => {
  return (
    <Tag
      className={`${ColorMap(targetType, method)}`}
      style={{ fontWeight: 700 }}
      bordered={false}
      {...resetProps}
    >
      {method}
    </Tag>
  );
};

export default ApisTypeTag;
