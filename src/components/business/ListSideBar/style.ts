import { Flex } from 'antd';

import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const ListSideBarContainer = styled(Flex)`
  > .side-tree-wrap {
    width: 180px;
    background: var(--color-bg-page);
    transition: width 0.1s linear;

    .basic-tabs-con {
      flex: 1;
      padding-top: 8px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;

      ul {
        width: 100%;
        height: 100%;
      }

      .icon-close {
        visibility: hidden;
        transform: rotate(90deg);
        font-size: var(--font-size-14);
      }

      .basic-tab-bar {
        ${flexStyles('row', 'center', 'space-between')};
        margin: 0 8px;
        margin-bottom: 4px;
        padding: 0 12px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;

        &-active {
          background-color: var(--color-bg-folder-hover);
          color: var(--vscode-foreground);
          .apipost-typography {
            color: var(--vscode-foreground);
          }
        }

        &:hover {
          background-color: var(--color-bg-folder-hover);

          .apipost-typography {
            color: var(--color-primary);
          }

          .icon-close {
            visibility: visible;
          }
        }

        .apipost-input {
          box-shadow: none;
          border-radius: 0;
          border-color: transparent;
          cursor: pointer;

          &.edit-input {
            border-color: var(--color-primary);
            cursor: text;
          }
        }

        .apipost-dropdown-menu-item {
          padding: 0;
        }

        .item-label {
          padding: 8px 12px;

          .anticon {
            font-size: 16px;
            margin-inline-end: 8px;
          }
        }
      }
    }

    .add-btn-con {
      padding: 12px 10px;

      button {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }

    &.expand {
      width: 0;
      overflow: hidden;
      transition: width 0.1s linear;

      .apipost-input-affix-wrapper {
        display: none;
      }

      .apipost-tree {
        overflow: hidden;
      }

      .apipost-empty {
        display: none;
      }
    }
  }

  .expand-divider {
    display: flex;
    align-items: center;
    width: 8px;
    border-radius: 78px;
    background-color: var(--color-bg-page);

    .icon-wrap {
      width: 8px;
      height: 24px;
      border-radius: 65px;
      line-height: 24px;
      text-align: center;
      background-color: var(--vscode-badge-background);
      cursor: pointer;

      .anticon {
        margin-left: -2px;
        font-size: var(--font-size-12);
        color: var(--white-color);
      }
    }
  }
`;
