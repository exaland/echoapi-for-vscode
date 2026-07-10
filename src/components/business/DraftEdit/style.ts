import styled from 'styled-components';

export const ContainerWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  width: 208px;
  max-height: 300px;
  overflow-y: auto;

  .item-title {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 28px;
    border-radius: var(--border-radius);
    background-color: var(--table-header-bg-color);

    &.margin {
      margin-top: 10px;
    }

    .pop-var-icon {
      width: 18px;
      height: 18px;
      font-size: var(--font-size-14);
      line-height: 18px;

      &.error {
        color: var(--color-error);
      }

      &.fixed {
        .anticon {
          color: #26cea4;
        }
      }
    }

    .pop-var-title {
      flex: 1;
      width: 0;
      overflow: hidden;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;

      &.green,
      &.fixed {
        color: #26cea4;
      }

      &.blue {
        color: #4c7cee;
      }

      &.global {
        color: #fa8c16;
      }

      &.red {
        color: var(--color-error);
      }
    }
  }

  .item-var {
    margin-top: 10px;
    color: var(--font-light-color);

    .var-name {
      width: 60px;
    }

    .var-value {
      margin-top: 5px;
      color: var(--font-content-color);
    }
  }

  .item-content {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    gap: 10px;

    .var-value {
      flex: 1;
      word-wrap: break-word;
      word-break: break-all;
    }

    .btn-copy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        background-color: rgb(0 0 0 / 2%);
      }
    }
  }

  .item-desc {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  .item-edit {
    display: flex;
    justify-content: flex-end;
  }
`;
export const DraftWrap = styled.div`
  &.mini-editor {
    display: flex;
    width: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji' !important;
    font-size: var(--font-size-14);
    line-height: 32px;
    font-weight: 400;
    color: var(--font-content-color);
    word-break: break-all;

    .DraftEditor-root {
      flex: 1;
      width: 0;
      overflow: hidden;

      /* font-size: var(--font-size-12); */

      /* .public-DraftEditorPlaceholder-root {
        margin: 4px;
      } */

      .DraftEditor-editorContainer {
        /* margin: 4px; */
        word-break: break-all;
      }

      .public-DraftEditorPlaceholder-root {
        color: var(--font-light-color);
      }
    }

    &.editor-no-wrap {
      .DraftEditor-root {
        .DraftEditor-editorContainer {
          white-space: nowrap;

          .public-DraftStyleDefault-block {
            white-space: nowrap;
          }
        }
      }
    }

    .tag-env {
      margin: 0 4px;
      border-radius: 4px;
      font-weight: 500;
      white-space: nowrap;
      color: #26cea4;
      cursor: pointer;

      &.global {
        color: #fa8c16;
      }
    }

    .tag-global {
      margin: 0 4px;
      border-radius: 4px;
      font-weight: 500;
      white-space: nowrap;
      color: #fa8c16;
      cursor: pointer;
    }

    .tag-error {
      margin: 0 4px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 300;
      text-decoration: line-through;
      white-space: nowrap;
      color: #ff4c4c;
      background-color: #e452521a;
    }
  }
`;
