import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const ResizablePanelsContainer = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  width: 100%;
  height: 100%;

  .resizable-panel-handle {
    position: relative;
    transition: background-color 0.3s;

    &.static-handle-border {
      background-color: var(--divider-color);
    }

    &.resizable-line-hidden {
      display: none;
    }

    .right-collapse-btn {
      ${flexStyles('row', 'center', 'center')};
      position: absolute;
      z-index: 3;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: var(--color-bg-right);
      box-shadow: 0 2px 4px var(--box-shadow-modal-color);
      cursor: pointer;

      > .anticon {
        font-size: 14px;
      }

      &:hover {
        color: var(--color-primary);
      }
    }

    .resizable-bar {
      position: absolute;
      z-index: 2;
    }

    &.horizontal {
      width: 2px;
      height: auto;

      .resizable-bar {
        left: -5px;
        width: 10px;
        height: 100%;
      }

      .right-collapse-btn {
        top: 50%;
        left: 0;
      }
    }

    &.vertical {
      width: 100%;
      height: 2px;

      .resizable-bar {
        top: -5px;
        width: 100%;
        height: 10px;
      }

      .right-collapse-btn {
        top: 0;
        left: 50%;
      }
    }

    &:hover,
    &:active {
      background-color: var(--color-primary);
    }
  }

  .resizable-panel-left-wrap,
  .resizable-panel-right-wrap {
    .left-collapse-wrap,
    .right-collapse-wrap {
      width: 100%;
      height: 100%;
      background-color: var(--vscode-sideBar-background);
      cursor: pointer;

      .apipost-flex {
        height: 100%;

        > .anticon {
          font-size: 12px;
        }

        .collapse-title {
          font-size: var(--font-size-14);
          color: var(--font-content-color);
          word-break: keep-all;

          &.noSpacing {
            letter-spacing: 1px !important;
          }

          &.vertical {
            margin-left: 4px;
            letter-spacing: 2px;
          }

          &.horizontal {
            margin-top: 8px;
            letter-spacing: 4px;
            writing-mode: vertical-lr;
          }
        }
      }
    }
  }

  .resizable-panel-right-wrap {
    position: relative;

    .direction-wrap {
      position: absolute;
      right: 20px;
      bottom: 24px;
      width: 40px;
      height: 40px;

      > .apipost-popover {
        .apipost-popover-inner {
          padding: 8px;

          .direction-item-btn {
            padding: 0 8px;
            height: 32px;
            cursor: pointer;
            transition: all 0.3s;

            &.active {
              color: var(--color-primary);
              background-color: var(--color-primary-opacity);
            }

            .anticon {
              font-size: var(--font-size-14);
            }

            .title {
              margin-left: 8px;
              font-size: var(--font-size-14);
            }
          }
        }
      }

      .apipost-btn {
        z-index: 500;
        width: 32px;
        height: 32px;
        background: var(--color-bg-page);
        box-shadow: 0 4px 8px -4px rgb(16 24 40 / 28%);
      }
    }
  }
`;
