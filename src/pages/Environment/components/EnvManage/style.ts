import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const TitleContainer = styled.div`
  padding-bottom: 12px;
  font-size: 14px;
  font-weight: 400;
  color: var(--font-title-color);
`;

export const EnvManageContainer = styled.div`
  width: 100%;
  height: 100%;

  .env-manage-flex {
    height: 100%;
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

  .env-manage-content {
    flex: 1;
    overflow-y: auto;

    .env-manage-input {
      margin-bottom: 12px;
    }

    .env-var-name {
      &.apipost-input-disabled {
        background-color: transparent;
      }
    }

    .apipost-table-tbody {
      tr {
        &:hover {
          .anticon {
            visibility: visible;
          }
        }
      }
    }
  }

  .apipost-table-thead {
    .apipost-table-cell {
      padding: 0 12px;
    }
  }
`;

export const EnvOpContainer = styled.div`
  ${flexStyles('row', 'center', 'center')}
  .anticon {
    visibility: hidden;
    color: var(--icon-color);
  }
`;

export const VariableVarsOpContainer = styled.div`
  ${flexStyles('row', 'center', 'center')}
  gap: 4px;
  padding: 0 4px;

  .anticon {
    visibility: hidden;
    font-size: 16px;
    color: var(--icon-color);
    cursor: pointer;
  }
`;