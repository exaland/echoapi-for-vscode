import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const SortableCollapseWrapper = styled.div`
  width: 100%;

  .custom-header {
    flex: 1;
    margin-right: 12px;

    .anticon {
      opacity: 0;
    }
  }

  .header-container {
    &:hover {
      .hover-show-custom-header {
        &.custom-header {
          .anticon {
            opacity: 1;
          }
        }
      }
    }
  }

  .item-container {
    width: 100%;

    ${flexStyles('row', 'center', 'flex-start')}

    &.top {
      border-top: 2px solid var(--color-primary);
    }

    &.inside {
      background-color: var(--color-primary);
    }

    &.bottom {
      border-bottom: 2px solid var(--color-primary);
    }

    .icon {
      margin-top: -8px;
      margin-right: 8px;
      cursor: move;
    }

    .apipost-collapse-expand-icon {
      display: none !important;
    }
  }

  .children-container {
    padding: 16px;
  }
`;
