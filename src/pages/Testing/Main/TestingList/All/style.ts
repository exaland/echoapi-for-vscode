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
`;
