import { Modal, Spin } from 'antd';

import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const PreviewContainer = styled(Modal)`
  .preview-tree {
    background: transparent;
  }

  .apipost-table-body {
    overflow-y: auto !important;
  }

  .import-project-full-tip {
    font-size: var(--font-size-12);
    color: var(--font-light-color);
  }

  .apipost-tree .apipost-tree-checkbox {
    margin-top: 0;
    align-self: auto;
  }

  .import-project-append-config {
    .apipost-select-outlined:not(.apipost-select-customize-input) .apipost-select-selector {
      /* background: var(--color-bg-right); */
    }
  }
`;

export const LoadingContainer = styled(Spin)`
  width: 100%;
  min-height: 500px;
  ${flexStyles('row', 'center', 'center')}
`;
