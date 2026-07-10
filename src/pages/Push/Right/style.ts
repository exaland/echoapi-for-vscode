import styled from 'styled-components';

export const PushRightWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--search-big-select-color);
  width: 400px;
  padding: 20px;
  border-left: 1px solid var(--color-table-border);
  font-size: 14px;
  gap: 16px;
  .title{
    font-size: 16px;
    font-family: 600;
    line-height: 28px;
    color: var(--font-title-color);
  }
  .team-project-manage-space {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 5px 8px;
    width: 100%;
    .beautify-space-item{
      width: 100%;
    }
    &:hover{
      border: 1px solid var(--color-primary);
    }
    .project-name,.team-name{
    max-width: 150px;
    }
  }
  .beautify-radio-group{
    padding: 12px;
    background: var(--color-bg-right);
    border-top: 1px solid var(--color-table-border);
    border-bottom: 1px solid var(--color-table-border);
  }
`;