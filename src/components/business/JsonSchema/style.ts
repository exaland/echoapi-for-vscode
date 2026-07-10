import styled from 'styled-components';

export default styled.div`
  width: 100%;
  // border: #ccc 1px solid;
  border-radius: 4px;
  padding: 8px;
  border: 1px solid var(--color-border);
  // /* border: 1px solid var(--color-border); */

  /* border-right: 0; */

  /* border-left: 0; */

  .beautify-input{
    background: transparent;
  }

  .template-table {
    .table-tr {
      &.data-item {
        .schema-td:last-child {
          flex: 1;
        }
      }
      .table-td {
        border-right: none;
      }
    }
  }

  .action-right {
    display: block !important;
  }
`;
