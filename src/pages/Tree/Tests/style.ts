import styled from 'styled-components';

export const TestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .beautify-select{
    background: var(--vscode-input-background);
    border-radius: 4px;
    height: 28px;
    overflow: hidden !important;
  }
  .import-project-full-select{
    background-color: var(--color-bg-page) !important;
  }
  .beautify-btn {
    height: 28px;
    padding: 0 15px;
  }
`;
