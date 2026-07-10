import styled from 'styled-components';

import Modal from '@/components/ui/Modal';

export const PathPickModalContainer = styled(Modal)`
  .json-path-content {
    display: flex;
    height: 400px;
    gap: 10px;

    .layout-item {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    .item-title {
      padding: 10px 0;
      height: 26px;
      font-weight: 400;
      box-sizing: content-box;
    }

    .item-content {
      flex: 1;
      resize: none;
      color: var(--color-bg-gray);

      .monaco-editor-value {
        overflow: visible !important;
        border: 1px solid var(--color-border);
      }
    }
  }
`;
