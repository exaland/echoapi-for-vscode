import styled from 'styled-components';

export const PushLeftWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px 16px;
  flex: 1;
  gap: 12px;

  .beautify-input-affix-wrapper{
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
  }

`;