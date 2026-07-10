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
        border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
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

export const Oauth2Container = styled.div`
  .tag-env {
    &.oauth-tag {
      color: #26cea4 !important;
    }

    &:not(&.oauth-tag) {
      font-size: 12px;
      font-weight: 300;
      text-decoration: line-through;
      color: #ff4c4c;
      background-color: #e452521a;
    }
  }

  .apipost-form-item-label > label .apipost-form-item-tooltip {
    font-size: 12px;
    color: var(--font-light-color);
    cursor: pointer;
  }

  .apipost-form-item-label
    > label.apipost-form-item-required:not(.apipost-form-item-required-mark-optional)::before {
    display: none;
  }

  .divider {
    margin-bottom: 20px;
    width: 100%;
    border-bottom: 1px solid var(--color-border);
  }
  .beautify-table-cell{
    padding: 0 !important;
    .beautify-select{
      width: 100%;
      height: 36px !important;
      .beautify-select-selector{
        border: none !important;
      }
    }
  }
`;