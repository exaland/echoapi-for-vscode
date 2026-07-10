import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const VariableContainer = styled.div`
  width: 100%;
  height: 100%;

  .variable-flex {
    height: 100%;
  }

  .variable-content {
    flex: 1;
    overflow-y: auto;

    .apipost-table-tbody {
      tr {
        &:hover {
          .anticon {
            visibility: visible;
          }
        }
      }
    }

    .apipost-table-tbody,
    .apipost-table-thead {
      .apipost-table-cell {
        padding: 0;

        /* height: 32px; */

        input,
        textarea {
          height: 36px;
          border-color: transparent;

          &:hover,
          &:focus {
            border-color: var(--color-primary);
            background-color: var(--highlight-change-color);
          }
        }
      }
    }

    .apipost-table-thead {
      .apipost-table-cell {
        padding: 0 12px;
      }
    }
  }
`;

export const VariableOpContainer = styled.div`
  ${flexStyles('row', 'center', 'center')}
  .anticon {
    visibility: hidden;
    color: var(--icon-color);
  }
`;
