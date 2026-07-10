import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const ApisColorPrefixIconContainer = styled.div`
  ${flexStyles('row', 'center', 'center')};
  width: 16px;
  height: 16px;

  border-radius: 4px;

  .anticon {
    font-size: var(--font-size-12);
    color: var(--highlight-change-color);
  }
`;
