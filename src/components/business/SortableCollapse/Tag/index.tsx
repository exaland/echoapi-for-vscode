import { hexToRGBA } from '@/utils/common';

import { TAG_TYPE_MAP } from '../constants';
import { TagType } from '../types';

import { TagWrapper } from './style';

const Tag = ({ type }: { type: TagType }) => {
  const { color, name } = TAG_TYPE_MAP[type] || {};

  return (
    <TagWrapper
      style={{
        background: color && hexToRGBA(color, 0.1),
        color,
      }}
    >
      {name}
    </TagWrapper>
  );
};

export default Tag;
