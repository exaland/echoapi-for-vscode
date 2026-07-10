import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const FuncModalContainer = styled.div`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;

  .inner-content {
    width: 100%;
    gap: 2px;

    .tip-title {
      font-size: 12px;
      font-weight: 400;
      color: var(--font-light-color);
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      width: 100%;
      box-sizing: border-box;
      line-height: 32px;

      &:hover {
        border-radius: 4px;
        background: var(--vscode-editorHoverWidget-statusBarBackground);
        cursor: pointer;
      }

      &.active {
        border-radius: 4px;
        background: var(--popover-select-bg-hover-color);
      }

      .name {
        flex: 1;
        width: 0;
        ${ellipsisStyle}
        font-size: 14px;
        font-weight: 400;
        color: var(--font-content-color);
      }

      .render {
        display: flex;
        width: 190px;
        font-size: 12px;
        font-weight: 400;
        color: var(--font-light-color);
        gap: 8px;

        &.custom-desc {
          display: inline-block;
          max-width: 190px;
          text-align: right;
          ${ellipsisStyle}
        }
      }
    }
  }
`;
