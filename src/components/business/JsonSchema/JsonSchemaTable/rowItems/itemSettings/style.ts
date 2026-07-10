import styled, { createGlobalStyle, css } from 'styled-components';

import { keyWarper } from '../itemKey/style';

export const settingsWrapper = css`
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-12);

  .set-title {
    padding-left: 10px;
    height: 26px;
    line-height: 26px;
  }

  .base-setting {
    padding: 10px 0;

    ${keyWarper}
    .item-all-line {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 8px;

      &.item-necessarily {
        height: 28px;
      }
    }

    .item-line {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      padding-bottom: 10px;

      .apipost-input-number {
        display: flex;
        align-items: center;
        box-sizing: border-box;

        .apipost-input-inner-wrapper {
          height: 28px !important;
          border: none !important;
        }
      }

      .apipost-input,
      .apipost-select-selector {
        font-size: 12px;
      }

      .case-title {
        display: flex;

        /* justify-content: flex-end; */
        align-items: center;
        padding-right: 10px;
        min-width: 82px;
        height: 28px;
        text-align: right;
        white-space: nowrap;

        .apipost-checkbox {
          margin-right: 8px;
        }
      }

      .case-value {
        display: flex;
        flex: 1;
        flex-direction: row-reverse;
        border-radius: 4px;
        line-height: 28px;

        .apipost-input,
        .apipost-textarea {
          min-width: 100px !important;
          height: 28px;

          /* border-radius: 4px; */
        }

        .apipost-input-inner-wrapper,
        .apipost-input-number {
          min-width: 100px;
          height: 28px;
        }

        .apipost-textarea-wrapper {
          min-width: 100px;
          height: 60px !important;
          border-color: transparent;

          .apipost-textarea {
            height: 100%;
            overflow-y: auto;
          }
        }

        .apipost-textarea:focus {
          background-color: transparent;
        }

        .apipost-select {
          min-width: 100px;
          height: 28px;
        }

        /* .mention_textarea {
          border: 1px solid transparent;
          height: 37px;
        } */
      }

      .case-value-block {
        flex: 1;
      }
    }
  }

  .source-setting {
    flex: 1;
    margin: 10px 0;
    padding-top: 10px;
    height: 0;
    border: 1px solid transparent;
    border: 1px solid var(--color-border);
  }
`;

export const SettingsWrapperContainer = styled.div`
  ${settingsWrapper}
  position: relative;
  justify-content: space-between;

  /* height: 300px; */
  font-size: 12px;

  .apipost-popconfirm-description {
    position: relative;
  }

  .apipost-input {
    background-color: var(--search-big-select-color);
    box-shadow: none;
  }

  .apipost-input-number {
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

  .source-help {
    position: absolute;
    bottom: -31px;
    left: 0;
    font-size: 12px;
    line-height: 24px;
    font-weight: 400;
    text-align: left;

    .source-tip {
      cursor: pointer;
    }

    button {
      margin-inline-start: 8px;
      height: 24px;
    }
  }

  .apipost-segmented {
    width: 100%;

    .apipost-segmented-item {
      flex: 1;
    }
  }
`;

export const SettingContent = styled.div`
  min-width: 14px;

  .set-icon {
    visibility: hidden;
    color: var(--font-light-color);
    cursor: pointer;
  }
`;

export const SchemasPopStyle = createGlobalStyle`
.setting-confirm-container {
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
        padding-top: 10px;
      }
    }
  }
`;
