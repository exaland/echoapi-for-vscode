import styled, { css } from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const keyWarper = css`
  /* padding-left: 5px; */
  position: relative;

  .object,
  .any,
  .allOf,
  .oneOf,
  .anyOf {
    color: #1890ff;
  }

  .string,
  .array {
    color: #43a047;
  }

  .null {
    color: #fa7600;
  }

  .boolean,
  .integer,
  .number {
    color: #eb2f96;
  }

  &.schema-td-warper {
    .indent-panel {
      margin-right: 8px;
      margin-left: 8px;
      width: 18px;
      height: 32px;
      border: var(--color-border) 0 solid;
      border-left-width: 1px;
    }

    &.schema-width-auto {
      /* width: auto !important; */
    }
  }

  .caret-icon {
    svg {
      font-size: 10px;
    }
  }

  .btn-sort {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background-color: transparent;
    opacity: 0;
    cursor: move;

    svg {
      width: 6px;
      height: 10px;
    }

    &:hover {
      opacity: 1;
    }
  }

  .expand-btn {
    display: flex;
    align-items: center;
    width: 24px;
    height: 24px;

    svg {
      width: 8px;
      height: 8px;
      fill: var(--color-border);
    }
  }

  .empty-btn {
    display: flex;
    position: relative;
    z-index: 9;
    flex-direction: column;
    margin: 0 8px;
    width: 18px;
    height: 32px;

    .empty-btn-l {
      flex: 1;
      border-bottom: var(--color-border) 1px solid;
      border-left: var(--color-border) 1px solid;
    }

    .empty-btn-r {
      flex: 1;
      border-left: var(--color-border) 1px solid;
    }
  }

  .hidden-input {
    display: inline-block;
    padding: 0 8px !important;
    min-width: 80px;
    height: 100%;
    border-radius: 6px;
    font-size: var(--font-size-12);
    white-space: nowrap;
    background: inherit;
    opacity: 0;
    box-sizing: border-box;
  }

  .item-key-input-front {
    position: static !important;
    border: none;

    span {
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--color-primary);
      background-color: var(--color-primary-opacity);
    }
  }

  .item-key-input {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: flex-start;
    align-items: center;
    padding-left: 4px;

    /* height: 100%; */
    height: 32px;
    border-radius: 0;
    border: 1px solid transparent;
    font-size: var(--font-size-12);
    cursor: text;

    /* border-bottom: 1px solid var(--color-border); */
    &.readonly {
      position: static;
      width: auto !important;

      span {
        padding: 4px 8px;
        border-radius: 4px;
        color: var(--color-primary);
        background-color: var(--color-primary-opacity);
      }
    }
  }

  .item-key-input-hover {
    border: none;

    &:hover,
    &:focus {
      /* border-radius: 4px; */
      border-bottom: 1px solid var(--color-primary);
      background-color: transparent;
    }
  }

  .schema-text-box {
    flex: 1;
    margin-left: 8px;
    width: 0;
    min-width: 0;
    height: 100%;
    border-radius: 0;
    border: none;
    border-bottom: transparent 1px solid;
    color: var(--content-color-fourth);
    background-color: transparent;

    /* stylelint-disable-next-line selector-class-pattern */
    &:not(.items, .NodeRoot):hover {
      border-bottom: var(--base-color-brand) 1px solid;
      color: var(--content-color-primary);
    }

    &.item {
      &:hover {
        border-bottom: transparent 1px solid;
      }
    }
  }

  .item-type {
    display: flex;
    height: 27px !important;
    border-radius: 0;
    border-color: transparent;
    background-color: transparent;

    .sel-title {
      margin-right: 10px;
      width: 45px;
    }

    .spn-require {
      width: 16px;
      height: 16px;

      /* display: flex; */

      /* justify-content: center;
      align-items: center; */
      border-radius: 2px;
      font-size: var(--size-18px);
      line-height: 20px;
      text-align: center;
      color: var(--content-color-fourth);
      background-color: #ccc;

      &.checked {
        color: var(--base-color-brand);
      }
    }

    &:hover {
      border-color: var(--base-color-brand) !important;
    }
  }

  .btns-panel {
    display: flex;
    align-items: center;
    width: 80px;
  }
`;

export const BthsPanelDiv = styled.div`
  ${flexStyles('row', 'center', 'center')}
  padding: 0;
  height: 20px;
  color: var(--font-light-color);

  .item-required {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    ${flexStyles('row', 'center', 'center')}
    color: var(--font-light-color);
    background-color: var(--color-border);
    cursor: pointer;

    &.required {
      color: var(--color-primary);
    }
  }

  .item-empty {
    margin: 0 10px;
    width: 16px;
    height: 16px;
    ${flexStyles('row', 'center', 'center')}
    color: var(--font-light-color);
    cursor: pointer;

    &.empty {
      color: var(--color-primary);
    }
  }
`;

export const KeyWarperContainer = styled.div`
  width: auto;

  ${keyWarper}
  &:hover {
    .drag-icon {
      visibility: visible;
    }
  }

  /* .setting-confirm-container {
    .apipost-popconfirm-message {
      width: 100%;
    }

    .apipost-popconfirm-message-text {
      width: 100%;
    }

    .apipost-btn {
      padding: 1px 7px;
      width: auto;
      height: 24px;
    }

    .schema-setting {
      padding: 16px 0;

      .item-all-line {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 10px;
      }
    }
  } */
`;
