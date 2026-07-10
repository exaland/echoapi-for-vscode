import styled, { css } from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const itemWrapper = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  .txt-description {
    flex: 1;
    min-width: 80px;
    border-color: transparent;
    line-height: 32px;

    &:not(.draft-active) {
      height: 33px;
    }

    &.draft-active {
      min-height: 33px;

      /* background-color: var(--background-color-primary); */
    }

    .DraftEditor-root {
      padding: 0 4px;
    }
  }

  .item-manage {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    width: 100px;
    height: 32px;

    .ai-icon {
      /* visibility: hidden !important; */
    }

    .delete-item-icon {
      /* visibility: hidden !important; */
    }

    .btn-item {
      margin-left: 10px;
      padding: 0;
      width: 20px;
      height: 20px;

      .add-svg {
        fill: #43a047;
      }
    }
  }

  .schema-item-desc {
    height: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid transparent;

    &:hover,
    &:focus {
      border-bottom: 1px solid var(--color-primary);
    }
  }
`;

export const itemModel = css`
  display: none;
`;

export const ItemWrapper = styled.div`
  ${itemWrapper}
  .desc-row-description {
    display: flex;
    min-width: calc(100% - 100px);
    height: 30px;

    .textarea {
      width: 100%;
    }

    .apipost-input {
      margin: 0 8px;
      padding: 2px 4px;
      width: calc(100% - 100px);
      min-height: 32px !important;
      overflow: hidden;
      border-radius: 0;
      border: 1px solid transparent;
      border-bottom: var(--color-border) 1px solid;
      font-size: 12px;
      resize: none;

      &:hover {
        height: 32px;

        /* border-radius: 4px; */
        border: 1px solid var(--color-primary);
        background-color: var(--highlight-change-color);

        /* background-color: var(--highlight-change-color); */
      }
    }

    .apipost-input:focus {
      z-index: 700;
      width: calc(100% - 100px);
      height: 32px;
      border-radius: 4px;

      /* border-radius: 4px; */
      border: 1px solid var(--color-primary);
      color: var(--font-content-color);
      background-color: var(--highlight-change-color);
    }

    .apipost-input::placeholder {
      line-height: 26px;
    }

    > textarea {
      border-radius: 0;
    }
  }

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
`;
