import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const CollapseWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  width: 100%;

  .apipost-collapse {
    .apipost-collapse-header {
      font-size: var(--font-size-14);
      ${flexStyles('row', 'center', 'space-between')}
      background-color: var(--table-header-bg-color);
    }

    .apipost-collapse-content {
      background-color: var(--color-bg-right);
    }
  }
`;
