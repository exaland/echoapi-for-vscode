import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const GhostCollapseWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .apipost-collapse {
    .apipost-collapse-item {
      &:not(:first-child) {
        margin-top: 16px;
      }
    }

    .apipost-collapse-header {
      margin-bottom: 8px;
      width: 100%;

      ${flexStyles('row', 'center', 'space-between')}
      .apipost-collapse-header-text {
        font-size: var(--font-size-14);
      }
    }

    .apipost-collapse-content {
      .apipost-collapse-content-box {
        padding: 0;
      }
    }

    &.fit-content {
      .apipost-collapse-header {
        width: fit-content;
      }
    }
  }
`;
