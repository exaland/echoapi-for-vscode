import styled from 'styled-components';

export const ResponseEmptyContainer = styled.div`
  height: 100%;

  &.mask-mode {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    height: calc(100% - 44px);
    background-color: var(--color-bg-right);
  }

  &.mask-error-mode {
    height: calc(100% - 56px);
  }

  .response-empty-wrap {
    .apipost-empty-image {
      margin-bottom: 16px;

      .icon-empty-wrap {
        font-size: 80px;
        color: var(--vscode-settings-headerBorder);
      }
    }

    .apipost-empty-description {
      font-size: var(--font-size-12);
      color: var(--vscode-tab-unfocusedInactiveForeground);
    }
  }
`;
