import { Button } from 'antd';

import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

const ButtonWrap = styled(Button)<{ $token: Partial<GlobalThemeToken> }>`
  box-shadow: none;
  ${flexStyles('row', 'center', 'center')};
  padding: 4px 16px;
  font-size: var(--font-size-14);
  line-height: 1;

  &.apipost-btn-default {
    /* color: var(--font-content-color); */
    background: transparent;
  }

  &:has(.apipost-btn-icon) {
    padding: 4px 8px;
  }

  & > div {
    /* remove ripple */
    display: none;
  }

  &.large {
    height: 40px;
    font-size: var(--font-size-14);
  }

  &.middle {
    height: 32px;
    font-size: var(--font-size-14);
  }

  &.small {
    height: 26px;
    font-size: var(--font-size-12);
  }

  &.mini {
    padding-right: 8px;
    padding-left: 8px;
    height: 24px;
    font-size: var(--font-size-12);
  }

  &.apipost-btn-dashed {
    border-color: var(--color-dashed);
    box-shadow: none;
    &.normal {
      color: var(--font-content-color);
      background: transparent;

      &.solid {
        border-style: solid;
      }
    }

    &:hover {
      border-color: var(--selected-border-color);
      color: var(--color-primary);

      &.solid {
        border-style: solid;
      }
    }
  }

  &.apipost-btn-primary {
    &.light {
      &.apipost-btn-primary {
        color: var(--color-primary);
        background-color: var(--color-primary-opacity);
      }

      &:hover {
        color: var(--color-font-light-hover);
        background-color: var(--color-bg-light-hover);
      }
    }

    &.success {
      color: #26cea4;
      background-color: rgb(38 206 164 / 10%);
    }

    &.error {
      color: #ff583e;
      background-color: rgb(255 88 62 / 10%);
    }

    &.error,
    &.success {
      border: none;

      &:hover {
        /* background: initial; */
      }
    }
  }

  &.apipost-btn-text {
    color: var(--vscode-tab-inactiveForeground);
    &.background {
      color: var(--font-title-color);
      background-color: var(--color-bg-gray);

      &:hover {
        color: var(--color-primary);
        background-color: var(--color-primary-opacity);
      }
    }
  
    &.light {
      &:hover {
        color: var(--color-primary);
        text-decoration: underline;
        /* background-color: var(--color-primary-opacity); */
      }
    }

    &.menu-item {
      color: var(--font-title-color);

      &:hover {
        /* color: var(--color-primary); */
        background-color: var(--vscode-list-inactiveSelectionBackground);
      }
    }

    &:active {
      background: none !important;
    }

    &:hover {
      color: var(--color-primary);
      background-color: none;
      text-decoration: underline;
    }
  }
`;

export default ButtonWrap;
