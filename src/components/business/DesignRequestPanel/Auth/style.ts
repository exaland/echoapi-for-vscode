import styled, { createGlobalStyle } from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const RequestAuthContainer = styled.div`
  width: 100%;

  .apipost-form-item {
    margin-bottom: 12px;

    input,
    .apipost-select-selector {
      font-size: var(--font-size-14) !important;
    }

    .mini-editor {
      padding: 5.2px 11px;
        background: var(--vscode-input-background);
        border: none;
    }
  }

  .apipost-collapse-ghost {
    .apipost-collapse-header {
      margin-bottom: 4px;
      background: transparent;

      &:hover {
        color: var(--color-primary);
      }
    }

    .apipost-collapse-expand-icon {
      svg {
        color: var(--color-primary);
      }
    }
  }

  /* .apipost-collapse-header {
    background-color: transparent;
  } */
`;

export const MoreTipContainer = styled.span`
  display: flex;
  font-size: 14px;
  color: var(--color-primary);
`;

export const CodeContainer = styled.div`
  height: 150px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
`;

export const CheckedStyles = createGlobalStyle`
  .auth-checked {
    height: 31px;
    ${flexStyles('row', 'center', 'flex-start')}
  }

  .auth-tips {
    font-size: 14px;
    line-height: 30px;
    color: var(--font-light-color)
  }
`;
