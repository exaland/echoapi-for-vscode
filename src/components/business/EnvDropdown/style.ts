import { Flex } from 'antd';

import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';
import { hexToRGBA } from '@/utils/common';

export const EnvDropdownWrapper = styled(Flex)`
  width: 100%;
  height: 100%;

  .line{
    width: 1px;
    height: 8px;
  background: var(--color-border);
  }

  .env-select-wrap {
    padding: 4px 8px;
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    border-right: 1px solid var(--color-table-border);
    background-color: var(--search-big-bg-color);
    cursor: pointer;

    .anticon {
      font-size: var(--font-size-14);
      color: var(--font-light-color);
    }

    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      max-width: 176px;
      ${ellipsisStyle}
      font-size: var(--font-size-14);
      color: var(--font-content-color);

      i {
        font-style: normal;
      }

      .icon {
        display: inline-block;
        margin: 0 4px;
        padding: 0 2px;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        font-size: var(--font-size-12);
        text-align: center;
        color: #067ced !important;
        background-color: rgb(127 197 255 / 20%);
      }

      .name {
        display: inline-block;
        max-width: 100%;
        ${ellipsisStyle}
      }
    }
  }

  .icon-manage-env {
    ${flexStyles('row', 'center', 'center')}
    padding: 6px 8px;
    width: 24px;

    /* height: 26px; */
    height: 100%;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    /* border: 1px solid var(--color-table-border); */
    border: 1px solid transparent;
    border-left: none;
    background-color: var(--search-big-bg-color);
    cursor: pointer;
    &:hover{
      border-color: var(--color-primary);
      border-left:1px solid var(--color-primary);
    }
    .anticon {
      font-size: 16px;
      color: var(--icon-color);
    }
  }

  &.env-dropdown-disabled {
    opacity: 0.3;

    &,
    .icon-manage-env,
    .env-select-wrap,
    .env-select-setting {
      cursor: not-allowed;
    }
  }
`;

export const EnvDropdownRenderContainer = styled.div`
  padding: 8px;
  min-width: 240px;
  border-radius: 8px;
  /* border: 1px solid var(--color-border); */
  background-color: var(--popover-select-bg-color);
  box-shadow: 0 12px 18px -4px var(--box-shadow-modal-color);

  .apipost-dropdown-menu {
    margin-top: 8px;
    padding: 0;
    box-shadow: none;
    max-height: 260px;
    overflow-y: auto;

    .apipost-dropdown-menu-item {
      padding: 4px 8px;
      height: 32px;

      .anticon {
        visibility: hidden;
      }

      &:hover {
        .anticon {
          visibility: visible;
        }
      }

      .operate-wrap {
        .anticon {
          font-size: var(--font-size-14);
          color: var(--icon-color);
        }
      }
    }
  }

  .env-popover-input {
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
    svg {
      color: var(--vscode-input-placeholderForeground);
    }
  }

  .add-env-btn {
    padding: 0;
    height: auto;
  }
`;

export const EnvLabel = styled.div`
  max-width: 300px;

  .name {
    display: inline-block;
    ${ellipsisStyle}
  }

  .private {
    ${flexStyles('row', 'center', 'center')}
    display: inline-block;
    margin-left: 4px;
    padding: 2px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    color: #22c55e;
    background-color: ${hexToRGBA('#22C55E', 0.1)};
  }
`;
