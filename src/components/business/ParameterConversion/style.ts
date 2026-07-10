import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const ParameterContainer = styled.div`
  width: 100%;

  .apipost-segmented {
    margin-bottom: 16px;
    width: 100%;
    height: 32px;

    .apipost-segmented-item {
      ${ellipsisStyle}
      flex: 1;
    }
  }
`;

export const TipContainer = styled.span`
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: var(--font-light-color);
`;
