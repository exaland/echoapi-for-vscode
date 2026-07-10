import styled, { css } from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const selectRequestStyle = css`
  .apipost-select {
    .apipost-select-selector {
      padding-right: 42px;
      border-radius: 0;
      border-color: transparent;
      color: var(--color-primary);
    }

    .apipost-select-arrow {
      font-size: 16px;

      & > div {
        ${flexStyles('row', 'center', 'center')}
        .required {
          /* ${flexStyles('row', 'center', 'center')} */
          margin-left: 4px;
          width: 16px;
          height: 16px;
          border-radius: 2px;
          color: var(--font-content-color);
          background-color: var(--color-bg-gray);

          &.checked {
            color: rgb(255 76 76);
          }

          span {
            display: inline-block;
            margin-top: 1px;
            svg {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
`;

export const RowItemWrap = styled.div`
  height: 36px;
  width: 100%;
  ${flexStyles('row', 'flex-start', 'space-between')};

  .row-listen {
    height: 100%;
  }

  .checkbox-wrap {
    height: 100%;
    padding-inline: 4px 4px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .mini-editor {
    position: relative;
    padding: 4px 12px;
    border: 1px solid transparent;
    background-color: transparent;
    transition: all 0.3s;

    &:not(.editor-active) {
      z-index: 1;
      height: 36px;
      overflow: hidden;
      .insert-icon {
        visibility: hidden;
        color: var(--font-light-color);

        &.active {
          visibility: visible;
          color: var(--color-primary);
        }

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    &:hover,
    &.editor-active {
      border: 1px solid var(--color-primary);
      background-color: var(--highlight-change-color);
      appearance: none;
       /* stylelint-disable-next-line no-descending-specificity */
       .insert-icon {
        visibility: visible;
        color: var(--font-light-color);

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .DraftEditor-root {
      line-height: 24px;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .DraftEditor-editorContainer {
      margin: 0;
      border: 1px solid transparent;
      white-space: nowrap;
      box-sizing: content-box;
    }

    &.editor-active {
      z-index: 10;
      border-radius: 0;
      border: 1px solid var(--color-primary);
      background-color: var(--highlight-change-color);

      /* stylelint-disable-next-line selector-class-pattern */
      .DraftEditor-editorContainer {
        color: var(--font-content-color);
      }
    }
  }

  ${selectRequestStyle}
  .apipost-select {
    height: 36px;
  }

  .row-description {
    position: relative;
    width: 100%;

    .apipost-input {
      padding: 4px 12px;
      overflow: hidden;
      border: 1px solid transparent;
      resize: none;

      &:hover {
        border-color:var(--color-primary) !important;
        background-color: var(--highlight-change-color);
      }
    }

    .apipost-input:focus {
      z-index: 700;
      border: 1px solid var(--color-primary);
      color: var(--font-content-color);
      background-color: var(--highlight-change-color);
    }

    .apipost-input::placeholder {
      line-height: 28px;
    }
  }

  .delete-params-icon {
    margin-right: 1px;
    color: var(--font-light-color);

    &:hover {
      color: #ff583e;
    }
  }

  .params-action {
    display: inline-flex;
    align-items: center;

    .apipost-btn {
      width: 26px;
      border: none !important;
      background: none !important;
    }
  }

  .upload-wrapper {
    width: 100%;

    .apipost-upload {
      width: 100%;

      .apipost-btn {
        justify-content: start;
        width: 100%;
      }
    }
  }

  .file-name-wrap {
    padding: 8px 12px;
    ${flexStyles('row', 'center', 'space-between')};
    width: 100%;
    height: 100%;
    border: 1px solid transparent;

    .anticon {
      visibility: hidden;
      cursor: pointer;
    }

    &:hover {
      border-color: var(--color-primary);
      background-color: var(--highlight-change-color);

      .anticon {
        visibility: visible;
      }
    }
  }

  .apipost-select.apipost-select-auto-complete {
    width: 100%;

    > .apipost-select-selector {
      color: var(--font-content-color);
    }
  }
`;

export const BasicTableWrap = styled.div`
 position: relative;
  width: 100%;
  height: 100%;
  .apipost-table-thead {
    .apipost-table-cell {
      padding: 4px 10px;
      ${ellipsisStyle}
    }

    .query-eq-icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1px;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      font-size: var(--font-size-12);
      color: var(--font-content-color);
      background-color: var(--color-border);

      &.active {
        color: var(--color-primary);
      }

      .anticon {
        & > svg {
          font-size: 14px;
        }

        /* font-size: var(--font-size-16); */
      }
    }
  }

  .apipost-table-tbody {
    .insert-icon {
      visibility: hidden;
      color: var(--font-light-color);

      &.active {
        visibility: visible;
        color: var(--color-primary);
      }

      &:hover {
        color: var(--color-primary);
      }
    }
    tr {
      .row-description-operation {
        visibility: hidden;
      }

      &:hover {
        .row-description-operation,
        .insert-icon {
          visibility: visible;
        }
      }
    }
  }

  ${selectRequestStyle}
  .table-collapse {
    .apipost-collapse-header {
      padding: 12px;
    }

    .apipost-collapse-content-box {
      margin-bottom: 12px;
      padding: 0;
      padding-top: 0 !important;
    }
  }
`;

export const SelectFieldTypeOptionItem = styled.span`
  font-size: 12px;
  color: #E0790B;

  &.item-object {
    color: #067ced;
  }

  &.item-integer {
    color: #26cea4;
  }

  &.item-array {
    color: #d77fef;
  }

  &.item-boolean {
    color: #f7b327;
  }

  &.item-number {
    color: #fe5a41;
  }
`;

export const RequestTableContainer = styled.div`
  .apipost-table-thead {
    .apipost-table-cell {
      padding: 4px;
      padding-left: 12px;
      ${ellipsisStyle}
    }

    .query-eq-icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1px;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      font-size: var(--font-size-12);
      color: var(--font-content-color);
      background-color: var(--color-border);

      &.active {
        color: var(--color-primary);
      }

      .anticon {
        & > svg {
          font-size: 14px;
        }

        /* font-size: var(--font-size-16); */
      }
    }
  }

  .apipost-table-tbody {
    tr {
      .row-description-operation {
        visibility: hidden;
      }

      &:hover {
        .row-description-operation {
          visibility: visible;
        }
      }

      .delete-params-icon {
        margin-right: 1px;
        color: var(--font-light-color);

        &:hover {
          color: #ff583e;
        }
      }
    }
  }

  ${selectRequestStyle}
  .table-collapse {
    .apipost-collapse-header {
      padding: 12px;
    }

    .apipost-collapse-content-box {
      margin-bottom: 12px;
      padding: 0;
      padding-top: 0 !important;
    }
  }
`;