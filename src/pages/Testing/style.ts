import styled from 'styled-components';

export const TestingContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-right);
  padding: 16px;
  gap: 12px;
 
  .folder-name{
    font-weight: 600;
    font-size: 16px;
    color: var(--font-title-color);
  }
  .history-report{
    font-size: 12px;
    cursor: pointer;
    color: var(--font-light-color);
    text-decoration: underline; 
    &:hover{
      color: var(--color-primary);
    }
  }
  .folder-sending-btn{
    background: var(--icon-color);
  }
`;
