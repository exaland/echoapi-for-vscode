import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const TableWrapper = styled.div`
  height: 100%;

  table::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  .apipost-table {
    height: 100%;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-table-border);
    border-bottom: none;

    tr {
      height: 36px;
    }

    td,
    th {
      padding: 4px 10px;
      border-right: none !important;

      .apipost-input {
        font-size: var(--font-size-14);
        background: transparent;
      }
      .beautify-select,
      .beautify-select-selector{
        background: transparent;
      }
    }

    .action {
      ${flexStyles('row', 'center', 'flex-start')}
      .apipost-divider {
        margin-top: 4px;
      }

      .apipost-btn {
        padding: 0;
        height: auto;
        font-size: var(--font-size-14);
        color: var(--color-primary);
      }
    }

    .apipost-table-container {
      border: none !important;
    }

    .apipost-table-column-sorter {
      color: var(--font-content-color);
    }

    .apipost-table-thead {
      th {
        &.apipost-table-column-has-sorters {
          transition: none;
        }
      }
    }
  }

  .apipost-pagination {
    .apipost-pagination-item {
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
      color: var(--font-content-color);
    }

    .apipost-pagination-item-active {
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      background-color: transparent;
    }

    .apipost-pagination-item:not(.apipost-pagination-item-active):hover {
      background-color: transparent;
    }
  }

  .react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    right: -5px;
    bottom: 0;
    z-index: 1;
    width: 10px;
    height: 100%;
    cursor: col-resize;
    user-select: none;
    touch-action: none;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 1.4em;
      background-color: var(--color-border);
      content: '';
      transition: background-color 0.2s;
    }

    &:hover,
    &:active {
      &::before {
        background-color: var(--color-primary) !important;
      }
    }
  }
`;

export const TableContainer = styled.div`
  flex: 1;
  height: 100%;

  .sort-handle {
    width: 30px;
    min-width: 30px;
    text-align: center;
  }

  .reset-padding {
    .apipost-table-cell {
      padding: 0;
    }
  }
`;
