import styled, { css } from 'styled-components';

export const modelWarper = css`
  position: relative;

  .item-manage {
    display: none !important;
  }

  .drag-icon {
    visibility: hidden !important;
  }

  .item-key-input {
    pointer-events: none;
    caret-color: transparent;
  }

  .desc-row-description {
    .apipost-input {
      pointer-events: none;
      caret-color: transparent;
    }
  }

  .outer-box {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 2px);
    border: 1px solid transparent;

    .edit-form {
      display: none;
      position: absolute;
      top: -26px;
      left: 50%;
      transform: translateX(-50%);
      justify-content: space-around;
      align-items: center;
      width: 200px;
      height: 26px;
      border-radius: 4px 4px 0 0;
      background-color: var(--color-primary);

      .btn-item {
        display: flex;
        align-items: center;
        padding: 0 4px;
        width: auto;
        height: 18px;
        border-radius: 3px;
        font-size: var(--font-size-12);
        white-space: nowrap;
        color: #fff;
        cursor: pointer;

        svg {
          margin-right: 3px;
          width: 15px;
          height: 15px;
          fill: #fff;
        }

        &:hover {
          background-color: var(--highlight-background-color-brand);
        }
      }
    }
  }

  &:hover {
    .outer-box {
      z-index: 999;
      border-radius: 4px;
      border-color: var(--color-primary);
      background: #cccccc26;
      cursor: not-allowed;

      .edit-form {
        display: flex;
      }
    }

    .data-item {
      cursor: not-allowed;

      .apipost-btn {
        z-index: 1000;
      }

      .apipost-input {
        cursor: not-allowed;
      }

      &:hover {
        .btn-hide {
          display: flex;
        }

        .set-icon {
          visibility: visible !important;
        }
      }
    }

    .is-model-item {
      z-index: 202;
    }
  }

  .expand-btn {
    position: relative;
    z-index: 202;
  }

  .loop-link-item {
    padding: 5px 0 5px 20px;
    height: 28px;
  }
`;

export const ModelWarper = styled.div`
  ${modelWarper}
  .loop-empty-model {
    display: flex;
    z-index: 100;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding-left: 36px;
    height: 32px;
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    border-left: 1px solid var(--color-border);
    color: var(--font-light-color);
  }
`;
