import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const OrderNumberWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  padding: 0 4px;
  min-width: 22px;
  height: 22px;
  border-radius: 22px;
  border: 1px solid var(--color-border);
  line-height: 22px;
  text-align: center;
  background-color: var(--color-bg-right);
  ${flexStyles('row', 'center', 'center')}
`;
