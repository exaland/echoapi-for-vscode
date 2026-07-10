import styled from 'styled-components';

import { selectRequestStyle } from '../../style';

export const BasicTableContainer = styled.div`
.beautify-collapse>.beautify-collapse-item >.beautify-collapse-header .beautify-collapse-expand-icon{
  padding-inline-end:4px;
}
  .apipost-table-thead {
    .apipost-table-cell {
      padding: 10px;
    }
  }
  .beautify-collapse-header{
    color: var(--font-content-color) !important;
  }
  ${selectRequestStyle}
  .table-collapse {
    .apipost-collapse-content-box {
      padding-top: 0 !important;
    }
  }

  .table-collapse-public {
    .apipost-collapse-header {
      display: flex;
      align-items: center;
      font-size: 12px;
      background-color: inherit;
    }

    & > .apipost-collapse-item {
      .apipost-collapse-content {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
    }
  }

  .global-param-edit {
    color: var(--font-light-color);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }
`;
