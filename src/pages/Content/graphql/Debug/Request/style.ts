import styled from 'styled-components';

import { DirectionType } from '@/types/common';

export const RequestContainer = styled.div<{ $direction: DirectionType }>`
  padding: 0 var(--padding16);
  padding-bottom: ${({ $direction }) => ($direction === 'vertical' ? 12 : 0)}px;
  width: 100%;
  height: 100%;
`;
