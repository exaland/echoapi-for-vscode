import { Flex } from 'antd';

import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const ContentContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  width: 320px;
  min-height: 448px;
  max-height: 448px;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  pointer-events: none;

  .param-title {
    color: var(--font-light-color);
  }

  .apipost-input,
  .apipost-input-number-input {
    background-color: var(--search-big-select-color);
    box-shadow: none;
  }

  .apipost-select {
    background-color: var(--search-big-select-color);

    * {
      box-shadow: none !important;
    }

    &-selector {
      box-shadow: none;
    }
  }

  &.active {
    opacity: 1;
    pointer-events: unset;
  }

  &.cursor {
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    font-weight: 400;
    color: var(--font-content-color);
    cursor: pointer;

    &:hover {
      .anticon {
        color: var(--color-primary);
      }
    }
  }

  .input-label {
    color: var(--font-light-color);
  }

  .fn-list {
    padding: 6px;
    border-radius: 4px;
    background-color: var(--color-bg-page);
    box-sizing: border-box;

    .list-content {
      padding: 6px;
      width: 100%;
      border-radius: 4px;
      border: 1px solid var(--color-border);
      background-color: var(--popover-select-bg-color);
      box-sizing: border-box;
      overflow-y: auto;

      .list-content-item {
        padding: 0 4px;
        border-radius: 4px;
        line-height: 28px;
        box-sizing: border-box;

        &:hover {
          background-color: var(--form-hover-color);
        }

        .name {
          flex: 1;
          width: 0;
          ${ellipsisStyle}
          font-size: 14px;
          font-weight: 400;
          color: var(--font-content-color);

          &.del {
            text-decoration: line-through;
            color: var(--font-light-color);
          }
        }

        .desc {
          font-size: 12px;
          font-weight: 400;
          color: var(--font-light-color);
        }
      }
    }
  }

  .desc-list {
    flex: 1;
    width: 100%;
    overflow-y: auto;

    .desc-item {
      padding: 0 8px;
      min-height: 32px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 32px;
      box-sizing: border-box;
      gap: 4px;
      font-weight: 400;
      color: var(--font-content-color);

      ${ellipsisStyle}
      &:hover, &.active {
        background-color: var(--popover-select-bg-hover-color);
        cursor: pointer;
      }
    }
  }

  .desc-ai {
    width: 100%;

    .desc-ai-title {
      font-size: 12px;
      font-weight: 400;
      color: var(--font-light-color);

      &.refresh {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .params-refresh {
          display: flex;
          cursor: pointer;
          gap: 4px;

          &:hover {
            color: var(--color-primary);
          }
        }
      }
    }

    .desc-ai-key {
      font-size: 14px;
      font-weight: 400;
      color: var(--font-content-color);
      ${ellipsisStyle};
    }
  }

  .footer {
    width: 100%;

    .footer-preview {
      width: 100%;

      .preview-tip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: var(--font-light-color);

        .preview-refresh {
          display: flex;
          cursor: pointer;
          gap: 4px;

          &:hover {
            color: var(--color-primary);
          }
        }
      }

      .preview-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        width: 100%;
        min-height: 26px;
        border-radius: 4px;
        border: 1px solid var(--color-border);
        line-height: 26px;
        background: var(--color-bg-page);
        gap: 10px;

        .anticon {
          color: var(--font-light-color);
          cursor: pointer;

          &:hover {
            color: var(--color-primary);
          }
        }

        &-text {
          flex: 1;
          width: 0;
          ${ellipsisStyle}
        }
      }
    }

    .footer-bth {
      /* stylelint-disable-next-line no-descending-specificity */
      .anticon {
        font-size: 18px;
      }

      > button {
        flex: 1;
      }

      .footer-bth-link {
        padding: 4px 0;
      }
    }
  }
`;

export const TreeDropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  box-sizing: border-box;

  .apipost-tabs {
    padding: 0 8px;
    box-sizing: border-box;
  }

  .apipost-select-tree-indent {
    width: 0;
  }
`;

export const TreeTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .label {
    max-width: 110px;
    ${ellipsisStyle}
  }

  .desc {
    flex: 1;
    width: 0;
    ${ellipsisStyle}
    font-size: 12px;
    text-align: right;
    color: var(--font-light-color);
  }
`;

export const TreeValueContainer = styled(Flex)`
  .value {
    width: max-content;
    ${ellipsisStyle}
  }

  .anticon {
    padding-left: 4px;
    font-size: 12px;
    cursor: pointer;
  }
`;
