import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const CustomScriptWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .custom-script-container {
    width: 100%;
    height: 280px;
    border: 1px solid var(--color-border);

    ${flexStyles('row', 'flex-start', 'flex-start')};
    .monaco-editor-container {
      flex: 1;
      width: 10px;
      height: 280px;
    }

    .right-var-list {
      width: 240px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;

      .var-item {
        padding: 8px 16px;
        width: 100%;
        /* background-color: var(--color-bg-page); */
        cursor: pointer;
        ${ellipsisStyle};
        transition: all 0.3s;

        &:hover,
        &.active {
          background-color: var(--vscode-list-inactiveSelectionBackground);
        }
      }
    }
  }
`;
