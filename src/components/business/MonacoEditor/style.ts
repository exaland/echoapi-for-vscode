import styled from 'styled-components';

export const EditorWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid var(--color-border);

  .full-screen-btn {
    position: absolute;
    top: 4px;
    right: 16px;
    z-index: 10;

    .anticon {
      font-size: var(--font-size-16);
      color: var(--icon-color);
      cursor: pointer;

      &:hover {
        color: var(--icon-primary-color);
      }
    }
  }

  .monaco-editor {
    .margin {
      border-right: 1px solid var(--color-border);
    }
  }

  .monaco-editor-background {
    background: none;
  }

  /* .monaco-editor,
  .monaco-editor-background,
  .monaco-editor .inputarea.ime-input {
  } */

  .monaco-editor .view-overlays .current-line {
    border: 1px solid var(--color-border) !important;
  }

  .monaco-editor .scroll-decoration {
    display: none;
  }

  .dark {
    .monaco-editor .margin {
      background-color: var(--color-bg-right) !important;
    }

    .monaco-editor .monaco-editor-background {
      background-color: var(--color-bg-right) !important;
    }
  }
`;
