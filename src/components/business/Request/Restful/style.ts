import styled from 'styled-components';

export const RestfulQueryContainer = styled.div`
  .apipost-table-thead {
    .apipost-table-cell {
      padding: 4px 10px;
    }
  }

  .apipost-table-tbody {
    tr {
      .row-description-operation {
        visibility: hidden;
      }

      &:hover {
        .row-description-operation {
          visibility: visible;
        }
      }
    }
  }

  .table-custom-empty-wrap {
    .apipost-table-tbody {
      display: none;
    }
  }
`;
