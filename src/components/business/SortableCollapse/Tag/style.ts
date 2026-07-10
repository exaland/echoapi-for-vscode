import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const TagWrapper = styled.div`
  ${flexStyles('row', 'center', 'center')}
  width: 60px;
  height: 24px;
  border-radius: 4px;
  font-size: var(--font-size-12);
`;
