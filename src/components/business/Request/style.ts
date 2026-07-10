import styled from 'styled-components';

import { DirectionType } from '@/types/common';

export const RequestContainer = styled.div<{ $direction: DirectionType }>`
  padding: 0;
  /* padding-bottom: ${({ $direction }) => ($direction === 'vertical' ? 12 : 6)}px; */
  width: 100%;
  height: 100%;
  .beautify-tabs,
  .beautify-tabs-content,
  .beautify-tabs-tabpane{
    width: 100%;
    height: 100%;
  }
  .beautify-tabs-top >.beautify-tabs-nav{
    margin-bottom: 8px;
  }
`;
