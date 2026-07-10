import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';
import { API_METHODS_COLOR } from '@/constants/common';

export const UrrGroupWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  ${flexStyles('row', 'center', 'space-between')};
  position: relative;
  z-index: 999;
  padding: 2px;
  padding-left: 0;
  height: 36px;
  border-radius: var(--border-radius);
  background-color: var(--search-big-bg-color);
  border: 1px solid var(--color-border);
  .line{
    height: 18px;
    width: 1px;
    background: var(--color-border);
    margin-right: 4px;
  }
  .apipost-select-arrow {
    transform: rotate(0deg);
    font-size: var(--font-size-14);
    transition: all 0.3s linear;
  }
  
  .apipost-btn{
    height: 36px !important;
  }

  .apipost-select {
    height: 30px
  }

  .apipost-select-selector {
    box-shadow: none !important;
    .beautify-select-selection-search{
      input{
        height: 100% !important;
      }
    }
  }

  .apipost-select-open {
    .apipost-select-arrow {
      transform: rotate(180deg);
      transition: all 0.3s linear;
    }
  }

  .right-select-http {
    .apipost-select-selector {
      width: 100px;
      border: none !important;
    }
  }

  .apipost-select:not(.right-select) {
    /* margin-right: 8px; */

    .apipost-select-selector {
      background: transparent !important;
      max-width: 110px;
      border: none;
      border-radius: 0;
    }

    .apipost-select-selection-item {
      padding-right: 16px;
      font-weight: 600;
      color: ${() => API_METHODS_COLOR['default']};
    }

    &.post {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['POST']};
      }
    }

    &.get {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['GET']};
      }
    }

    &.put {
      .apipost-select-selection-item {
        color: #ff0;
        color: ${() => API_METHODS_COLOR['PUT']};
      }
    }

    &.delete {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['DELETE']};
      }
    }

    &.patch {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['PATCH']};
      }
    }

    &.raw {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['POST']};
      }
    }

    &.socket.io {
      .apipost-select-selection-item {
        color: ${() => API_METHODS_COLOR['POST']};
      }
    }
  }
  .beautify-select-selection-item{
    font-size: 12px !important;
  }
  .env-desc {
    overflow: hidden;
    font-size: var(--font-size-14);
    line-height: 36px;
    white-space: nowrap;
    color: var(--font-light-color);
    text-overflow: ellipsis;
  }

  .right-select {
    position: relative;
    .apipost-select-selector{
      background: transparent !important;
      border-radius: 0;
    }
    &:hover {
      .apipost-select-selector {
        /* background-color: var(--popover-select-bg-color) !important; */
      }
    }

    &.apipost-select-focused {
      .apipost-select-selector {
        /* background-color: var(--popover-select-bg-color) !important; */
      }
    }
  }

  .mini-editor {
    padding: 0 4px;
    height: 30px;
    /* border-radius: var(--border-radius); */
    border: 1px solid transparent;
    transition: all 0.3s;
    line-height: 28px;
    /* background-color: var(--background-color-fifth); */

    &::placeholder{
      color: var(--vscode-input-placeholderForeground);
    }

    &:hover,
    &.editor-active {
      border: 1px solid var(--color-primary);

      /* color: var(--content-color-primary); */
      background-color: var(--color-bg-right);
      appearance: none;
    }

    &.editor-active {
      height: auto;
    }

    &.editor-no-wrap {
      .DraftEditor-root {
        .DraftEditor-editorContainer {
          white-space: pre-wrap;

          .public-DraftStyleDefault-block {
            white-space: pre-wrap;
          }
        }
      }
    }
  }

  .grpc-url-name {
    ${flexStyles('row', 'center', 'center')}
    margin: 0 4px;
    height: 100%;
    font-size: var(--font-size-14);
    color: var(--font-content-color);
  }

  .grpc-method {
    color: var(--font-content-color);
  }

  .url-group-input {
    border-color: transparent;
    
    &:hover {
      border-color: var(--color-primary);
    }
  }

  .url-group-container {
    display: flex;
    flex-grow: 1;
    width: 0;
    height: 100%;

    .env-desc {
      max-width: 50%;
    }
    
  }
`;

export const MethodDropdownWrap = styled.div`
display: flex;
flex-direction: column;

.beautify-select-item{
    cursor: pointer;
    .select-item-icon-delete{
      display: none;
    }
    &:hover{
      background: var(--color-bg-folder-hover);
      .select-item-icon-delete{
      display: block;
    }
    .select-item-icon-delete:hover{
      color: var(--color-primary);
    }
    }
  }
`;

export const OptionsItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;

  .label {
    max-width: 100px;
    ${ellipsisStyle}
  }

  .uri {
    flex: 1;
    width: 0;
    text-align: right;
    ${ellipsisStyle}
    color: var(--font-light-color)
  }
`;
