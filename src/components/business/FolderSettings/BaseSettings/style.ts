import styled from 'styled-components';

export const BaseSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .folder-base-config-wrap {
    .folder-base-input {
      /* padding-right: 0; */
      padding-left: 0;
      width: 100%;
      height: 32px;
      border-radius: 0;
      /* border: none;
      border-bottom: 1px solid transparent; */
      /* box-shadow: none;
      outline: none; */
      font-size: 16px;

      &:hover,
      &:focus {
        border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
        background: var(--vscode-input-background);
        box-shadow: none;
      }
    }

    .folder-save-wrap {
      .apipost-btn {
        margin-left: 20px;
      }
    }

    .folder-config-wrap {
      margin-top: 12px;
      width: 100%;

      .folder-config-item-wrap {
        overflow: hidden;
        flex: 1;

        > .label {
          color: var(--font-light-color);
        }

        &:last-of-type {
          margin-left: 12px;
        }

        .apipost-select {
          margin-top: 12px;
        }
      }
    }
  }

  .folder-content-wrap {
    overflow-y: auto;
    margin-top: 12px;

    .byte-md-wrap {
      flex: 1;
      height: 0;
    }
  }
`;

export const SelectGroupContainer = styled.span`
  font-size: 14px;
  color: var(--font-light-color);
`;
