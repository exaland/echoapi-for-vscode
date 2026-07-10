import styled from 'styled-components';

export const AllListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* overflow-y: auto; */
  flex:1;
  .item-container{
    padding: 12px 16px;
    background: var(--table-header-bg-color);
    border: 1px solid var(--color-border);
    white-space: nowrap;
    border-radius: 4px;
  }
  .error-mssage{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1 1 0%;
    width: 0px;
    font-size: var(--font-size-14);
    text-align: right;
    color: var(--color-error);
    cursor: pointer;
  }
`;

export const CustomPopoverWrap= styled.div`
  max-height: 190px;
  overflow-y: auto;
  .error-title {
    color: var(--font-light-color);
  }
  .error-text{
    color: var(--color-error);
    font-size: 12px;
  }
`;
