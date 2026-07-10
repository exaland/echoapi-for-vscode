import styled from 'styled-components';

export const VarsTableWrap = styled.div`
  .apipost-table-thead {
    .apipost-table-cell {
      padding: 4px 10px;
    }
  }

  .apipost-table-tbody {
    .apipost-table-cell {
      .apipost-input-outlined,
      .apipost-select-selector {
        border-radius: 0;
        border-color: transparent;
      }

      .apipost-input-outlined:hover,
      .apipost-input-outlined:focus {
        border-color: var(--color-primary);
      }
    }
  }

  .tool-icon {
    &:hover {
      color: var(--color-primary);
    }
  }

  .delete-vars-params-icon {
    &:hover {
      color: #ff583e;
    }
  }
`;

export const PopoverContentWrap = styled.div`
  padding: 10px;
  background-color: var(--color-bg-folder);

  pre {
    color: #fa7600;
  }
`;
