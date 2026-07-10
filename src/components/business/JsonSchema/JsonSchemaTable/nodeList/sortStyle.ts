import styled from 'styled-components';

export const SortRowWrapper = styled.div`
  display: flex;
  height: 28px;
  background-color: var(--highlight-background-color-tertiary);

  .table-tr {
    display: flex;
    width: 100%;
    height: 28px;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
  }

  .table-td {
    flex: 1;
    height: 28px;
    border: 1px solid transparent;
    border-top: none;
    border-left: none;
  }

  .schema-td-warper {
    display: flex;
    float: left;
    position: relative;
    flex-direction: row;
    align-items: center;
    padding-left: 0;
    width: 100%;
    height: 100%;
    line-height: 32px;

    &.schema-width-auto {
      width: auto !important;
    }
  }

  .settings-td {
    flex: 2;
    margin-right: 0;

    .txt-description {
      flex: 1;
    }
  }
`;
